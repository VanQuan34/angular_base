import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  Output,
  Input,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ToastTranslateService } from "../../api/common/toast-translate.service";
// import { DefineConstants } from "../../common/define/constants.define";
export interface IPopupBuilderFile {
  id: string;
  name?: string;
  file?: any;
  size?: string;
  loading?: boolean;
  type?: "FILE";
  uploaded?: boolean;
  isUpdate?: boolean;
  url?: string;
  origin_url?: string;
  mimetype?: string;
  isError?: boolean;
}

@Component({
  selector: "mo-wb-upload",
  templateUrl: "upload.component.html",
  styleUrls: ["upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbUploadComponent implements OnInit {
  loading: boolean = false;
  fileList: IPopupBuilderFile[] = [];
  uploadFinished: boolean = false;
  isEmptyError: boolean = false;
  fileListHeight: string = "auto";
  accessFiles: string = "";
  isFile?: boolean;
  fileName?: string;
  disable: boolean = false;
  minHeight: number = 50;

  @Input() title: string = 'i18n_template_file_popup';
  @Input() desc: string = 'i18n_limit_template_file_popup';
  @Input() expiredDays: number = 30; // so ngay het han
  @Input() originFiles: IPopupBuilderFile[] = [];
  @Input() onError!: boolean;

  @Output() onClose = new EventEmitter<any>();
  @Output() onReadFileSuccess = new EventEmitter<any>();
  @Output() onRemoveUploadFile = new EventEmitter<any>();

  @ViewChild("upload") uploadRef!: ElementRef;
  @ViewChild("uploadInput") uploadInputRef!: ElementRef;
  @ViewChild("info") infoRef!: ElementRef;
  @ViewChild("error") errorRef!: ElementRef;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _toast: ToastTranslateService
  ) { }

  ngOnInit() {
    this.isFile = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAccessFiles();
      this.fileList = [];
      this.initUploadEvent();
    }, 0);
  }

  initAccessFiles() {
    let accessExts = ['.mopp'];
    this.accessFiles = accessExts
      .map((ext: string) => {
        return `.${ext}`;
      })
      .join(",");
  }

  initUploadEvent() {
    this.uploadRef.nativeElement.removeEventListener(
      "click",
      this.handleOnUploadFileClick
    );
    this.uploadRef.nativeElement.addEventListener(
      "click",
      this.handleOnUploadFileClick
    );

    this.uploadInputRef.nativeElement.removeEventListener(
      "change",
      this.handleOnUploadFile
    );
    this.uploadInputRef.nativeElement.addEventListener(
      "change",
      this.handleOnUploadFile
    );

    this.uploadRef.nativeElement.removeEventListener(
      "dragover",
      this.handleOnMultipleDragEvent
    );
    this.uploadRef.nativeElement.addEventListener(
      "dragover",
      this.handleOnMultipleDragEvent
    );

    this.uploadRef.nativeElement.removeEventListener(
      "dragover",
      this.handleOnDragOver
    );
    this.uploadRef.nativeElement.addEventListener(
      "dragover",
      this.handleOnDragOver
    );

    this.uploadRef.nativeElement.removeEventListener(
      "dragenter",
      this.handleOnDragOver
    );
    this.uploadRef.nativeElement.addEventListener(
      "dragenter",
      this.handleOnDragOver
    );

    this.uploadRef.nativeElement.removeEventListener(
      "dragleave",
      this.handleOnDragEnd
    );
    this.uploadRef.nativeElement.addEventListener(
      "dragleave",
      this.handleOnDragEnd
    );

    this.uploadRef.nativeElement.removeEventListener(
      "dragend",
      this.handleOnDragEnd
    );
    this.uploadRef.nativeElement.addEventListener(
      "dragend",
      this.handleOnDragEnd
    );

    this.uploadRef.nativeElement.removeEventListener(
      "drop",
      this.handleOnDragDrop
    );
    this.uploadRef.nativeElement.addEventListener(
      "drop",
      this.handleOnDragDrop
    );
  }

  getFileExtension(file: any) {
    const fileName = file.name;
    if (!fileName) {
      return false;
    };
    let dots = fileName.split(".");
    if (dots.length <= 0) {
      return false;
    }
    let extension = dots[dots.length - 1];
    return extension;
  };

  checkValidFileExtension(file: any) {
    let extension = this.getFileExtension(file);
    if (!extension) {
      return false;
    }
    if (extension !== 'mopp') {
      return false;
    }
    return true;
  }

  handleOnUploadFileClick = (e: any) => {
    e.stopPropagation();
    this.uploadInputRef.nativeElement.click();
  };

  handleOnUploadFile = (e: any) => {
    let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    if (!this.checkValidFileExtension(file) || file.size > 10000000) {
      this._toast.show('error', 'i18n_invalid_file_upload');
      return;
    }

    this.isFile = true;
    this.fileName = file.name;
    let reader = new FileReader();
    reader.onload = () => {
      this.onReadFileSuccess.emit(reader.result);
    };
    reader.readAsText(file);
  };

  handleOnDragDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.uploadRef.nativeElement.classList.remove("drag-over");
    this.handleOnUploadFile(e);
  };

  handleOnMultipleDragEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleOnDragOver = () => {
    this.uploadRef.nativeElement.classList.add("drag-over");
  };

  handleOnDragEnd = () => {
    this.uploadRef.nativeElement.classList.remove("drag-over");
  };

  handleOnFileItemClick(e: any) {
    e.stopPropagation();
    this.onRemoveUploadFile.emit({});
  }

  handleOnRemoveFileClick(e: any) {
    e.stopPropagation();
    this.isFile = false;
    this._changeDetector.detectChanges();
  }
}
