import { ChangeDetectionStrategy, ChangeDetectorRef, Component, 
  ComponentFactoryResolver, ElementRef, EventEmitter, Injector, 
  Input, Output, ViewChild, ViewRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastTranslateService } from "src/app/api/common/toast-translate.service";
// import { MoWbFileApiService } from "src/app/api/media/fileApiService";
import { AddComponentToBodyService } from "src/app/api/common/add-component-to-body.service";
// import { MoWbMediaStoreModalComponent } from "src/app/media-store/store-modal/media-store-modal.component";
// import { MoWbMediaStoreEditModalComponent } from "src/app/media-store/edit/media-store-edit.component";
import { MoWbDetectionComponent } from "../../detection.component";
// import { IWrapFile } from "src/app/common/types/media/wrap-file";
import { uid } from "uid";
import { MoWbManagerImagesApiService } from "src/app/api/files/filesApi";
// import { settings } from "cluster";

export interface IValidRequired {
  message?: string; // không có message sẽ sử dụng message mặc định
  isRequired: boolean;
  interpolateParams?: Object;
}

@Component({
  selector: 'mo-wb-components-file-upload-v4',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbFileUploadV4Component extends MoWbDetectionComponent {

  loading: boolean = false;
  hideProgressBar: boolean = false;
  fileList: any = []; //IWrapFile[]
  uploadFinished: boolean;
  isEmptyError: boolean;
  fileListHeight: string = 'auto';
  accessFiles: string = '';

  fileUpload: any;

  @Input() multiple: boolean = true;
  @Input() limitFile: number = 10;
  @Input() maxImageSize: number = 5 * 1024 * 1024;
  @Input() maxFileSize: number = 10 * 1024 * 1024;
  @Input() type: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() folderId: string = null;
  @Input() folderName: string = 'i18n_default';
  @Input() expiredDays: number = 30; // so ngay het han
  @Input() doNotDelete: boolean = false; // Khong xoa file
  @Input() fileExtList: string[] = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt'];
  @Input() imgExtList: string[] = ['gif', 'jpg', 'jpeg', 'png'];
  @Input() displayType: 'IMAGE' | 'LIST' = 'LIST';
  @Input() originFiles: any = []; //IWrapFile[]
  @Input() mode: 'UPLOAD' | 'FILE' = 'UPLOAD';
  @Input() hasInfo: boolean = true;
  @Input() maxTotalSize: number // don vi la MB.
  @Input() validRequired: IValidRequired;
  @Input() disable: boolean = false;
  @Input() minHeight: number = 158;
  @Input() ignoreEditFile: boolean;
  @Input() classInclude: string;
  @Input() isErrorLimitFile: boolean = false;
  @Input() msgError: string = '';
  @Input() isErrorOverSizeFile: boolean = false;
  @Input() helpText: string = 'Lưu ý: File mới tải lên sẽ được lưu trong Thư mục Mặc định.';
  @Input() showHelpText: boolean = true;
  @Input() fieldLabel: string = 'File upload';
  @Input() fromMedia: boolean = true;
  @Input() isRequire: boolean = true;
  @Input() hasLabel: boolean = true;
  @Input() isOnlySvg: boolean = false;
  @Input() fileNote: string = 'Định dạng .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf. Dung lượng mỗi file tối đa {{size}}';
  @Input() imageNote: string = 'Định dạng .gif, .jpg, .jpeg, .png. Dung lượng mỗi file tối đa {{size}}';
  @Input() hasError: boolean = false;
  @Input() msgErrorLimitFile: string = '';
  @Input() hasTooltip: boolean = false;
  @Input() tooltipContent: string = '';
  @Input() isUploadDirect: boolean = false;


  @Input() fileName: string = '';
  @Input() thumb: string = '';


  @Output() onClose = new EventEmitter<any>();
  @Output() onUploadSuccess = new EventEmitter<any>();
  @Output() onFileChanged = new EventEmitter<any>();
  @Output() onChangeFile = new EventEmitter<any>();
  @Output() onValidationFailed = new EventEmitter<any>();
  @Output() onClearDataLink = new EventEmitter<any>();

  @ViewChild('upload') uploadRef: ElementRef;
  @ViewChild('uploadInput') uploadInputRef: ElementRef;

  @ViewChild('containerTop') containerTopRef: ElementRef;
  @ViewChild('filelist') fileListRef: ElementRef;
  @ViewChild('imageContainer') imageContainerRef: ElementRef;
  @ViewChild('info') infoRef: ElementRef;
  @ViewChild('error') errorRef: ElementRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    private _fileApiService: MoWbManagerImagesApiService,
    public override _changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private _translate: TranslateService
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    const limitFileSize = this.maxFileSize/(1024*1024);
    const limitImageSize = this.maxImageSize/(1024*1024);

    this.fileNote = this.fileNote.replace('{{size}}',`${limitFileSize}MB`);
    this.imageNote = this.imageNote.replace('{{size}}',`${limitImageSize}MB`);

    // init access files
    this.initAccessFiles();
    // init file list
    this.fileList = [...this.originFiles];
    if (this.fileList.length && !this.multiple) {
      this.disable = true;
    }
    this.detectChanges();
    // console.log('fileNote=', this.fileNote);
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      if (this.mode === 'UPLOAD') {
        this.registerUploadEvent();
        return;
      }      
      this.uploadRef.nativeElement.addEventListener('click', this.handleOnOpenStoreMedia);
    }, 50);
  }

  override ngOnDestroy(): void {
    this.uploadRef.nativeElement.removeEventListener('click', this.handleOnOpenStoreMedia);

    // remove upload event
    this.uploadRef.nativeElement.removeEventListener('click', this.handleOnUploadFileClick);
    this.uploadInputRef.nativeElement.removeEventListener('change', this.handleOnUploadFile);
    this.uploadRef.nativeElement.removeEventListener('dragover', this.handleOnMultipleDragEvent);
    this.uploadRef.nativeElement.removeEventListener('dragover', this.handleOnDragOver);
    this.uploadRef.nativeElement.removeEventListener('dragenter', this.handleOnDragOver);
    this.uploadRef.nativeElement.removeEventListener('dragleave', this.handleOnDragEnd);
    this.uploadRef.nativeElement.removeEventListener('dragend', this.handleOnDragEnd);
    this.uploadRef.nativeElement.removeEventListener('drop', this.handleOnDragDrop);
  }
  
  /**
   * int extension access files
   */
  initAccessFiles() {
    let accessExts: any[] = [];
    if (this.type === 'ALL') {
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
    // console.log('accessFiles=', this.accessFiles);
  }

  /**
   * register upload events
   */
  registerUploadEvent() {
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

  /**
   * validate file
   * @param wrapFile 
   * @returns 
   */
  validateFile(wrapFile: any): boolean {
    // const isImage = file.type.match(/image.*/) && !file.type.includes('svg') ? true : false;
    const isOverSize = !this.checkValidFileSize(wrapFile.file);
    if (isOverSize) {
      const msgError = 'i18n_file_limit_size';
      wrapFile.msgError = msgError;
      wrapFile.isError = true;
      return false;
    }

    if (!this.checkValidFileExtension(wrapFile.file)) {
      const msgError = 'i18n_file_invalid_file';
      wrapFile.msgError = msgError;
      wrapFile.isError = true;
      return false;
    }

    return true;
  }

  handleOnUploadFileClick = (e: any) => {
    e.stopPropagation();
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
    // console.log('handleOnMultipleDragEvent');
    e.preventDefault();
    e.stopPropagation();
  }

  handleOnDragOver = (e: any) => {
    // console.log('handleOnDragOver');
    this.uploadRef.nativeElement.classList.add('drag-over');
  }

  handleOnDragEnd = (e: any) => {
    // console.log('handleOnDragEnd');
    this.uploadRef.nativeElement.classList.remove('drag-over');
  }

  handleOnDragDrop = (e: any) => {
    // console.log('handleOnDragDrop');
    e.preventDefault();
    e.stopPropagation();
    this.uploadRef.nativeElement.classList.remove('drag-over');
    this.handleUploadFiles(e);
  }

  handleOnFileItemClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleOnEditFileClick(e: any, fileItem: any) {
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

  setDisable() {
    this.disable = true;
    this.detectChanges();
  }

  handleOnRemoveFileClick(e: any, fileItem: any, clearDataLink: boolean = false) {
    if (this.loading) {
      return;
    }
    //clear data link;
    if(clearDataLink) {
      this.onClearDataLink.emit();
    }
    
    this.removeFile(fileItem);
  }

  handleSelectedChange(event: any, key: 'UPLOAD' | 'FILE') {
    this.mode = key;

    if (this.mode === 'UPLOAD') {
      this.uploadRef.nativeElement.removeEventListener('click', this.handleOnOpenStoreMedia);
      this.registerUploadEvent();  
      this.detectChanges();
      return;
    }

    this.uploadRef.nativeElement.removeEventListener('click', this.handleOnUploadFileClick);
    this.uploadRef.nativeElement.removeEventListener('click', this.handleOnOpenStoreMedia);
    this.uploadRef.nativeElement.addEventListener('click', this.handleOnOpenStoreMedia);
    this.detectChanges();
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
      this.isErrorLimitFile = true;
      this.msgErrorLimitFile = 'i18n_file_limit_quantity';
      this.detectChanges();

      return;
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileUpload = files[0];
      this.onChangeFile.emit(files);
      // fix svg file is not edit
      const isImage = file.type.match(/image.*/) && !file.type.includes('svg') ? true : false;
      const wrapFile: any = { //IWrapFile
        name: file.name,
        file: file,
        size: this.convertFileSize(file.size),
        type: isImage ? 'IMAGE' : 'FILE',
        isError: false,
        id: `f${uid()}`,
        thumbnail: this.getThumbnailFile(file),
      };
      // validate file
      this.validateFile(wrapFile);
      this.fileList.splice(0, 0, wrapFile);
      this.detectChanges();

      if (this.imgExtList.includes(this.getFileExtension(file))) {
        this.getFileDataUrl(wrapFile.file, (dataUrl: string, size: {width: number, height: number}) => {
          // newFile.url = dataUrl;
          // wrapFile.loading = true;
          wrapFile.thumbnail = dataUrl;
          wrapFile.imageSize = size;
          this.detectChanges();
        });
      }
    }

    this.onFileChanged.emit(this.fileList);
    //check multiple to add class disable 
    if (!this.multiple && this.fileList.length) {
      this.disable = true;
    }
    this.detectChanges();

    // upload file
    if (this.isUploadDirect) {
      setTimeout(() => {
        this.uploadFiles();
      }, 250);
    }
  }


  setError(errorMsg: string) {
    this.hasError = true;
    this.msgError = errorMsg;
    this.detectChanges();
  }

  dataURLToBlob(dataURL: string) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];
      const blob = new Blob([raw], { type: contentType });
      return blob;
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });
    return blob;
  }

  /**
   * get thumbnail resource if file
   * @param file 
   * @returns 
   */
  getThumbnailFile(file: any) {
    let thumbnail = '';
    let type = this.getFileExtension(file);
    switch (type) {
      case 'docx':
      case 'doc':
        thumbnail = './assets/images/upload-file/word.png';
        break;
      case 'xlsx':
      case 'xls':
        thumbnail = './assets/images/upload-file/excel.png';
        break;
      case 'pptx':
      case 'ppt':
        thumbnail = './assets/images/upload-file/powerpoint.png';
        break;
      case 'pdf':
        thumbnail = './assets/images/upload-file/pdf.png';
        break;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        thumbnail = file?.origin_url;
        break;
      default:
        thumbnail = './assets/images/upload-file/file.png';
        break;
    }
    return thumbnail;
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
    this.showStoreMediaModal();
  }

  clearFile() {
    this.fileList = [];
    if (!this.multiple && !this.fileList.length) {
      this.disable = false;
    }
    if (this.fileList.length < this.limitFile + 1) {
      this.isErrorLimitFile = false;
      this.msgErrorLimitFile = '';
    }
    this.detectChanges();

    this.onFileChanged.emit(this.fileList);
  }

  removeFile(fileItem: any) {
    this.fileList = this.fileList.filter((item: any) => {
      if (item.id === fileItem.id) {
        return false;
      }
      return true;
    });
    if (!this.multiple && !this.fileList.length) {
      this.disable = false;
    }
    if (this.fileList.length < this.limitFile + 1) {
      this.isErrorLimitFile = false;
      this.msgErrorLimitFile = '';
    }
    //check xem xoa het file bi oversize chưa
    let errorFile = this.fileList.filter((item: any) => item.isError === true);
    if (errorFile && !errorFile.length) {
      this.hasError = false;
      this.msgError = '';
    }
    this.detectChanges();
    // this.onFileChanged.emit(this.fileList);
  }

  getFileDataUrl(file: any, callback: (dataUrl: any, size: {width: number, height: number}) => void) {
    const fileType = file.type;
    if (!file.type.match(/image.*/)) {
      return;
    }
    // Load the image
    var reader = new FileReader();
    reader.onload = function (readerEvent) {
      var image = new Image();
      image.onload = function (imageEvent) {
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
  };

  showEditModal(fileDataUrl: string, fileItem: any) { //IWrapFile
    // const editModalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditModalComponent).create(this.injector);
    // editModalRef.instance.imgSrcList = [fileDataUrl];
    // editModalRef.instance.mode = 'FILE';
    // // close modal
    // editModalRef.instance.onClose.subscribe((event) => {
    //   setTimeout(() => {
    //     this._domService.removeComponentFromBody(editModalRef);
    //   }, 500);
    // });

    // editModalRef.instance.onFileSelected.subscribe((result: any) => {
    //   fileItem.file = this.blobToFile(result.file, fileItem.name);
    //   fileItem.size = this.convertFileSize(result.file.size);
    //   fileItem.isError = !this.checkValidFileSize(result.file);
    //   fileItem.url = result.url;
    //   fileItem.isUpdate = true;
    //   this.detectChanges();
    //   this.onFileChanged.emit(this.fileList);

    // });

    // this._domService.addDomToBody(editModalRef);
    // editModalRef.instance.showModal();
  }

  showStoreMediaModal() {
    // const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this.injector);
    // modalRef.instance.mode = this.type;
    // modalRef.instance.multiple = this.multiple;
    // modalRef.instance.maxImageSize = this.maxImageSize;
    // modalRef.instance.maxFileSize = this.maxFileSize;
    // modalRef.instance.maxTotalFileSize = this.maxTotalSize;
    // modalRef.instance.maxSelected = this.limitFile - this.fileList.length;

    // modalRef.instance.selectedFileUrls = this.fileList.map((item: any) => {
    //   return item.url || item.origin_url;
    // });
    // modalRef.instance.onClose.subscribe((event) => {
    //   setTimeout(() => {
    //     this._domService.removeComponentFromBody(modalRef);
    //   }, 500);
    // });

    // modalRef.instance.onSelectedFiles.subscribe((files: any[]) => {
    //   this.detectChanges();
    //   const addFiles: IWrapFile[] = files.map((item: any) => {
    //     const file: IWrapFile = {
    //       id: item.id,
    //       name: item.filename,
    //       origin_url: item.origin_url,
    //       url: item.origin_url,
    //       target_path: item.target_path,
    //       size: item.origin_capacity,
    //       mimetype: item.mimetype,
    //       type: item.isImage ? 'IMAGE' : 'FILE',
    //       uploaded: true,
    //       thumbnail: this.getThumbnailFile(item),
    //     }
    //     return file;
    //   });

    //   for (let i = 0; i < addFiles.length; i++) {
    //     this.fileList.splice(0, 0, addFiles[i]);
    //   }

    //   if(this.fileList.length && !this.multiple) {
    //     this.disable = true;
    //   }
    //   // console.log('fileList length=', this.fileList.length, ' multiple=', this.multiple, ' disable=', this.disable);
    //   this.detectChanges();
    //   this.onFileChanged.emit(this.fileList);
    //   this.validate();
    // });

    // this._domService.addDomToBody(modalRef);
  }

  getFileExtension(file: any) {
    const fileName = file.name || file.filename;
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
    if (this.isOnlySvg) {
      if (['svg'].indexOf(extension.toLowerCase()) < 0) {
        return false;
      }
      return true;
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
          this._toast.show('error', `${this._translate.instant('i18n_image')} ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxImageSize, 0)}. ${this._translate.instant('i18n_select_again')}`);
          // this._toast.show('error', `${this._translate.instant('i18n_image')} ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxImageSize,0)}. ${this._translate.instant('i18n_select_again')}`);

        } else {
          // this._toast.show('error', `File ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxFileSize, 0)}. ${this._translate.instant('i18n_select_again')}`);
          this._toast.show('error', `File ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxFileSize, 0)}. ${this._translate.instant('i18n_select_again')}`);
          // this._toast.show('error', `File ${file.name} ${this._translate.instant('i18n_bigger')} ${this.convertFileSize(this.maxFileSize,0)}. ${this._translate.instant('i18n_select_again')}`);
        }

      }
    }
    this.detectChanges();
    return valid;
  }

  convertFileSize(size: number, toFixed: number = 2) {
    if (size < 1024 * 1024) {
      return ` ${(size / 1024).toFixed(toFixed)} KB`;
    }
    return ` ${(size / (1024 * 1024)).toFixed(toFixed)} MB`;
  }

  validate() {
    //console.log('validate file');
    // const validFields = this.fileList.filter(file => {
    //   return file.uploaded ? true : false
    // });
    if (!this.fileList.length) {
      this.isEmptyError = true;
      this.msgError = 'i18n_valid_empty_message';
      this.detectChanges();
      return false;
    }

    this.isEmptyError = false;
    this.msgError = '';
    this.detectChanges();
    return true;
  }

  /**
   * upload files
   * @param folderId 
   * @returns 
   */
  async uploadFiles(folderId: string = null) {
    // console.log('upload file folderId=', folderId);
    console.log('this.fileList=', this.fileList);
    const uploadFiles = this.fileList.filter((file: any) => {
      return file.isError || file.uploaded ? false : true;
    });
    if (!uploadFiles || !uploadFiles.length) {
      return;
    }

    this.loading = true;
    this.detectChanges();
    for(let i=0; i < uploadFiles.length; i++) {
      const wrapFile = uploadFiles[i];
      wrapFile.uploading = true;
      this.detectChanges();
      const response = await this._fileApiService.uploadImages(this.fileUpload); //this._fileApiService.uploadFile(wrapFile.file, folderId, wrapFile.name, false, wrapFile.imageSize); 
      // console.log('wrapFile response =', response);
      if (!response || response.code !== 200) {
        this._toast.show('error', response && response.message);
        wrapFile.uploading = false;
        this.detectChanges();
        continue;
      }
      wrapFile.uploaded = true;
      // wrapFile.url = response.data.url;
      setTimeout(() => {
        wrapFile.uploading = false;
        this.detectChanges();
      }, 150);
      
      this.detectChanges();
    }    

    setTimeout(() => {
      this.validate();
    }, 250);

    const totalSize = this.getImageSize(uploadFiles);
    let timeout = 1500;
    // console.log('totalSize=', totalSize);
    if (totalSize) {
      const mbSize = totalSize / (1024 * 1024);
      if (mbSize > 0.1 && mbSize < 1) {
        timeout = 5000;
      }
      if (mbSize > 1) {
        timeout = 8000;
      }
    }
    
    setTimeout(() => {
      this.loading = false;
      this.detectChanges();
      this.onUploadSuccess.emit({});  
    }, timeout);
    
  }

  getImageSize(uploadFiles: any) { //IWrapFile[]
    let size: number = 0;
    uploadFiles.forEach((file: any) => {
      if (file.imageSize) {
        size += file.file.size
      }
    });

    return size;
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