import {
  Component, OnInit, ViewChild, Output, Input, ElementRef, ChangeDetectorRef,
  ChangeDetectionStrategy, ComponentFactoryResolver, Injector, EventEmitter
} from '@angular/core';
import { MoWbMediaStoreEditModalComponent } from '../edit/media-store-edit.component';
import { MoWbMediaStoreMoveFileComponent } from '../move-file/media-store-move-file.component';
import { MoWbMediaStoreDeleteNotiComponent } from '../delete-file-noti/media-store-delete-file-noti.component';
import { MoWbMediaStoreUploadModalComponent } from '../upload-modal/media-store-upload-modal.component';
import { MoWbMediaStoreDetailComponent } from '../detail/media-store-detail.component';
// import { DefineConstants } from 'src/app/common/define/constants.define';
// import { DOMAIN_GET_SOURCES_STATIC } from 'src/app/common/define/host-domain.define';
// import * as moment from 'moment';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';

const DISPLAY_MODE = 'MO_MEDIA_STORE_DISPLAY_MODE_FILE';
const SELECTED_SORT = 'MO_MEDIA_STORE_SELECTED_SORT_FILE';

@Component({
  selector: 'mo-wb-media_store_file',
  templateUrl: './media-store-file.component.html',
  styleUrls: ['./media-store-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreFileComponent implements OnInit {

  displayMode: 'grid' | 'list' = 'grid';

  mimeTypeList: any = {};
  fileList: any[] = [];
  selectedItems: any[] = [];
  loading: boolean;
  loaded: boolean;
  currPage: number = 1;
  canLoadMore: boolean;
  groupId: string;
  searchValue: string;

  sortItems: {
    key: 'created_time' | 'origin_capacity' | 'expire' | 'updated_time'
    order: 'asc' | 'desc'
    name: string;
  }[] = [];

  selectedSortIndex: number = 0;
  sortOpen: boolean = false;

  inputTotalSize: number = 0;

  @Input() zIndex: number = 1200;
  @Input() type: 'POPUP' | 'CMS' = 'POPUP';
  @Input() maxSelected: number = 10;
  @Input() maxImageSize: number = 5*1024*1024;
  @Input() maxFileSize: number = 10*1024*1024;
  @Input() mode: 'FILE' | 'IMAGE' | 'ALL' = 'IMAGE';
  @Input() folderList: any[] = [];
  @Input() multiple: boolean = true;
  @Input() selectedFileUrls: string[] = [];
  @Input() maxTotalFileSize: number = 0; // MB unit

  @Output() onSelectedFiles = new EventEmitter<any[]>();
  @Output() onFileChanged = new EventEmitter<any>();

  @ViewChild('fileContainer') fileContainer: ElementRef;

  constructor(
    // private _fileApiService: MoWbFileApiService,
    private changeDetection: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    private _toast: ToastTranslateService,
  ) {
  }
  ngOnInit() {
    this.displayMode = 'grid' // this._baseApiService.getCache(DISPLAY_MODE) || 'grid';
    this.selectedSortIndex = 0; // parseInt(this._baseApiService.getCache(SELECTED_SORT) || '0');
    this.loading = false; //true
    this.canLoadMore = true;
    this.initData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fileContainer.nativeElement.removeEventListener('scroll', this.handleFileListScroll);
      this.fileContainer.nativeElement.addEventListener('scroll', this.handleFileListScroll);
    }, 0);
  }

  initData() {
    this.initMimeTypes();
    this.initSortItems();
    this.fetchInputTotalFileSize();
  }

  initMimeTypes() {
    this.mimeTypeList['text/html'] = 'html';
    this.mimeTypeList['text/xml'] = 'xml';
    this.mimeTypeList['image/gif'] = 'gif';
    this.mimeTypeList['image/jpeg'] = 'jpeg';
    this.mimeTypeList['image/png'] = 'png';

    this.mimeTypeList['application/msword'] = 'doc';
    this.mimeTypeList['application/pdf'] = 'pdf';
    this.mimeTypeList['application/vnd.ms-excel'] = 'xls';
    this.mimeTypeList['application/vnd.ms-powerpoint'] = 'ppt';
    this.mimeTypeList['application/zip'] = 'zip';
    this.mimeTypeList['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = 'pptx';
    this.mimeTypeList['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = 'xlsx';
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    this.mimeTypeList['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = 'docx';
  }

  initSortItems() {
    this.sortItems.push({
      key: 'created_time',
      order: 'desc',
      name: 'i18n_create_time_new'
    });

    this.sortItems.push({
      key: 'created_time',
      order: 'asc',
      name: 'i18n_create_time_old'
    });

    this.sortItems.push({
      key: 'updated_time',
      order: 'desc',
      name: 'i18n_update_time_new'
    });

    this.sortItems.push({
      key: 'updated_time',
      order: 'asc',
      name: 'i18n_update_time_old'
    });

    this.sortItems.push({
      key: 'expire',
      order: 'asc',
      name: 'i18n_exp_time_new'
    });

    this.sortItems.push({
      key: 'expire',
      order: 'desc',
      name: 'i18n_exp_time_old'
    });

    this.sortItems.push({
      key: 'origin_capacity',
      order: 'desc',
      name: 'i18n_capacity_max'
    });

    this.sortItems.push({
      key: 'origin_capacity',
      order: 'asc',
      name: 'i18n_capacity_min'
    });
  }

  async loadFileList(group_id: string) {
    if (this.groupId === group_id) {
      return;
    }
    this.groupId = group_id;
    this.sortOpen = false;
    this.reload();

  }

  async reload() {
    console.log('reload');
    this.canLoadMore = true;
    this.loaded = false;
    this.currPage = 1;
    this.selectedItems = [];
    this.changeDetection.detectChanges();
    // const response = await this.fetchFileList();
    // this.fileList = [];
    // for (let i = 0; i < response.length; i++) {
    //   this.addNewFileItem(response[i]);
    // }
    this.loaded = true;
    // this.fileList = [...response];
    this.changeDetection.detectChanges();
  }

  async fetchFileList(page: number = 1) {
    const searchValue = this.searchValue || '';
    this.loading = true;
    this.changeDetection.detectChanges();
    // console.log('fetchFileList ', this.groupId, page);
    // const response = await this._fileApiService.fetchFileList(this.groupId, searchValue, page, this.sortItems[this.selectedSortIndex], this.mode);
    this.loading = false;
    // if (!response || response.code !== 200) {
    //   return [];
    // }
    // return response.data;

  }

  handleOnFileItemClick = (e: any, fileItem: any) => {
    e.stopPropagation();
    this.toggleSelectedFileItem(fileItem);
  }

  handleOnSelectGridView() {
    this.displayMode = 'grid';
    // this._baseApiService.setCacheValue('grid', DISPLAY_MODE);
    this.changeDetection.detectChanges();
  }

  handleOnSelectListView() {
    this.displayMode = 'list';
    // this._baseApiService.setCacheValue('list', DISPLAY_MODE);
    this.changeDetection.detectChanges();
  }

  // handleOnFileScrollBottom(event) {
  //   const total = this.fileList.length - 1;
  //   console.log('handleOnFileScrollBottom ',this.loading, this.canLoadMore, ' endIndex=', event.endIndex);
  //   if (event.endIndex !== total || event.endIndex < 0 || this.loading || !this.canLoadMore) {
  //     return;
  //   }
  //   this.loadMoreFiles();
  // }

  handleOnFileItemDbClick(item: any) {
    // console.log('handleOnFileItemDbClick ', item);
    this.showDetailFileModal(item);
  }

  handleOnSearchFile(value: string) {
    this.searchFile(value);
  }

  handleOnOverlayPopupSortClick(event: any) {
    event.stopPropagation();
    this.closeSortPopup();
  }

  handleOnSelectSortItem(event: any, index: number) {
    event.stopPropagation();
    if (index === this.selectedSortIndex) {
      return;
    }
    // this._baseApiService.setCacheValue(`${index}`, SELECTED_SORT);
    this.selectedSortIndex = index;
    this.sortOpen = false;
    this.changeDetection.detectChanges();

    this.reload();
  }

  handleOnSelectSortPopup(event: any) {
    event.stopPropagation();
    this.toggleOpenSortPopup();
  }

  handleOnMoveFile(event: any) {
    event.stopPropagation();
    this.showMoveFileModal();
  }

  handleFileListScroll = (e: any) => {
    if (this.fileContainer.nativeElement.scrollTop + this.fileContainer.nativeElement.clientHeight >= this.fileContainer.nativeElement.scrollHeight - 20) {
      if (this.loading || !this.canLoadMore) {
        return;
      }
      this.loadMoreFiles();
    }
  }

  handleOnDeleteFile = (e: any) => {
    this.showConfirmDeleteFiles();
  }

  handleOnCheckboxSelect = (event: any, selectedItem: any) => {
    // console.log('handleOnCheckboxSelect selectedItem=',selectedItem);
    this.toggleSelectedFileItem(selectedItem);
  }

  handleOnAddNewFile() {
    this.showUploadFilesModal();
  }

  handleOnDetailButtonClick(event: any, fileItem: any) {
    event.stopPropagation();
    this.showDetailFileModal(fileItem);
  }

  handleOnEditFile(event: any) {
    event.stopPropagation();
    this.showEditFileModal();
  }

  handleOnSelectAll(event: any) {
    event.stopPropagation();
    this.selectedItems = [...this.fileList];
  }

  handleOnUnSelectAll(event: any) {
    event.stopPropagation();
    this.selectedItems = [];
  }

  checkIfItemIsSelected(fileItem: any) {
    let selectedIndex = -1;
    if (!this.selectedItems.length) {
      return selectedIndex;
    }
    const files = this.selectedItems.find((item: any, index: number) => {
      if (item.id === fileItem.id) {
        selectedIndex = index;
        return true;
      }
      return false;
    });

    return selectedIndex
  }

  toggleSelectedFileItem(fileItem: any, isSelectFile: boolean = false) {
    if (fileItem.isOverSize) {
      return;
    }

    if (this.selectedFileUrls.includes(fileItem.origin_url)) {
      if (fileItem.isImage) {
        this._toast.show('warning', 'i18n_image_is_selected_notes');
      } else {
        this._toast.show('warning', 'i18n_file_is_selected_notes');
      }
      
      return;
    }

    if (!this.multiple) {
      this.selectedItems = [fileItem];
      return;
    }
    const selectedIndex = this.checkIfItemIsSelected(fileItem);
    if (selectedIndex < 0) {
      if (this.selectedItems.length >= this.maxSelected && this.type === 'POPUP') {
        this._toast.show('warning',  this._toast.TranslateService.instant('i18n_file_exceeds_quantity_message', { max_files: this.maxSelected} ));
        // this._toast.show('warning', `i18n_file_exceeds_quantity_message ${this.maxSelected} files.`);
        return;
      }
      this.selectedItems.push(fileItem);
      if (!this.checkValidTotalSize() && this.type === 'POPUP') {
        this._toast.show('warning', `i18n_file_exceeds_size_message ${this.maxTotalFileSize}MB.`);
      }
      return;
    }
    if (!isSelectFile) {
      this.selectedItems.splice(selectedIndex, 1);
    }
  }

  async loadMoreFiles() {
    this.currPage += 1;
    const response = await this.fetchFileList(this.currPage);
    this.loading = false;
    // if (!response || !response.length) {
    //   this.canLoadMore = false;
    // } else {
    //   for (let i = 0; i < response.length; i++) {
    //     this.addNewFileItem(response[i]);
    //   }
    // }
    this.changeDetection.detectChanges();
  }

  addNewFileItem(fileItem: any) {
    // if (this.selectedFileUrls.includes(fileItem.origin_url)) {
    //   return;
    // }
    const splitName = fileItem.filename.split('.');
    const ext = splitName.length > 1 ? splitName[splitName.length - 1].toUpperCase() : 'Không xác định';

    // fileItem.ext = this.mimeTypeList[fileItem.mimetype] ? this.mimeTypeList[fileItem.mimetype].toUpperCase() : ext;
    // fileItem.isImage = fileItem.mimetype && fileItem.mimetype.match(/image.*/) ? true : false;
    // fileItem.imageThumb = !fileItem.isImage ? this.getFileImageSource(fileItem.ext) : fileItem.options && fileItem.options.length > 0 ? fileItem.options[0].target_url : fileItem.origin_url;
    // fileItem.size = this.getFileSize(fileItem.origin_capacity);
    // fileItem.isOverSize = fileItem.isImage ? fileItem.size > this.maxImageSize ? true : false : fileItem.size > this.maxFileSize ? true : false;
    // fileItem.isExpired = !fileItem.do_not_delete && fileItem.expire && moment().add(5, 'day').isAfter(moment(fileItem.expire));
    // fileItem.display_expired_time = !fileItem.do_not_delete && fileItem.expire ? moment(fileItem.expire).format('DD/MM/YYYY HH:mm') : '-';
    // this.fileList.push(fileItem);
  }

  showEditFileModal() {
    if (!this.selectedItems.length) {
      return;
    }
    const selectedFile = this.selectedItems[0];
    const editModalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreEditModalComponent).create(this.injector);
    editModalRef.instance.imgSrcList = [selectedFile.origin_url];
    editModalRef.instance.originUrl = selectedFile.origin_url;
    editModalRef.instance.folderId = this.groupId;
    editModalRef.instance.mimetype = selectedFile.mimetype;
    editModalRef.instance.zIndex = this.zIndex + 3;
    // close modal
    editModalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(editModalRef);
      }, 500);
    });

    editModalRef.instance.onSaveFileOk.subscribe((event: any) => {
      this.reload();
      this.onFileChanged.emit({});
    });

    this._domService.addDomToBody(editModalRef);
    editModalRef.instance.showModal();
  }

  async searchFile(searchValue: string) {
    if (this.searchValue === searchValue) {
      return;
    }

    this.searchValue = searchValue;
    this.loaded = false;
    this.loading = true;
    this.currPage = 1;
    this.selectedItems = [];
    this.changeDetection.detectChanges();
    // const response = await this.fetchFileList();
    // this.fileList = [];
    // for (let i = 0; i < response.length; i++) {
    //   this.addNewFileItem(response[i]);
    // }
    this.loaded = true;
    this.changeDetection.detectChanges();
  }

  toggleOpenSortPopup() {
    this.sortOpen = !this.sortOpen;
    this.changeDetection.detectChanges();
  }

  closeSortPopup() {
    this.sortOpen = false;
    this.changeDetection.detectChanges();
  }

  showMoveFileModal() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreMoveFileComponent).create(this.injector);
    modalRef.instance.folderListItems = this.folderList;
    modalRef.instance.folderId = this.groupId;
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.fileUrls = this.selectedItems.map((item: any) => {
      return item.origin_url;
    });

    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onMove.subscribe((event: any) => {
      this.fileList = this.fileList.filter((item: any) => {
        const foundIndex = this.checkIfItemIsSelected(item)
        if (foundIndex < 0) {
          return true;
        }
        return false;
      });
      this.selectedItems = [];
      this.changeDetection.detectChanges();
      this.onFileChanged.emit({});
    });

    this._domService.addDomToBody(modalRef);
    // modalRef.instance.showModal();
  }

  showConfirmDeleteFiles() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreDeleteNotiComponent).create(this.injector);
    modalRef.instance.deleteFiles = this.selectedItems;
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onOk.subscribe((event: any) => {
      const fileUrls = this.selectedItems.map((item: any) => {
        return item.origin_url;
      });
      this.doDeleteFiles(fileUrls);
    });

    this._domService.addDomToBody(modalRef);
    // modalRef.instance.showModal();
    this.changeDetection.detectChanges();
  }

  async doDeleteFiles(fileUrls: string[]) {
    this.loading = true;
    this.changeDetection.detectChanges();
    // const response = await this._fileApiService.deleteFiles(fileUrls);
    // this.loading = false;
    // this.changeDetection.detectChanges();
    // if (!response) {
    //   return;
    // }
    this.onFileChanged.emit({});
    this.fileList = this.fileList.filter((item: any) => {
      const foundIndex = this.checkIfItemIsSelected(item)
      if (foundIndex < 0) {
        return true;
      }
      return false;
    });
    this.selectedItems = [];
    this.changeDetection.detectChanges();

    this._toast.show(
      'success', 'i18n_notification_manipulation_success' // 'Xoá file thành công.'
    );
  }

  showUploadFilesModal() {
    // console.log('showUploadFilesModal groupId=', this.groupId);
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreUploadModalComponent).create(this.injector);
    modalRef.instance.folderId = this.groupId;
    modalRef.instance.uploadType = this.mode;
    modalRef.instance.folderListItems = this.folderList;
    modalRef.instance.maxImageSize = this.maxImageSize;
    modalRef.instance.maxFileSize = this.maxFileSize;

    // modalRef.instance.onClose.unsubscribe();
    const onCloseSub = modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
      onCloseSub.unsubscribe();
      onUploadOk.unsubscribe();
    });
    // modalRef.instance.onUploadOk.unsubscribe();
    const onUploadOk = modalRef.instance.onUploadOk.subscribe((event: any) => {
      console.log('onUploadOk');
      this.reload();
      this.onFileChanged.emit({});
    });
    this._domService.addDomToBody(modalRef);
  }

  showDetailFileModal(fileItem: any) {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreDetailComponent).create(this.injector);
    modalRef.instance.fileItem = fileItem;
    modalRef.instance.folderListItems = this.folderList;
    modalRef.instance.folderId = this.groupId;
    modalRef.instance.type = this.type;
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });
    modalRef.instance.onMoveFile.subscribe((event: any) => {
      this.reload();
      this.onFileChanged.emit({});
    });

    modalRef.instance.onSaveFileOk.subscribe((event: any) => {
      this.reload();
      this.onFileChanged.emit({});
    });

    modalRef.instance.onDeleteFileOk.subscribe((event: any) => {
      this.reload();
      this.onFileChanged.emit({});
    });

    modalRef.instance.onSelectFile.subscribe((file: any) => {
      if (!this.multiple) {
        this.onSelectedFiles.emit([fileItem]);
        return;
      }

      this.toggleSelectedFileItem(fileItem, true);
    });

    this._domService.addDomToBody(modalRef);
    modalRef.instance.showModal();
  }

  getEmptyMessage() {
    if (!this.searchValue) {
      return 'i18n_empty_file_in_list_message';
    } else {
      return 'i18n_no_found_file_match_message'
    }
  }

  getFileImageSource(extension: string) {
    // switch (extension.toLowerCase()) {
    //   case 'doc':
    //   case 'docx':
    //     return `${DOMAIN_GET_SOURCES_STATIC()}media-icon-file-doc.svg`;
    //   case 'xls':
    //   case 'xlsx':
    //     return `${DOMAIN_GET_SOURCES_STATIC()}media-icon-file-excel.svg`;
    //   case 'pdf':
    //     return `${DOMAIN_GET_SOURCES_STATIC()}media-icon-file-pdf.svg`;
    //   case 'ppt':
    //   case 'pptx':
    //     return `${DOMAIN_GET_SOURCES_STATIC()}media-icon-file-ppt.svg`;
    //   default:
    //     return '';
    // }
  }

  getFileSize(size: string) {
    let unit = 1000;
    if (size.includes('MB')) {
      unit = 1000000;
    }

    return parseFloat(size) * unit;
  }

  async fetchInputTotalFileSize() {
    if (!this.selectedFileUrls.length) {
      return;
    }
    // const response = await this._fileApiService.fetchFilesSize(this.selectedFileUrls);
    // if (response.code === 200) {
    //   this.inputTotalSize = this.getFileSize(response.data.total_capacity);
    // }
    // console.log('response=', response, ' inputTotalSize=', this.inputTotalSize);
  }


  checkValidTotalSize() {
    if (!this.maxTotalFileSize) {
      return true;
    }
    let totalSize = this.inputTotalSize;
    for (let i = 0; i < this.selectedItems.length; i++) {
      totalSize += this.selectedItems[i].size;
    }
    // console.log('checkValidTotalSize total=', totalSize);
    if (totalSize > this.maxTotalFileSize * 1024*1024) {
      return false;
    }
    return true;
  }

  getSelectedFiles() {
    if (!this.checkValidTotalSize()) {
      this._toast.show('warning', `i18n_file_exceeds_size_message ${this.maxTotalFileSize}MB.`);
      return [];
    }

    return this.selectedItems;
  }
}
