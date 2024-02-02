import { Component, OnInit, EventEmitter, ViewChild, 
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
// import { MoWbDropdownComponent } from 'src/app/components';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { MoWbSelectComponent } from 'src/app/components/select/select.component';
import { MoWbFileUploadV4Component } from 'src/app/components/upload/file-upload-v4/file-upload.component';
// import { IWrapFile } from 'src/app/common/types/media/wrap-file';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';

@Component({
  selector: 'mo-wb-media_store_upload_modal',
  templateUrl: './media-store-upload-modal.component.html',
  styleUrls: ['./media-store-upload-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreUploadModalComponent extends MoWbV4ModalComponent {
  
  loading: boolean;
  fileExtList: string[]= ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
  imgExtList: string[]= ['gif', 'jpg', 'jpeg', 'png'];
  uploadFinished: boolean;
  modalHeight: string = '463px';
  fileListHeight: string = 'auto';
  validFiles: any = []; //IWrapFile[]

  @Input() limitFile: number = 10;
  @Input() maxImageSize: number = 5*1024*1024;
  @Input() maxFileSize: number = 10*1024*1024;
  @Input() uploadType: 'FILE' | 'IMAGE' | 'ALL' = 'ALL';
  @Input() folderId: string = null;
  @Input() folderListItems: any[] = [];
  @Input() override disable: boolean = true;

  @Output() override onClose = new EventEmitter<any>();
  @Output() onUploadOk = new EventEmitter<any>();
  
  @ViewChild('modal') modalRef: MoWbV4ModalComponent;
  @ViewChild('upload') uploadRef: MoWbFileUploadV4Component;
  @ViewChild('folder') folderRef: MoWbSelectComponent;

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    // private _fileApiService: MoWbFileApiService,
    private _toast: ToastTranslateService,
  ) {
    super(_changeDetection);
  }

  setSelectedFolder(){
    let nameFolder = '';
    if(this.folderId === null){
      nameFolder = 'i18n_default'
    }

    this.folderListItems.forEach(item => {
      if(item.id === this.folderId){
        nameFolder = item.name;
      }
    });

    // this.folderRef.setSelectedId([nameFolder]);
    this.detectChanges();
  }

  /**
   * upload files
   * @returns 
   */
  async uploadFiles() {
    if(!this.validate()){
      return;
    }
    this.loading = true;
    this.detectChanges();

    this.uploadRef.uploadFiles(this.folderId);
  };

  validate() {
    let isValid = true;
    if (!this.folderRef?.validate()) {
      isValid = false;
    }

    if (!this.validFiles || !this.validFiles.length) {
      isValid = false;
    }
    return isValid;
  }

  convertFileSize(size: number, toFixed: number = 2) {
    if (size < 1024*1024) {
      return ` ${(size / 1024).toFixed(toFixed)} KB`;
    }
    return ` ${(size / (1024*1024)).toFixed(toFixed)} MB`;
  }

  handleOnSaveClick() {
    this.uploadFiles();
  }

  handleOnSelectFolder(event: any) {
    if(!event[0].id){
      return;
    }
    this.folderId = event[0].id;
    this.detectChanges();
  }

  /**
   * handle on file upload changed
   * @param wrapFiles 
   */
  handleOnUploadFileChanged(wrapFiles: any[]) {
    this.validFiles = wrapFiles && wrapFiles.filter(file => {
      return file.isError ? false : true; 
    }); 

    this.disable = this.validFiles.length ? false : true;
    this.detectChanges();
  } 

  /**
   * handle on upload success
   */
  handleOnUploadSuccess() {
    this.loading = false;
    this.detectChanges();

    setTimeout(() => {
      this.onUploadOk.emit({});
      this.close();
    }, 50);
  }

}
