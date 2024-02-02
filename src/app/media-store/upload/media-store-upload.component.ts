import {
  Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, Injector,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
// import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
// import { AddComponentToBodyService } from 'src/app/service/common/add-component-to-body.service';
// import { MoWbFileApiService } from 'src/app/service/fileApiService';
import { MoWbMediaStoreEditModalComponent } from '../edit/media-store-edit.component';
import { MoWbMediaStoreModalComponent } from '../store-modal/media-store-modal.component';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
// import { DefineConstants } from 'src/app/common/define/constants.define';
// import { IValidRequired } from 'src/app/common/api/valid';
import { TranSlateI18nPipe } from 'src/app/pipe/pipeTraslateI18n';
import { TranslateService } from '@ngx-translate/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { isHidden } from '@amcharts/amcharts4/.internal/core/utils/DOM';
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
  target_path?: string;
  imageSize?: {
    width: number,
    height: number
  }
}
@Component({
  selector: 'mo-wb-media_store_upload',
  templateUrl: './media-store-upload.component.html',
  styleUrls: ['./media-store-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreUploadComponent implements OnInit {

  loading: boolean;
  fileList: IMediaFile[] = [];
  // accessExts: Array<any> = [];
  uploadFinished: boolean;
  isEmptyError: boolean;
  fileListHeight: string = 'auto';
  accessFiles: string = '';

  @Input() multiple: boolean = true;
  @Input() limitFile: number = 10;
  @Input() maxImageSize: number = 5*1024*1024;
  @Input() maxFileSize: number = 10*1024*1024;
  @Input() type: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() folderId: string = null;
  @Input() folderName: string = 'i18n_default';
  @Input() expiredDays: number = 30; // so ngay het han
  @Input() doNotDelete: boolean = false; // Khong xoa file
  @Input() fileExtList: string[] = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
  @Input() imgExtList: string[] = ['gif', 'jpg', 'jpeg', 'png'];
  @Input() displayType: 'IMAGE' | 'LIST' = 'LIST';
  @Input() originFiles: IMediaFile[] = [];
  @Input() mode: 'UPLOAD' | 'FILE' = 'UPLOAD';
  @Input() hasInfo: boolean = true;
  @Input() maxTotalSize: number // don vi la MB.
  @Input() validRequired: any;
  @Input() disable: boolean;
  @Input() minHeight: number = 158;
  @Input() ignoreEditFile: boolean;

  @Output() onClose = new EventEmitter<any>();
  @Output() onUploadSuccess = new EventEmitter<any>();
  @Output() onFileChanged = new EventEmitter<any>();
  @Output() onValidationFailed = new EventEmitter<any>();

  // @Output() onValidationFailed = new EventEmitter<any>();

  @ViewChild('upload') uploadRef: ElementRef;
  @ViewChild('uploadInput') uploadInputRef: ElementRef;
  // @ViewChild('container') containerRef: ElementRef;
  @ViewChild('containerTop') containerTopRef: ElementRef;
  @ViewChild('filelist') fileListRef: ElementRef;
  @ViewChild('imageContainer') imageContainerRef: ElementRef;
  @ViewChild('info') infoRef: ElementRef;
  @ViewChild('error') errorRef: ElementRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    // private _fileApiService: MoWbFileApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private tranSlateI18nPipe: TranSlateI18nPipe,
    private _translate: TranslateService
  ) { }

  ngOnInit() {
    this.changeDetection.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAccessFiles();
      this.fileList = [...this.originFiles];
      if (this.mode === 'UPLOAD') {
        this.initUploadEvent();
      } else {
        this.uploadRef.nativeElement.removeEventListener('click', this.handleOnOpenStoreMedia);
        this.uploadRef.nativeElement.addEventListener('click', this.handleOnOpenStoreMedia);
      }
    }, 0);
    // this.changeDetection.detectChanges();
  }

  initAccessFiles() {
    let accessExts: any[] = [];
    if (this.type === 'ALL' ) {
      accessExts = [...this.fileExtList, ...this.imgExtList];
    }
    if (this.type === 'IMAGE') {
      accessExts = [...this.imgExtList];
    }
    if (this.type === 'FILE') {
      accessExts = [...this.fileExtList];
    }

    this.accessFiles = accessExts.map((ext: string) => {
      return `.${ext}`;
    }).join(',');

    console.log('accessFiles=',this.accessFiles);
  }

  initUploadEvent() {

    this.uploadRef.nativeElement.removeEventListener('click', this.handleOnUploadFileClick);
    this.uploadRef.nativeElement.addEventListener('click', this.handleOnUploadFileClick);

    this.uploadInputRef.nativeElement.removeEventListener('change', this.handleOnUploadFile);
    this.uploadInputRef.nativeElement.addEventListener('change', this.handleOnUploadFile);

    this.uploadRef.nativeElement.removeEventListener('dragover', this.handleOnMultipleDragEvent);
    this.uploadRef.nativeElement.addEventListener('dragover', this.handleOnMultipleDragEvent);

    this.uploadRef.nativeElement.removeEventListener('dragover', this.handleOnDragOver);
    this.uploadRef.nativeElement.addEventListener('dragover', this.handleOnDragOver);

    this.uploadRef.nativeElement.removeEventListener('dragenter', this.handleOnDragOver);
    this.uploadRef.nativeElement.addEventListener('dragenter', this.handleOnDragOver);


    this.uploadRef.nativeElement.removeEventListener('dragleave', this.handleOnDragEnd);
    this.uploadRef.nativeElement.addEventListener('dragleave', this.handleOnDragEnd);

    this.uploadRef.nativeElement.removeEventListener('dragend', this.handleOnDragEnd);
    this.uploadRef.nativeElement.addEventListener('dragend', this.handleOnDragEnd);

    this.uploadRef.nativeElement.removeEventListener('drop', this.handleOnDragDrop);
    this.uploadRef.nativeElement.addEventListener('drop', this.handleOnDragDrop);

  }

  handleOnUploadFileClick = (e: any) => {
    e.stopPropagation();
    // console.log('handleOnUploadFileClick multiple=', this.multiple, ' fileList=', this.fileList.length);
    if (!this.multiple && this.fileList.length > 0) {
      return;
    }
    this.uploadInputRef.nativeElement.click();
    // const acceptType = this.type === 'IMAGE' ? `.${this.imgExtList.join(',.')}` : this.type === 'FILE' ? `.${this.fileExtList.join(',.')}` : undefined;
    // if (acceptType) {
    //   this.uploadInputRef.nativeElement.setAttribute('accept', acceptType);
    // }
  }

  handleOnUploadFile = (e: any) => {
    this.handleUploadFiles(e);
    this.uploadInputRef.nativeElement.value = null;
  }

  handleOnMultipleDragEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleOnDragOver = (e: any) => {
    this.uploadRef.nativeElement.classList.add('drag-over');
  }

  handleOnDragEnd = (e: any) => {
    this.uploadRef.nativeElement.classList.remove('drag-over');
  }

  handleOnDragDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.uploadRef.nativeElement.classList.remove('drag-over');
    this.handleUploadFiles(e);
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  handleOnFileItemClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }
  handleOnEditFileClick(e: any, fileItem: any) {
    e.preventDefault();
    e.stopPropagation();
    if (this.loading) {
      return;
    }
    if (fileItem.file) {
      this.getFileDataUrl(fileItem.file, (dataUrl: any) => {
        this.showEditModal(dataUrl, fileItem);
      });
    } else {
      this.showEditModal(fileItem.origin_url, fileItem);
    }

  }

  handleOnRemoveFileClick(e: any, fileItem: any) {
    e.preventDefault();
    e.stopPropagation();
    if (this.loading) {
      return;
    }
    this.removeFile(fileItem);
  }

  handleUploadFiles = (e: any) => {
    let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length <= 0) {
      return;
    }

    if (!this.multiple && this.fileList.length) {
      return;
    }

    if (!this.multiple) {
      files = [files[0]];
    }

    const remainFileTotal = this.limitFile - this.fileList.length;
    if (files.length > remainFileTotal) {
      // let message = `Giới hạn tối đa ${this.limitFile} files trên 1 lần tải lên.`;
      let message = this.tranSlateI18nPipe.transform(this._translate.instant('i18n_limit_file_in_uploads'), this.limitFile);
      this._toast.show('error', message);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // fix svg file is not edit
      const isImage = file.type.match(/image.*/) && !file.type.includes('svg') ? true : false;
      if (!this.checkValidFileExtension(file)) {
        // this._toast.show(DefineConstants.TOAST_ERROR_FUNCTION_NAME, `File ${file.name} có định dạng không hợp lệ. Vui lòng lựa chọn lại.`);
        this._toast.show('error', this.tranSlateI18nPipe.transform(this._translate.instant('i18n_file_format_invalid_message'), file.name));
        continue;
      }

      const isOverSize = !this.checkValidFileSize(file);
      if (isOverSize) {
        // this._toast.show(DefineConstants.TOAST_ERROR_FUNCTION_NAME, `File ${file.name} có dung lượng ${this.convertFileSize(file.size)} vượt quá giới hạn cho phép.`);
        if (isImage) {
          this._toast.show('error', `${this._translate.instant('i18n_image')} ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxImageSize,0)}. ${this._translate.instant('i18n_select_again')}`);
        } else {
          this._toast.show('error', `File ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxFileSize,0)}. ${this._translate.instant('i18n_select_again')}`);
        }
        continue;
      }

      const newFile: IMediaFile = {
        name: file.name,
        file: file,
        size: this.convertFileSize(file.size),
        type: isImage ? 'IMAGE' : 'FILE',
        isError: isOverSize,
        id: `${Math.floor(Math.random() * 1000) + 1000}`
      };

      this.getFileDataUrl(file, (dataUrl: string, size: {width: number, height: number}) => {
        newFile.url = dataUrl;
        newFile.imageSize = size;
      });

      this.fileList.splice(0, 0, newFile);
    }

    if (this.fileList.length) {
      this.isEmptyError = false;
    }

    this.changeDetection.detectChanges();
    this.onFileChanged.emit(this.fileList);
    // this.updateModalHeight();
  }

  handleOnImageItemClick(event: any) {
    event.stopPropagation();
  }

  handleOnCropButtonClick(event: any, item: any) {
    event.stopPropagation();
    this.showEditModal(item.url || item.origin_url, item);
  }

  handleOnRemoveButtonClick(event: any, item: any) {
    event.stopPropagation();
    this.removeFile(item);
  }

  handleOnOpenStoreMedia = (event: any) => {
    event.stopPropagation();
    this.showStoreMediaModal();
  }

  removeFile(fileItem: any) {
    this.fileList = this.fileList.filter((item: any) => {
      if (item.id === fileItem.id) {
        return false;
      }
      return true;
    });

    this.changeDetection.detectChanges();
    this.onFileChanged.emit(this.fileList);
  }

  getFileDataUrl(file: any, callback: (dataUrl: any, size: {width: number, height: number}) => void) {
    const fileName = file.name;
    const fileType = file.type;
    if (!file.type.match(/image.*/)) {
      return;
    }
    // Load the image
    var reader = new FileReader();
    reader.onload = function (readerEvent) {
      var image = new Image();
      image.onload = function (imageEvent) {
        // console.log('getFileDataUrl width = ', image.width);
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL(fileType);
        callback(dataUrl, {width: canvas.width, height: canvas.height});
      }
      image.src = `${reader.result}`;
    }
    reader.readAsDataURL(file);
    this.changeDetection.detectChanges();
  };

  showEditModal(fileDataUrl: string, fileItem: IMediaFile) {
    const editModalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditModalComponent).create(this.injector);
    editModalRef.instance.imgSrcList = [fileDataUrl];
    editModalRef.instance.mode = 'FILE';
    // close modal
    editModalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(editModalRef);
      }, 500);
    });

    editModalRef.instance.onFileSelected.subscribe((result: any) => {
      fileItem.file = this.blobToFile(result.file, fileItem.name);
      fileItem.size = this.convertFileSize(result.file.size);
      fileItem.isError = !this.checkValidFileSize(result.file);
      fileItem.url = result.url;
      fileItem.isUpdate = true;
      this.changeDetection.detectChanges();
      this.onFileChanged.emit(this.fileList);
    });

    this._domService.addDomToBody(editModalRef);
    editModalRef.instance.showModal();
  }

  showStoreMediaModal() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this.injector);
    modalRef.instance.mode = this.type;
    modalRef.instance.multiple = this.multiple;
    modalRef.instance.maxImageSize = this.maxImageSize;
    modalRef.instance.maxFileSize = this.maxFileSize;
    modalRef.instance.maxTotalFileSize = this.maxTotalSize;
    modalRef.instance.maxSelected = this.limitFile - this.fileList.length;

    modalRef.instance.selectedFileUrls = this.fileList.map((item: any) => {
      return item.url || item.origin_url;
    });
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectedFiles.subscribe((files: any[]) => {
      const addFiles: IMediaFile[] = files.map((item: any) => {
        const file: IMediaFile = {
          id: item.id,
          name: item.filename,
          origin_url: item.origin_url,
          target_path: item.target_path,
          size: item.origin_capacity,
          mimetype: item.mimetype,
          type: item.isImage ? 'IMAGE' : 'FILE',
          uploaded: true
        }
        // console.log('file=',file, ' item=',item);
        return file;
      });

      for (let i = 0; i < addFiles.length; i++) {
        this.fileList.splice(0, 0, addFiles[i]);
      }
      this.onFileChanged.emit(this.fileList);
    });

    this._domService.addDomToBody(modalRef);
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
    switch (this.type) {
      case 'FILE':
        if (this.fileExtList.indexOf(extension.toLowerCase()) < 0) {
          return false;
        }
        return true;
      case 'IMAGE':
        if (this.imgExtList.indexOf(extension.toLowerCase()) < 0) {
          return false;
        }
        return true;
      case 'ALL':
        if (this.fileExtList.indexOf(extension.toLowerCase()) < 0 && this.imgExtList.indexOf(extension.toLowerCase()) < 0) {
          return false;
        }
        return true;
      default:
        return false;
    }
  }

  checkValidFileSize(file: any) {
    const isImage = file.type.match(/image.*/) ? true : false;
    // console.log('checkValidFileSize size=', file.size, ', limit=', this.maxImageSize);
    switch (this.type) {
      case 'FILE':
        if (file.size > this.maxFileSize) {
          return false;
        }
        return true;
      case 'IMAGE':
        if (file.size > this.maxImageSize) {
          return false;
        }
        return true;
      case 'ALL':
        if (isImage) {
          if (file.size > this.maxImageSize) {
            return false;
          }
          return true;
        }
        if (file.size > this.maxFileSize) {
          return false;
        }
        return true;
      default:
        return false;
    }
  }

  checkValidSizeAllFiles() {
    let valid = true;
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i].file;
      if (!this.checkValidFileSize(file)) {
        valid = false;
        const isImage = file.type.match(/image.*/) ? true : false;
        if (isImage) {
          this._toast.show('error', `${this._translate.instant('i18n_image')} ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxImageSize,0)}. ${this._translate.instant('i18n_select_again')}`);
        } else {
          this._toast.show('error', `File ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxFileSize,0)}. ${this._translate.instant('i18n_select_again')}`);
        }
        
      }
    }
    this.changeDetection.detectChanges();
    return valid;
  }

  convertFileSize(size: number, toFixed: number = 2) {
    if (size < 1024*1024) {
      return ` ${(size / 1024).toFixed(toFixed)} KB`;
    }

    return ` ${(size / (1024*1024)).toFixed(toFixed)} MB`;
  }

  validate() {
    if (!this.fileList.length) {
      this.isEmptyError = true;
      this.changeDetection.detectChanges();
      return false;
    }

    this.isEmptyError = false;
    return true;
  }

  uploadFiles(folderId: string = '-1') {
    if (!this.validate()) {
      this.onValidationFailed.emit({});
      return;
    }
    this.uploadFinished = false;
    this.loading = true;
    console.log('uploadFiles folderId=', folderId);
    // this.changeDetection.detectChanges();
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i];
      this.doUploadFile(file, folderId !== '-1' ? folderId : this.folderId);
    }
  }

  async doUploadFile(file: any, folderId: string) {
    file.loading = true;
    // const response = await this._fileApiService.uploadFile(file.file, folderId, file.name, false, file.imageSize);
    // file.loading = false;
    // if (response) {
    //   file.uploaded = true;
    //   file.isUpdate = false;
    //   this.changeDetection.detectChanges();
    //   // this._toast.show(DefineConstants.TOAST_SUCCESS_FUNCTION_NAME, `Upload file ${file.name} thành công.`);
    //   this.removeFile(file);
    //   this.checkCompleteUpload();
    //   return;
    // }

    this.checkCompleteUpload();
    this.changeDetection.detectChanges();
    // this._toast.show(DefineConstants.TOAST_ERROR_FUNCTION_NAME, `Upload file ${file.name} thất bại.`);
  }

  checkCompleteUpload() {
    let result = true;
    for (let i = 0; i < this.fileList.length; i++) {
      if (this.fileList[i].loading) {
        result = false;
      }
    }
    if (result) {
      this.uploadFinished = true;
      this.loading = false;
      if (!this.fileList.length) {
        this._toast.show('success', 'i18n_notification_manipulation_success');
      }
      setTimeout(() => {
        this.onUploadSuccess.emit({});
      }, 1000);
      this.changeDetection.detectChanges();
    }
    return result;
  }

  getModalContainerHeight(containerTopHeight: number) {
    console.log('media store upload');
    
    const infoHeight = this.infoRef.nativeElement.offsetHeight | 0;
    const errorHeight = this.errorRef.nativeElement.offsetHeight | 0;
    const uploadHeight = this.uploadRef.nativeElement.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxHeight = windowHeight - 40 - 104;

    let containerHeight;
    if (this.displayType === 'LIST') {
      containerHeight = this.fileList.length ? this.fileList.length * 36 + 30 + 100 + 12 + infoHeight + errorHeight + containerTopHeight :
        uploadHeight + 12 + infoHeight + errorHeight + containerTopHeight;
    } else {
      containerHeight = this.uploadRef.nativeElement.offsetHeight + infoHeight + errorHeight + containerTopHeight + 12;
    }
    containerHeight = Math.min(maxHeight, containerHeight);
    if (this.fileList.length && this.displayType === 'LIST') {
      this.fileListHeight = `${containerHeight - (12 + infoHeight + errorHeight + 100 + containerTopHeight)}px`;
    }

    containerHeight = Math.max( this.minHeight + 12 + containerTopHeight , containerHeight );
    return containerHeight;
  }

  getFiles() {
    return this.fileList;
  }

  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

}
