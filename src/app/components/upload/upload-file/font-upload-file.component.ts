import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
// import { DefineConstants } from '../../../common/define/constants.define';
import { ToastTranslateService } from '../../../api/common/toast-translate.service';

export interface IMediaFile {
  id: string;
  name?: string;
  file?: any;
  size?: string;
  loading?: boolean;
  type?: 'IMAGE' | 'FILE';
  uploaded?: boolean;
  isUpdate?: boolean;
  url?: string;
  origin_url?: string;
  mimetype?: string;
  isError?: boolean;
}
@Component({
  selector: 'mo-wb-upload-font-file',
  templateUrl: './font-upload-file.component.html',
  styleUrls: ['./font-upload-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MoWbUploadFileComponent implements OnInit {

  accessFiles: string = '';
  isFile?: boolean;
  fileName?: string;

  @Input() title!: string;
  @Input() classStyleTitle!: string;
  @Input() buttonTriggerClick: string = '';
  @Output() onFileChanged = new EventEmitter<any>();
  @Output() onReadFileSuccess = new EventEmitter<any>();


  @ViewChild('upload') uploadRef!: ElementRef;
  @ViewChild('uploadFileInput') uploadInputRef!: ElementRef;
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService

  ) {

  }

  ngOnInit(): void {
    this.isFile = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAccessFiles();
      this.initUploadEvent();
    }, 0);
  }
  initAccessFiles() {
    let accessExts = ['.ttf', '.otf', '.woff'];
    this.accessFiles = accessExts
      .map((ext: string) => {
        return `.${ext}`;
      })
      .join(",");
  }
  initUploadEvent() {
    this.uploadRef.nativeElement.removeEventListener(
      "click",
      this.handlerClickUploadFile
    );
    this.uploadRef.nativeElement.addEventListener("click", this.handlerClickUploadFile)

    this.uploadInputRef.nativeElement.removeEventListener(
      "change",
      this.handleOnUploadFile
    );
    this.uploadInputRef.nativeElement.addEventListener("change", this.handleOnUploadFile);
  }

  getFileExtension(file: any) {
    const fileName = file.name.toLowerCase();
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
    if (extension !== 'ttf' && extension !== 'otf' && extension !== 'woff') {
      return false;
    }


    return true;
  }

  handlerClickUploadFile = (e: any) => {
    e.stopPropagation();
    this.uploadInputRef.nativeElement.click();
  }

  handleOnUploadFile = (e: any) => {
    // this.handleUploadFiles(e);
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
    this.onReadFileSuccess.emit({ file: file, styleFont: this.title });
    this.uploadInputRef.nativeElement.value = null;
    this.changeDetection.detectChanges();

  }

  handleOnRemoveFileClick(e: any) {
    e.stopPropagation();
    this.isFile = false;
    this.onReadFileSuccess.emit({ file: '', styleFont: this.title });
    this.changeDetection.detectChanges();
  }


}



