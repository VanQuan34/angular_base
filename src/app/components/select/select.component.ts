import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, 
  ElementRef, Injector, Input, SimpleChanges, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../detection.component';
import { IFetchDataParam, MoWbSelectDropdownComponent } from './dropdown/dropdown.component';

@Component({
  selector: 'mo-wb-components-select',
  templateUrl: 'select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectComponent extends MoWbDetectionComponent {

  dropdownRef: ComponentRef<MoWbSelectDropdownComponent>;
  selectedItems: any[] = [];
  hasError: boolean = false;
  keySelected: string;

  @Input() type: 'singe' | 'tree' | 'group'= 'singe';
  @Input() isSelectMultiple: boolean = false;
  @Input() selectTitle: string = 'Chọn thông tin';
  @Input() state: '' = '';
  @Input() selectedIds: string[] = [];
  @Input() items: any[] = [];
  @Input() templateItem: TemplateRef<any>;
  @Input() templateSelect: TemplateRef<any>;
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 2500;
  @Input() itemHeight: number = 28;
  @Input() itemLengthDisplay: number = 20;
  @Input() hasSearch: boolean = false;
  @Input() searchPlaceholder: string = 'Tìm kiếm';
  @Input() hasAddButton: boolean = false;
  @Input() addButtonLabel: string = 'Thêm mới';
  @Input() hasRemoveButton: boolean = false;
  @Input() isRequired: boolean = true;
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';
  @Input() label: string;
  @Input() classIncludeLabel: string;
  @Input() showAsterisk: boolean;
  @Input() key: string = 'id';
  @Input() keyName: string = 'name';
  @Input() minLengthDisplay: number = 5;
  @Input() hasIconLeft: boolean;
  @Input() isHtmlItem: boolean = false;
  @Input() enable: boolean = true;
  @Input() isHeightAuto: boolean = false;
  @Input() ignoreSelectItemHtml: boolean = false;
  @Input() classIncludeSelect: string = '';
  @Input() childKey: string = 'child';
  @Input() childItemKey: string = 'id';
  @Input() childItemName: string = 'name';
  @Input() disableSelectedIds: string[] = [];
  @Input() dynamicLoadData: boolean = false;
  @Input() fetchParam: IFetchDataParam;
  @Input() ignoreKeys: string[];

  @Output() onSelectedChange = new EventEmitter<any[]>();
  @Output() onInitData = new EventEmitter<any>();
  @Output() onAddItem = new EventEmitter<any>();
  @Output() onScroll = new EventEmitter<any>();
  @Output() onLoadData = new EventEmitter<IFetchDataParam>();
  
  @ViewChild('selectEl') selectRef: ElementRef<HTMLElement>;

  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    this.keySelected = this.type === 'singe' ? this.keyName : this.childItemName;
    // console.log('keySelected=', this.keySelected);
    this.onInitData.emit({});
    this.detectChanges();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && change['items']) {
      // console.log('cate items=', this.items);
      if (this.dropdownRef && this.dropdownRef.instance) {
        this.dropdownRef.instance.setItems(this.items);
      };
      this.updateSelectedItems(true);
      this.detectChanges();
    }
    if (change && change['selectedIds']) {
      // console.log('cate items=', this.items);
      this.updateSelectedItems(true);
      this.detectChanges();
    }
  }


  /**
   * update selected items
   * @param ignoreValidate
   */
  updateSelectedItems(ignoreValidate: boolean = false) {
    if(!this.items){
      return;
    }
    // if is singe
    if (this.type === 'singe') {
      this.selectedItems = this.items.filter(item => {
        if (this.selectedIds.includes(item[this.key])) {
          return true;
        }
        return false;
      });

      if (!ignoreValidate) {
        this.validate();
        this.onSelectedChange.emit(this.selectedItems);
      }
      return;
    }
    // if is tree
    const childItems = this.getChildItems(this.items);
    this.selectedItems = childItems.filter(item => {
      if (this.selectedIds.includes(item[this.childItemKey])) {
        return true;
      }
      return false;
    }); 
    
    if (!ignoreValidate) {
      this.validate();
      this.onSelectedChange.emit(this.selectedItems);
    }
  }

  /**
   * get child of items
   * @param items 
   */
  getChildItems(items: any[]) {
    if (!items || !items.length) {
      return [];
    }
    let childItems: any[] = [];
    for (let i = 0; i < items.length ; i++) {
      const item = items[i];
      if (!item[this.childKey]) {
        childItems.push(item);
        continue;
      } 
      childItems = [...childItems, ...this.getChildItems(item[this.childKey])]
    }

    return childItems;
  }

  /**
   * open select dropdown
   */
  openSelectDropdown() {
    this.dropdownRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbSelectDropdownComponent).create(this._injector);
    this.dropdownRef.instance.zIndex = this.zIndex + 50;
    this.dropdownRef.instance.targetEl = this.selectRef.nativeElement;
    this.dropdownRef.instance.items = this.items;
    this.dropdownRef.instance.selectedIds = this.selectedIds;
    this.dropdownRef.instance.type = this.type;
    this.dropdownRef.instance.itemHeight = this.itemHeight;
    this.dropdownRef.instance.itemLengthDisplay = this.itemLengthDisplay;
    this.dropdownRef.instance.isSelectMultiple = this.isSelectMultiple;
    this.dropdownRef.instance.hasAddButton = this.hasAddButton;
    this.dropdownRef.instance.hasRemoveButton = this.hasRemoveButton;
    this.dropdownRef.instance.hasSearch = this.hasSearch;
    this.dropdownRef.instance.searchPlaceholder = this.searchPlaceholder;
    this.dropdownRef.instance.templateItem = this.templateItem;
    this.dropdownRef.instance.key = this.key;
    this.dropdownRef.instance.minLengthDisplay = this.minLengthDisplay;
    this.dropdownRef.instance.keyName = this.keyName;
    this.dropdownRef.instance.isHtmlItem = this.isHtmlItem;
    this.dropdownRef.instance.addButtonLabel = this.addButtonLabel;
    this.dropdownRef.instance.hasIconLeft = this.hasIconLeft;
    this.dropdownRef.instance.isHeightAuto = this.isHeightAuto;
    this.dropdownRef.instance.childKey = this.childKey;
    this.dropdownRef.instance.childItemKey = this.childItemKey;
    this.dropdownRef.instance.childItemName = this.childItemName;
    this.dropdownRef.instance.disableSelectedIds = this.disableSelectedIds;
    this.dropdownRef.instance.dynamicLoadData = this.dynamicLoadData;
    this.dropdownRef.instance.fetchParam = this.fetchParam;
    this.dropdownRef.instance.ignoreKeys = this.ignoreKeys;

    this.dropdownRef.instance.onAddItem.subscribe(()=>{
      this.onAddItem.emit();
    })

    this.dropdownRef.instance.onClose.subscribe((event: any) => { 
      this.closeMenu();
    });
    
    this.dropdownRef.instance.onSelectItems.subscribe((selectedIds: string[]) => {
      this.updateSelectedIds(selectedIds);
    });

    this.dropdownRef.instance.onScrollToBottom.subscribe(()=>{
      this.onScroll.emit();
    });

    this.dropdownRef.instance.onLoadData.subscribe((fetchParam: IFetchDataParam)=>{
      this.onLoadData.emit(fetchParam);
    });
    this.dropdownRef.instance.onItemsChanged.subscribe((items: any[])=>{
      this.items = items;
    });

    this._domService.addDomToBody(this.dropdownRef);
  }

  /**
   * update selectedIds
   * @param selectedIds 
   */
  updateSelectedIds(selectedIds: string[]) {
    this.selectedIds = [...selectedIds];
    this.updateSelectedItems();
    // console.log('updateSelectedIds ',this.selectedIds);
    // console.log('updateSelectedIds ',this.selectedItems);
    this.detectChanges();
  }

  /**
   * validate selected items
   */
  validate() {
    if (!this.selectedIds || !this.selectedIds.length) {
      this.hasError = true;
      this.detectChanges();
      return false;
    }
    this.hasError = false;
    this.detectChanges();
    return true;
  }

  /**
   * close menu
   */
  closeMenu() {
    if (this.dropdownRef) {
      this._domService.removeComponentFromBody(this.dropdownRef);
      this.dropdownRef = null;
    }
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * set items
   * @param items 
   */
  setItems(items: any[]) {
    this.items = items;
    this.detectChanges();
  }

  /**
   * handle on select click
   * @param event 
   */
  handleOnSelectClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.enable) {
      return;
    }
    const isOpen = !this.isOpen;
    // open dropdown
    if (isOpen) {
      this.openSelectDropdown();
      this.isOpen = true;
      this.detectChanges();
      return;
    }
    this.isOpen = false;
    this.detectChanges();
    // close dropdown
    if (this.dropdownRef) {
      this.dropdownRef.instance.close();
    }
  }

  /**
   * handle on tag item remove
   * @param item 
   * @param event
   */
  handleOnBtnItemRemove(item: any, event: MouseEvent) {
    event.stopPropagation();
    this.selectedIds = this.selectedIds.filter(id => {
      if (id !== item[this.key]) {
        return true;
      }
      return false;
    });
    this.updateSelectedItems();
    this.detectChanges();
  }

  handleLoadDataCompleted(items: any[], afterToken: string) {
    console.log('handleLoadDataCompleted items=', items)
    this.dropdownRef.instance.handleLoadDataCompleted(items, afterToken);
  }

}
