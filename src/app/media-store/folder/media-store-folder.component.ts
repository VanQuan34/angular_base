import { Component, OnInit, EventEmitter, ViewChild, ViewRef, 
  Output, Input, ElementRef, ChangeDetectorRef, 
  ChangeDetectionStrategy, 
  ComponentFactoryResolver, Injector} from '@angular/core';
import { MoWbMediaStoreFolderAddEditComponent } from './add-edit/media-store-folder-add-edit.component';
import { MoWbMediaStoreFolderDeleteNotiComponent } from './delete-noti/media-store-folder-delete-noti.component';
// import { DefineFunction } from 'src/app/common/define/function.define';
// import { DefineConstants } from 'src/app/common/define/constants.define';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
// import { MoWbFolderApiService } from 'src/app/api/media/folderApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';

@Component({
  selector: 'mo-wb-media_store_folder',
  templateUrl: './media-store-folder.component.html',
  styleUrls: ['./media-store-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreFolderComponent implements OnInit {
  
  folderList: any[] = [];
  disFolderList: any[] = [];
  searchValue: string = '';
  menuShow: boolean = false;
  menuTop: string = '0px';
  menuLeft: string = '0px';
  selectedFolderMenuItem: any;

  @Input() zIndex: number = 1200;
  @Input() selectedFolderId: string = '';
  @Input() type: 'POPUP' | 'CMS' = 'POPUP';
  @Output() onSelect = new EventEmitter<string>();

  // @ViewChild('modal') modalRef: MoWbListBackModalComponent;
  @ViewChild('container') containerRef: ElementRef;

  constructor(
    // private _folderApiService: MoWbFolderApiService,
    private _changeDetection: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _domService: AddComponentToBodyService,
    private injector: Injector,
    private _toast: ToastTranslateService,
  ) {}

  ngOnInit() {
    this._changeDetection.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initData();
    }, 0);
    this._changeDetection.detectChanges();
  } 

  initData() {
    // this.selectedFolderId = this._folderApiService.getCacheSelectedFolderId() || '';
    // if (this.selectedFolderId === '1') {
    //   this.selectedFolderId = '';
    // }
    // if (this.selectedFolderId === '2') {
    //   this.selectedFolderId = null;
    // }
    // console.log('selectedFolderId=', this.selectedFolderId);
    this.fetchFolderList();
  }

  async fetchFolderList() {
    // fetch folder list
    // const response = await this._folderApiService.getFolderList();
    
    // this.folderList = [];
    // this.folderList.splice(0,0,{
    //   id : '',
    //   name: 'i18n_all',
    //   count: response?.count_all
    // }, {
    //   id : null,
    //   name: 'i18n_default',
    //   count: response?.count_default
    // });

    // for (let i = 0; i < response?.list.length; i++) {
    //   this.folderList.push(response?.list[i]);
    // }

    // const selectedItem = this.folderList.find((item: any) => {
    //   if (item.id === this.selectedFolderId) {
    //     return true;
    //   }
    //   return false;
    // });

    // if (!selectedItem) {
    //   this.selectedFolderId = '';
    // }

    // this.disFolderList = [...this.folderList];
    // this.detectChanges();
    // this.onSelect.emit(this.selectedFolderId);
  }

  handleOnSelectFolder(item: any) {
    if (item.id === this.selectedFolderId) {
      return;
    }
    let folderId = item.id === null ? '2' :  item.id === '' ? '1' : item.id;
    // console.log('folderId=',folderId);
    // this._folderApiService.setCacheSelectedFolderId(folderId);
    this.selectedFolderId = item.id;
    this.onSelect.emit(this.selectedFolderId);
  }

  handleOnSearchFolder(keySearch: string) {
    this.searchFolder(keySearch);
  }

  handleOpenAddEdit() {
    if (this.folderList.length > 50) {
      this._toast.show(
        'warning',
        'i18n_quantity_exceed_50_folder'
      );
      return;
    }
    this.openAddModal();
    this._changeDetection.detectChanges();
  }

  handleOnMenuClick(event: any, item: any) {
    event.stopPropagation();
    event.preventDefault();

    this.menuShow = true;
    
    const eleRect = event.target.getBoundingClientRect();
    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    const top = eleRect.top - containerRect.top;
    const left = eleRect.left - containerRect.left;

    this.menuTop = `${top - 105}px`;
    this.menuLeft = `${left - 35}px`;
    this.detectChanges();
    this.selectedFolderMenuItem = item;
  }

  handleOnOverlayMenuClick(event: any) {
    event.stopPropagation();
    this.menuShow = false;
    this.detectChanges();
  }

  handleOnEditFolder(event: any) {
    event.stopPropagation();
    this.menuShow = false;
    this.detectChanges();
    this.openEditModal();
  }

  handleOnRemoveFolder(event: any) {
    event.stopPropagation();
    this.menuShow = false;
    this.detectChanges();
    this.showConfirmDeleteFolder();
  }

  searchFolder(keySearch: string) {
    if (keySearch === this.searchValue) {
      return;
    }
    this.searchValue = keySearch;
    if (!this.searchValue) {
      this.disFolderList = [...this.folderList];
    }
    this.filterDisplayFolder();
  }

  filterDisplayFolder() {
    // this.disFolderList = this.folderList.filter((item: any) => {
    //   if (DefineFunction.convertCitationVietnameseUnsigned(item.name).includes(DefineFunction.convertCitationVietnameseUnsigned(this.searchValue))) {
    //     return true;
    //   }
    //   return false;
    // });

    this.detectChanges();
  }

  openAddModal() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreFolderAddEditComponent).create(this.injector);
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
      this._changeDetection.detectChanges();
    });
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onOk.subscribe((newItem: any) => {
      this.folderList.splice(2,0,newItem);
      this.selectedFolderId = newItem.id;
      this.onSelect.emit(this.selectedFolderId);
      this.detectChanges();
      this.filterDisplayFolder();
    });
    this._domService.addDomToBody(modalRef);
    this._changeDetection.detectChanges();
  }

  openEditModal() {
    if (!this.selectedFolderMenuItem) {
      return;
    }
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreFolderAddEditComponent).create(this.injector);
    modalRef.instance.name = this.selectedFolderMenuItem.name;
    modalRef.instance.folderId = this.selectedFolderMenuItem.id;
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });
    modalRef.instance.onOk.subscribe((newName: string) => {
      this.selectedFolderMenuItem.name = newName;
      this.detectChanges();
    });
    this._domService.addDomToBody(modalRef);
  }

  showConfirmDeleteFolder() {
    const modalRef = this.componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreFolderDeleteNotiComponent).create(this.injector);
    modalRef.instance.name = this.selectedFolderMenuItem.name;
    modalRef.instance.id = this.selectedFolderMenuItem.id;
    modalRef.instance.zIndex = this.zIndex + 3;
    modalRef.instance.onClose.subscribe((event) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });
    modalRef.instance.onOk.subscribe((event: any) => {
      this.folderList = this.folderList.filter((item: any) => {
        if (item.id === this.selectedFolderMenuItem.id) {
          return false;
        }
        return true;
      });
      
      if (this.selectedFolderMenuItem.id === this.selectedFolderId) {
        setTimeout(() => {
          this.selectedFolderId = '';
          this.onSelect.emit(this.selectedFolderId);
        }, 300);
      }
      // this.changeDetection.detectChanges();
      this.filterDisplayFolder();
      this._toast.show(
        'success','i18n_notification_manipulation_success'//`Xoá thư mục ${modalRef.instance.name} thành công.`
      );
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.showModal();
  }

  getFolderListItems() {
    return this.folderList.filter((item) => { 
      if (item.id === '') {
        return false;
      }
      return true;
    });
  }

  detectChanges() {
    if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
      this._changeDetection.detectChanges();
    }
  }

}
