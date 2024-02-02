import { Component, OnInit, EventEmitter, ViewChild,Output, Input,ChangeDetectionStrategy, ChangeDetectorRef,
  ComponentFactoryResolver, Injector } from '@angular/core';
import { MoWbMediaStoreEditModalComponent } from '../edit/media-store-edit.component';
import { MoWbMediaStoreMoveFileComponent } from '../move-file/media-store-move-file.component';
import { MoWbMediaStoreDeleteNotiComponent } from '../delete-file-noti/media-store-delete-file-noti.component';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
// import { DefineConstants } from 'src/app/common/define/constants.define';

// import  * as moment from 'moment';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';

@Component({
  selector: 'mo-wb-media_store_detail',
  templateUrl: './media-store-detail.component.html',
  styleUrls: ['./media-store-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreDetailComponent implements OnInit {
  
  isOpen: boolean;
  folderName: string;

  @Input() zIndex: number = 2500;
  @Input() fileItem: any = {};
  @Input() folderListItems: any[] = [];
  @Input() folderId: string = '';
  @Input() type: 'CMS' | 'POPUP' = 'POPUP';

  @Output() onClose = new EventEmitter<any>();  
  @Output() onMoveFile = new EventEmitter<any>();
  @Output() onSaveFileOk = new EventEmitter<any>();
  @Output() onDeleteFileOk = new EventEmitter<any>();
  @Output() onSelectFile = new EventEmitter<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    // private _fileApiService : MoWbFileApiService,
    private injector: Injector,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService
  ) {}

  ngOnInit() {
    // this.fileItem.display_create_time = moment(this.fileItem.created_time).format('DD/MM/YYYY HH:mm');
    // this.fileItem.display_update_time = moment(this.fileItem.updated_time).format('DD/MM/YYYY HH:mm');
    // if (this.fileItem && !this.fileItem.do_not_delete) {
    //   this.fileItem.display_expired_time = moment(this.fileItem.expire).format('DD/MM/YYYY HH:mm');
    // }

    this.folderListItems.find((item: any) => {
      if (item.id === this.folderId) {
        this.folderName = item.name;
        return true;
      }
      return false;
    });

    // console.log('fileItem=', this.fileItem);

    this.changeDetection.detectChanges();
  }

  public showModal() {
    this.isOpen = true;
    this.changeDetection.detectChanges();
  }

  public hideModal() {
    this.isOpen = false;
    this.changeDetection.detectChanges();
    this.onClose.emit({});
  }

  copyFileUrl() {
    var textArea = document.createElement("textarea");
    textArea.value = this.fileItem.origin_url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();

    this._toast.show(
      'info',
      'i18n_link_copied'
    );
  } 

  showMoveFileModal() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreMoveFileComponent).create(this.injector);
    modalRef.instance.folderListItems = this.folderListItems;
    modalRef.instance.folderId = this.folderId;
    modalRef.instance.fileUrls = [this.fileItem.origin_url];
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onMove.subscribe((event: any) => {
      this.hideModal();
      this.onMoveFile.emit({});
    });

    this._domService.addDomToBody(modalRef);
    // modalRef.instance.showModal();
    // setTimeout(() => {
    //   this.hideModal();
    // }, 10);
  }

  showEditModal() {
    const editModalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditModalComponent).create(this.injector);
    editModalRef.instance.imgSrcList = [this.fileItem.origin_url];
    editModalRef.instance.originUrl = this.fileItem.origin_url;
    editModalRef.instance.folderId = this.folderId;
    editModalRef.instance.mimetype = this.fileItem.mimetype;
    editModalRef.instance.zIndex = this.zIndex + 3;
    // close modal
    editModalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(editModalRef);
      }, 500);
    });

    editModalRef.instance.onSaveFileOk.subscribe((event: any) => {
      this.hideModal();
      this.onSaveFileOk.emit({});
    });

    this._domService.addDomToBody(editModalRef);
    editModalRef.instance.showModal();
  }

  showConfirmDeleteFiles() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreDeleteNotiComponent).create(this.injector);
    modalRef.instance.deleteFiles = [this.fileItem];
    modalRef.instance.zIndex = this.zIndex + 3;
    // modalRef.instance.
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onOk.subscribe((event: any) => {
      this.doDeleteFiles([this.fileItem.origin_url]);
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.showModal();
  }

  async doDeleteFiles(fileUrls: string[]) {
    this.changeDetection.detectChanges();
    // const response = await this._fileApiService.deleteFiles(fileUrls);
    // this.changeDetection.detectChanges();
    // if (!response) {
    //   return;
    // }
    // if (response && response.code !== 200) {
    //   this._toast.show(
    //     'error',
    //     response.message
    //   );
    //   return;
    // }
    this.hideModal();
    this.onDeleteFileOk.emit({});
    this._toast.show(
      'success','i18n_notification_manipulation_success' //'Xoá file thành công'
    );
  }

  handleOnBack() {
    this.hideModal();
  }

  handleOnCopyUrl(event: any) {
    event.stopPropagation();
    this.copyFileUrl();
  }

  handleOnMoveFileSelect(event: any) {
    event.stopPropagation();
    this.showMoveFileModal();
  }

  handleOpenEditModal(event: any) {
    event.stopPropagation();
    this.showEditModal();
  }

  handleOnDeleteFile(event: any) {
    event.stopPropagation();
    this.showConfirmDeleteFiles();
  }

  handleOnSelectFile(event: any) {
    event.stopPropagation();
    this.hideModal();
    this.onSelectFile.emit(this.fileItem);
  }
}
