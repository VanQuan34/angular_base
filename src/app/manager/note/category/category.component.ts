import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef, Injector, ComponentFactoryResolver, ComponentRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { MoWbTemplateApiService } from '../../../api/landing/templateApi';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';
// import { MoWbLandingV4SitesFolderEditComponent } from './edit/edit.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { MoWbModalV4ConfirmComponent } from 'src/app/components/modal/v4/confirm/confirm.component';
import { MoWbConfirmModalService } from 'src/app/components/modal/v4/confirm/showConfirmModal.service';
// import { MoWbLandingV4SitesFolderAddComponent } from './add/add.component';
import { Utils } from 'src/app/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { MoWbManagerNoteCategoryAddComponent } from './add/add.component';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { MoWbManagerNoteCategoryEditComponent } from './edit/edit.component';

export interface ICategoryItem{
  category_id: string,
  cate_name: string,
  cate_description: string,
  note_amount: number
}
interface IMenuCateEdit{
  id: string,
  name: string,
  divider: boolean,
  icon: string
}
@Component({
  selector: 'mo-wb-manager-note-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class MoWbManagerNoteCategoryComponent extends MoWbDetectionComponent {

  selectedTab: 'ALL' | 'TRASH' | 'CATE' = 'ALL';
  folderItems: ICategoryItem[] = [];
  folderMenuItems: IMenuCateEdit[] = [];
  allColor: string = '--pri';
  trashColor: string = '--btn-txt';
  folderColor: string = '--btn-txt'
  valueSearch: string = '';
  selectedFolder: string = '';
  isLoading: boolean;
  currentCategory: ICategoryItem;
  cateItems: ICategoryItem[] = [];
  confirmModalRef: ComponentRef<MoWbModalV4ConfirmComponent>;
  enableToolTips: Array<boolean> = [];
  zIndex: number = 2500;

  @Input() isBack: boolean = true;
  @Output() onClickCategory = new EventEmitter<ICategoryItem>;
  @Output() onClickAll = new EventEmitter<any>;
  @Output() onClickTrash = new EventEmitter<any>;
  @Output() updateNameCate = new EventEmitter<ICategoryItem>;
  @Output() onAddFolder = new EventEmitter<ICategoryItem>;
  @Output() onRemoveFolder = new EventEmitter<ICategoryItem>;
  @Output() onCategoryList = new EventEmitter<any>;
  
  constructor(
    private _toast: ToastTranslateService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public override _changeDetection: ChangeDetectorRef,
    private _confirmModal: MoWbConfirmModalService,
    private _translate: TranslateService,
    private _noteApiService: ManagerNoteApiService
  ) {
    super(_changeDetection)
  }

  override ngOnInit() {
    this.initData();
    this.isLoading = true;
  }

  override ngAfterViewInit() {
  }

  /**
   * get list category
   * @returns 
   */
  async getCategoryList(){
    const response = await this._noteApiService.fetchListCategory();
    if(response && response.code === 200){
      this.isLoading = false;
      return response.data;
    }
    this.isLoading = false;
    return [];
  }

  /**
   * init data
   */
  async initData() {
    this.isLoading = true;
    this.folderItems = await this.getCategoryList();
    this.cateItems = cloneDeep(this.folderItems);
    this.onCategoryList.emit(this.cateItems);
    this.detectChanges();
    this.folderMenuItems = [
      {
        id: 'edit-name',
        name: 'Sửa tên folder',
        divider: true,
        icon: 'mo-icn-editor-color-text'
      },
      {
        id: 'remove',
        name: 'Xoá folder',
        divider: false,
        icon: 'mo-icn-remove'
      }
    ];
  }

  /**
   * api create new folder
   * @returns 
   */
  async deleteCategory(cate: ICategoryItem){
    const response = await this._noteApiService.deleteCategory(cate.category_id);
    this.confirmModalRef.instance.setLoading(false);
    this.detectChanges();
    if (response && response.code === 200) {
      // this._toast.show('success', 'i18n_notification_manipulation_success');
      this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
      return true;
    }
    if(response && response.code === 409){
      return response.message;
    }
    // this._toast.show('error', response.message);
    this._toast.show('error', response.message);
    return false;
  }

  /**
   * show modal remove cate has site unpublished
   * @param cate 
   */
  showModalSuccessRemove(cate: ICategoryItem){
    const content = `Toàn bộ <strong class="mo-wb-color-main-txt">${0}</strong> trang "Chưa xuất bản" trong folder đã được di chuyển vào "Thùng rác" và lưu trữ tạm thời trong vòng 30 ngày.`;
    this._confirmModal.showModal({
      zIndex: this.zIndex,
      type: 'SUCCESS',
      content: content,
      title: 'Thông báo',
      width: '500px',
      label: 'i18n_closed',
      okButton1Callback: () => {
      },
    });
  }

  /**
   * change name category
   * @param item 
   */
  editNameCategory(item: ICategoryItem){
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteCategoryEditComponent).create(this._injector);
    modalRef.instance.zIndex = 5000;
    modalRef.instance.width = '550px';
    modalRef.instance.title = 'Sửa tên folder';
    modalRef.instance.categoryInfo = item; 

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });

    modalRef.instance.onEditFolder.subscribe((category: ICategoryItem) => {
      item.cate_name = category.cate_name;
      this.updateNameCate.emit(category);
      this._domService.removeComponentFromBody(modalRef);
    })
    
    this._domService.addDomToBody(modalRef);
  }

  /**
   * remove category
   */
  removeCategory(item: ICategoryItem){
    this.confirmModalRef = this._confirmModal.showModal({
      zIndex: 2600,
      type: 'WARNING1',
      content: `Bạn đã chọn folder <strong>${item.cate_name} </strong>. Bạn có chắc chắn muốn xóa?`,
      title: 'Thông báo',
      desc: '',
      width: '500px',
      label: 'Xóa folder',
      needClose: 'FALSE',
      okButtonCallback: async () => {
        this.confirmModalRef.instance.setLoading(true);
        const response = await this.deleteCategory(item);
        this._confirmModal.removeComponentFromBody(this.confirmModalRef);
        if(response === false){
          return;
        }
        if(typeof response !== 'boolean'){
          this.showModalNotRemove(response);
          return;
        }
        this.cateItems = this.cateItems.filter(folder => folder.category_id !== item.category_id);
        this.folderItems = this.folderItems.filter(folder => folder.category_id !== item.category_id);
        this.onRemoveFolder.emit(item);
        this.detectChanges();
      }
    });
  }

  /**
   * show modal not remove
   * @param content 
   */
  showModalNotRemove(content: string){
    const fullContent = `Không được phép xóa folder có chứa trang “Đã xuất bản” và “Ngừng xuất bản”. Vui lòng chuyển các trang không thỏa mãn điều kiện sang folder khác để tiếp tục hành vi.`;
    this.confirmModalRef = this._confirmModal.showModal({
      zIndex: this.zIndex + 100,
      type: 'ERROR',
      content: fullContent,
      title: 'Thông báo',
      desc: '',
      width: '570px',
      label: 'i18n_closed',
      needClose: 'FALSE',
      okButtonCallback: () => {
        this._confirmModal.removeComponentFromBody(this.confirmModalRef);
      }
    });
  }

  /**
   * handle on select menu item
   * @param item 
   */
  handleOnSelectMenuItem(event: any, item: ICategoryItem) {
    switch(event.id){
      case 'edit-name':
        this.editNameCategory(item);
        break;
      case 'remove':
        this.removeCategory(item);
        break;  
    }
  }

  /**
   * handle on input search
   * @param value 
   */
  async handleOnInputValueChanged(value: string){
    const listCate = cloneDeep(this.cateItems);
    this.valueSearch = value;
    // this.isLoading = true;
    // this.folderItems = await this.getCategoryList();
    this.searchCategory(listCate);
    this.detectChanges();
  }

  /**
   * search category in list
   * @returns 
   */
  searchCategory(listCate: ICategoryItem[]){
    if (!this.valueSearch) {
      this.cateItems = cloneDeep(this.folderItems);
      return;
    } 
    const _searchValue = Utils.toNormalize(this.valueSearch.toLocaleLowerCase()).trim();
    this.cateItems = listCate.filter(item => {
      const name = Utils.toNormalize(item.cate_name.toLowerCase());
      if(name.includes(_searchValue)) {
        return true;
      }
      return false;
    });
  }

  /**
   * handle active tab selected
   * @param e 
   * @param type 
   */
  handleOnClickActiveTab(e: MouseEvent, type:  'ALL' | 'TRASH' | 'CATE'){
    if(this.selectedTab === type){
      return;
    }
    switch(type){
      case 'ALL':
        this.onClickAll.emit();
        break;
      case 'TRASH':
        this.onClickTrash.emit();
        break;
      default: break;    
    }
    this.selectedFolder = '';
    this.selectedTab = type;
  }

  /**
   * handle click item category
   * @param item 
   */
  handleOnClickCategory(item: ICategoryItem){
    if(this.selectedFolder === item.category_id){
      return;
    }
    this.selectedTab = 'CATE';
    this.selectedFolder = item.category_id;
    this.currentCategory = item;
    this.onClickCategory.emit(item);
  }

  /**
   * handle add new folder
   * @param e 
   */
  handleOnClickAddNewFolder(e: MouseEvent){
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteCategoryAddComponent).create(this._injector);
    modalRef.instance.zIndex = 5000;
    modalRef.instance.width = '550px';
    modalRef.instance.title = 'Thêm thư mục mới';

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });

    modalRef.instance.onAddFolder.subscribe(folder =>{
      folder['note_amount'] = 0;
      this.cateItems.unshift(folder);
      this.detectChanges();
      this.onAddFolder.emit(folder);
      this._domService.removeComponentFromBody(modalRef);
    })
    
    this._domService.addDomToBody(modalRef);
  }

}
