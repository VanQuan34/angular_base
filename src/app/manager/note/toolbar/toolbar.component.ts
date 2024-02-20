import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef,
  ComponentFactoryResolver, Injector } from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';
import { MoWbSelectToggleComponent } from 'src/app/components/select/toggle/toggle.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { MoWbManagerNoteListAddComponent } from '../list/add/add.component';
import { ICategoryItem } from '../category/category.component';
import { INoteInfo } from '../list/list.component';
import { MoWbMediaStoreModalComponent } from 'src/app/media-store/store-modal/media-store-modal.component';
import { MoWbManagerNoteToolbarUploadComponent } from './upload/upload.component';

interface IItemStatus{
  id: string,
  name: string
}

@Component({
  selector: 'mo-wb-manager-note-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class MoWbManagerNoteToolbarComponent extends MoWbDetectionComponent {

  addPageOptionItems: any[] = [];
  pageStateItems: IItemStatus[] = [];
  isShowToggle: boolean = false;
  valueSearch: string;
  isStatus:boolean = true;
  status: 'published' | 'unpublished' | 'stopped' | 'all';

  @Input() isBack: boolean = true;
  @Input() categoryList: ICategoryItem[];
  @Input() zIndex: number;

  @Output() onValueSearch = new EventEmitter<string>;
  // @Output() onAddFolder = new EventEmitter<ICategoryItem>;
  @Output() onAddNewNote = new EventEmitter<any>;
  @Output() onChangeStatus = new EventEmitter<any>;

  // @Output() onClose = new EventEmitter<any>();

  @ViewChild('selectToggle') selectToggle: MoWbSelectToggleComponent;

  constructor(
    private _toast: ToastTranslateService,
    // private _categoryService: MoWbSiteCategoryApiService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public override _changeDetection: ChangeDetectorRef,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
  ) {
    super(_changeDetection)
  }

  override ngOnInit() {
    this.initData();
  }

  override ngAfterViewInit() {
  }

  /**
   * init data
   */
  async initData() {
    // add page options
    this.addPageOptionItems = [
      { 
        id: 'add-blank',
        svg: 'empty-page.svg',
        title: 'Tạo ghi chú mới',
        sub: 'File tải lên được lưu trữ nội bộ'
      },
      {
        id: 'add-from-file',
        svg: 'template-page.svg',
        title: 'Tải lên file .txt có sẵn',
        sub: 'Sử dụng file .txt có sẵn từ máy tính'
      },
      {
        id: 'upload',
        svg: 'upload-page.svg',
        title: 'Tải file lên',
        sub: 'Sử dụng file thiết kế sẵn có đuôi “.txt” từ máy tính của bạn'
      },
    ];

    // page state items
    this.pageStateItems = [
      {
        id: 'all',
        name: 'Tất cả'
      },
      {
        id: 'unpublished',
        name: 'Chưa xuất bản'
      },
      {
        id: 'published',
        name: 'Đã xuất bản'
      },
      {
        id: 'stopped',
        name: 'Ngừng xuất bản'
      },
    ]
  }

  /**
   * add new site blank
   */
  addPageBlank(){
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteListAddComponent).create(this._injector);
    modalRef.instance.zIndex = this.zIndex + 50;
    modalRef.instance.width = '550px';
    modalRef.instance.title = 'Tạo ghi chú';
    modalRef.instance.categoryList = this.categoryList;

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });
    // modalRef.instance.onAddFolder.subscribe(folder => {
    //   this.onAddFolder.emit(folder);
    // });

    modalRef.instance.onCreateNote.subscribe((note: INoteInfo) => {
      this.onAddNewNote.emit(note);
      this._domService.removeComponentFromBody(modalRef);
    })
    
    this._domService.addDomToBody(modalRef);
  }

  onShowModalUploadFile(){
    this.showMediaLibrary();
  }

  showMediaLibrary() {
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbMediaStoreModalComponent).create(this._injector);
    modalRef.instance.mode = 'IMAGE';
    modalRef.instance.multiple = false;
    modalRef.instance.onClose.subscribe((event: any) => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });

    modalRef.instance.onSelectedFiles.subscribe((files: any[]) => {
      if (files.length) {
        // this.changeImageUrl(files[0]);
        this.detectChanges();
      }
    });

    this._domService.addDomToBody(modalRef);
  }

  /**
   * add site from template
   */
  addNoteFromFileTxt() {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteToolbarUploadComponent).create(this._injector);
    modalRef.instance.title = 'Tải lên file *.txt có sẵn';
    modalRef.instance.zIndex = this.zIndex + 50;
    modalRef.instance.categoryList = this.categoryList;
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });
    modalRef.instance.onCreateNote.subscribe((note: INoteInfo) => {
      this.onAddNewNote.emit(note);
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });
    this._domService.addDomToBody(modalRef);
  }

  /**
   * upload site to create
   */
  uploadSite(){
    this.onShowModalUploadFile();
  }

  /**
   * handle on add page click
   * @param item 
   */
  handleOnAddPageClick(item: any) {
    switch(item.id){
      case 'add-blank':
        this.addPageBlank();
        break;
      case 'add-from-file':
        this.addNoteFromFileTxt();
        break;
      case 'upload':
        this.uploadSite();
      break;
      default: break;      
    }
    this.selectToggle.close();
  }

  /**
   * handle input search
   * @param value 
   */
  handleOnInputValueChange(value: string){
    this.valueSearch = value;
    this.onValueSearch.emit(value);
  }

  /**
   * select status
   * @param item 
   */
  handleOnSelectStatus(item: any){
    this.status = item[0].id;
    this.onChangeStatus.emit(this.status);
  }
}
