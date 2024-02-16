// login.component.ts
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagerAuthApiService } from 'src/app/api/auth/authApi';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { GLOBAL } from 'src/app/common/types/global/global';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';
import { MoWbTableComponent } from 'src/app/components/table/table.component';
// import { FileManagerListDetailsPreviewComponents } from './preview/preview.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { IParamList, ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { ICategoryItem } from '../category/category.component';
import { MoWbManagerNoteListEditComponent } from './edit/edit.component';
import { MoWbManagerNoteListDuplicateComponent } from './duplicate/duplicate.component';
import { MoWbConfirmModalService } from 'src/app/components/modal/v4/confirm/showConfirmModal.service';
import { MoWbModalV4ConfirmComponent } from 'src/app/components/modal/v4/confirm/confirm.component';
import { MoWbManagerNoteEditorComponent } from '../editor/editor.component';
import { MoWbManagerNoteListPreviewComponent } from './preview/preview.component';
// import { FileManagerListEditComponents } from './edit/edit.component';
// import { FileManagerListRemoveComponents } from './remove/remove.component';

interface ITableColumnSetting {
  type: 'CHECKBOX' | 'TEXT',
  key: string,
  name?: string;
  width: number;
  widthUnit: 'px' | '%';
  textAlign: 'start' | 'center' | 'end';
}

export interface INoteInfo{
  id?: number,
  note_id: string,
  title: string,
  description: string,
  content?: string,
  category_id: string,
  user_id: string,
  createdAt: string,
  updatedAt?: string
}

@Component({
  selector: 'mo-wb-manager-note-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MoWbManagerNoteListComponent extends MoWbDetectionComponent {

  users: any = [];
  tableColumns: ITableColumnSetting[] = [];
  siteList: Array<any> = [];
  tableMenuItems: any[] = [];
  menuItems: any[] = [];
  isLoading: boolean;
  hasScroll: boolean = false;
  isCheckedAll: boolean;
  isCheckedItem: boolean;
  isClick: boolean;
  isToggle:boolean;
  page: number;
  searchString: string;
  type: 'ALL' | 'CATE' = 'ALL';
  currentCate: ICategoryItem;
  paramsFetch: IParamList;

  confirmModal: ComponentRef<MoWbModalV4ConfirmComponent> ;

  @Input() categoryList: ICategoryItem[];
  @Input() valueSearch: string;
  @Output() onDuplicateNote = new EventEmitter<any>;
  @Output() onRemoveNote = new EventEmitter<any>;

  @ViewChild('table') tableRef: MoWbTableComponent;

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private _noteApiService: ManagerNoteApiService,
    private authApiService: FileManagerAuthApiService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public _domService: AddComponentToBodyService,
    private _confirmModal: MoWbConfirmModalService,
    public _injector: Injector,
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    this.page = 1;
    this.searchString = '';
    this.paramsFetch = {page: this.page}
    this.initData();
    // this.fetchListUsers();
  }

   /**
   * init data
   */
  initData() {
    this.tableColumns = [
      {
        type: 'CHECKBOX',
        key: 'chk',
        name: '',
        width: 3,
        widthUnit: '%',
        textAlign: 'center',
      },
      {
        type: 'TEXT',
        key: 'name',
        name: 'Name',
        width: 20,
        widthUnit: '%',
        textAlign: 'start'
      },
      {
        type: 'TEXT',
        key: 'description',
        name: 'Mô tả ngắn',
        width: 40,
        widthUnit: '%',
        textAlign: 'start'
      },
      {
        type: 'TEXT',
        key: 'created_time',
        name: 'Thời gian tạo ghi chú',
        width: 20,
        widthUnit: '%',
        textAlign: 'start'
      },
      {
        type: 'TEXT',
        key: 'status',
        name: 'Danh mục',
        width: 15,
        widthUnit: '%',
        textAlign: 'start'
      },
    ];
    this.isLoading = false;

    // init table menu items
    this.tableMenuItems = [
      {
        id: 'edit-site',
        name: 'Chỉnh sửa note',
        divider: true,
        icon: 'mo-icn-edit'
      },
      {
        id: 'edit-name',
        name: 'Sửa tên note',
        divider: true,
        icon: 'mo-icn-editor-color-text'
      },
      {
        id: 'preview',
        name: 'Xem trước note',
        divider: true,
        icon: 'mo-icn-eye-outline'
      },
      {
        id: 'copy',
        name: 'Sao chép note',
        divider: true,
        icon: 'mo-icn-copy'
      },
      {
        id: 'remove',
        name: 'Xoá note',
        divider: false,
        icon: 'mo-icn-remove',
        disable: false
      },
    ];
    this.menuItems = this.tableMenuItems;
    // this.getListNote();
  }

  handleOnClickNav(e: boolean){
    this.isToggle = e;
    console.log('this.isToggle=', this.isToggle);
  }

  async getListNote(type: 'ALL' | 'CATE', category?: ICategoryItem){
    console.log('page===', this.page, this.paramsFetch);
    let response;
    switch(type){
      default:
      case 'ALL':
        response = await this._noteApiService.fetchListNote(this.paramsFetch);
        break;
      case 'CATE':
        response = await this._noteApiService.fetchListNoteByCategory(category.category_id, this.valueSearch);
        break;
    }
    this.page = this.page + 1;
    this.paramsFetch['page'] = this.page;
    console.log('res===', response);
    return response;
  }

  /*
   * fetch data
   * @param fetchParam 
   * @returns 
   */
  async fetchData(type: 'ALL' | 'CATE') {
    const response = await this.getListNote(type, this.currentCate); //this.fetchListFiles();
    this.isLoading = false;
    console.log('res===', response);
    if (!response || response.code !== 200) {
      this.isLoading = false;
      // this._toast.show('error', response.message);
      this._toast.show('error', response?.message || 'Có vấn đề xảy ra');

      this.tableRef.handleLoadDataCompleted(false, [], this.page);
      return;
    };
    const items = response.data;
    if (this.tableRef) {
      this.tableRef.handleLoadDataCompleted(true, items, this.page);
    }
  }

  handleOnTableLoadedData(params: any){
    this.fetchData(params);
    this.tableRef.canLoadMore = true;
    this.detectChanges();
  }

  updateParam(type: 'ALL' | 'CATE', category?: ICategoryItem,){
    this.type = type;
    this.currentCate = category;
    this.page = 1;
    this.paramsFetch['page'] = this.page;
    // this.fetchData(type, category);
    this.tableRef.canLoadMore = true;
    this.tableRef.reLoadData(type);
    this.detectChanges();
  }

  editNoteName(note: any){
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteListEditComponent).create(this._injector);
    modalRef.instance.noteInfo = note;
    modalRef.instance.title = 'Sửa tên ghi chú';
    modalRef.instance.width = '550px';
    modalRef.instance.onNameChange.subscribe((data)=>{
      note.title = data.title;
      note.description = data.description;
      this.detectChanges();
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onClose.subscribe(() => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });
    this._domService.addDomToBody(modalRef);
  }

  /**
   * remove file
   * @param note
   * @returns 
   */
  removeNote(note: INoteInfo){
    const content = `Ghi chú sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn xóa?`;
    this.confirmModal = this._confirmModal.showModal({
      zIndex: 2700,
      type: 'WARNING1',
      content: content,
      title: 'Thông báo',
      width: '500px',
      label: 'Xóa ghi chú',
      needClose: 'TRUE',
      okButtonCallback: () => {
        this.confirmModal.instance.setLoading(true);
        this.deleteNote(note);
      }
    });
  }

  async deleteNote(note: INoteInfo){
    const response = await this._noteApiService.deleteNote(note.note_id);
    if(!response || response.code !== 200){
      this._toast.show('error', response.message);
      return;
    }
    this.confirmModal.instance.setLoading(false);
    this.tableRef.items = this.tableRef.items.filter(item => item.note_id !== note.note_id);
    this.onRemoveNote.emit(note.category_id);
    this.tableRef.detectChanges();
    this._toast.show('success', 'Xóa ghi chú thành công');
  }

  handleOnChangeCheckedAll(e: any){}
  handleOnChangeCheckedItem($event: any, rowItem: any){}
  handleOnClickEditSite($event: any, note: INoteInfo){
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteEditorComponent).create(this._injector);
    modalRef.instance.noteInfo = note;
    modalRef.instance.onClose.subscribe(() => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 200);
    });
    this._domService.addDomToBody(modalRef);
  }

  handleOnClickShowReport(rowItem: any){}
  handleOnSelectMenuItem(event: any, item: INoteInfo){
    switch (event.id) {
      case 'edit-site':
        this.editNoteName(item);
        break;
      case 'report':
        // this.handleOnClickReport(item);
        break;
      case 'edit-name':
        this.editNoteName(item);
        break;
      case 'preview':
        this.previewNote(item);
        break;
      case 'copy':
        this.duplicateNote(item);
        break;
      case 'remove':
        this.removeNote(item);
        break;
      case 'seo':
        // this.showSettingSEO(item);
        break;  
    }
  }
  handleOnClickItemMenu($event: any, rowItem: any){}

  handleOnClickPreview(link: string){
    // const modalRef =  this._componentFactoryResolver.resolveComponentFactory(FileManagerListDetailsPreviewComponents).create(this._injector);
    // modalRef.instance.src = link;
    // // modalRef.instance.categoryList = this.categoryList;
    // modalRef.instance.onClose.subscribe((event: any) => {
    //   this._domService.removeComponentFromBody(modalRef);
    //   this.detectChanges();
    // });
    
    // this._domService.addDomToBody(modalRef);
  }

  previewNote(note: INoteInfo){
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteListPreviewComponent).create(this._injector);
    modalRef.instance.noteInfo = note;
    modalRef.instance.onClose.subscribe(() => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 200);
    });
    this._domService.addDomToBody(modalRef);
  }

  duplicateNote(item: INoteInfo) {
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteListDuplicateComponent).create(this._injector);
    modalRef.instance.noteInfo = item;
    modalRef.instance.width = '550px';
    modalRef.instance.title = 'Sao chép ghi chú';
    modalRef.instance.zIndex = 2600;
    modalRef.instance.categoryList = this.categoryList;
    modalRef.instance.onClose.subscribe(() => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 200);
    });
    modalRef.instance.onDuplicateSite.subscribe((note: INoteInfo) =>{
      console.log('note==', note);
      console.log('this.type===', this.type)
      if(this.type.trim() === 'ALL' || ( this.currentCate && this.currentCate['category_id'] === note.category_id) ){
        this.tableRef.items.unshift(note);
        this.tableRef.containerEl.nativeElement.scrollTop = 50;
        this.tableRef.containerEl.nativeElement.scrollTop = 0;
        this.tableRef.detectChanges();
      }
      // this.tableRef.reLoadData();
      this.onDuplicateNote.emit(note.category_id);
      this.detectChanges();
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 200);
    });
    this._domService.addDomToBody(modalRef);
  }

}
