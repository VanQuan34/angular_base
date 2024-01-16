import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, 
  EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MoWbDetectionComponent } from '../../detection.component';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'src/app/utils/utils';
// import { GLOBAL } from 'src/app/common/types/global/global';
import { ZIndex } from 'src/app/common/types/global/zIndex';
// import { EDITOR } from 'src/app/landing/editor/editor-wrapper';


export interface IFetchDataParam {
  search?: string,
  category?: string,
  sort?: string,
  order?: 'asc' | 'desc',
  publish_status?: 'published' | 'unpublished' | 'stopped',
  per_page?: number,
  after_token?: string,
  applier_type?: string,
  page?: number
}

@Component({
  selector: 'mo-wb-components-select-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectDropdownComponent extends MoWbDetectionComponent {

  inputMaxWidth: string = '100%';
  opacity: number = 0;
  targetRect: DOMRect;
  totalHeight: number = 0;
  loading: boolean = false;
  loaded: boolean = false;
  canLoadMore: boolean = true;

  @Input() type: 'singe' | 'tree' | 'group'= 'singe';
  @Input() isSelectMultiple: boolean = false;
  @Input() state: '' = '';
  @Input() selectedIds: string[] = [];
  @Input() items: any[] = [];
  @Input() displayItems: any[] = [];
  @Input() templateItem: TemplateRef<any>;
  @Input() classInclude: string = '';
  @Input() targetEl: HTMLElement;
  @Input() zIndex: number = 2000;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() hasSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Tìm kiếm';
  @Input() hasAddButton: boolean = true;
  @Input() addButtonLabel: string = 'Thêm mới';
  @Input() hasRemoveButton: boolean = true;
  @Input() searchValue: string = '';
  @Input() itemHeight: number = 28;
  @Input() key: string = 'id';
  @Input() itemLengthDisplay: number = 6;
  @Input() minLengthDisplay: number = 5;
  @Input() keyName: string = 'name';
  @Input() hasIconLeft: boolean = true;
  @Input() isHtmlItem: boolean = false;
  @Input() isHeightAuto: boolean = false;
  @Input() childKey: string = 'child';
  @Input() childItemKey: string = 'id';
  @Input() childItemName: string = 'name';
  @Input() disableSelectedIds: string[] = [];
  @Input() dynamicLoadData: boolean = false;
  @Input() fetchParam: IFetchDataParam;
  @Input() ignoreKeys: string[] = [];
  
  @Output() onClose = new EventEmitter<any>();
  @Output() onAddItem = new EventEmitter<any>();
  @Output() onSelectItems = new EventEmitter<string[]>();
  @Output() onScrollToBottom = new EventEmitter<any>();
  @Output() onLoadData = new EventEmitter<IFetchDataParam>();
  @Output() onItemsChanged = new EventEmitter<any[]>();
  // @Output() onScrollToBottom = new EventEmitter<any>();
  
  // view child
  @ViewChild('input') inputRef: ElementRef;
  @ViewChild('container') containerEl: ElementRef<HTMLElement>;
  @ViewChild('itemTree') itemTree: ElementRef<HTMLElement>;

  constructor(
    public _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    this.zIndex = ZIndex.dropdown + 100;
    this.initEvents();
    if(this.items && !this.dynamicLoadData) {
      this.displayItems = Utils.copyObject(this.items);
    }
    if (this.dynamicLoadData) {
      this.loading = true;
    }
    this.detectChanges();
  }

  override ngAfterViewInit(): void {
    this.calcListItemsHeight();
    this.show();

    setTimeout(() => {
      this.updateSearchWidth(this.searchValue);
      this.detectChanges();
      // reset fetch param
      this.resetFetchParam();
      // load data
      this.onLoadData.emit(this.fetchParam);
    }, 0);
  }
  
  override ngOnDestroy(): void {
    this.removeEvents();
  }

  /**
   * reset fetch param
   */
  resetFetchParam() {
    if (!this.fetchParam) {
      return;
    }
    if (this.fetchParam.page) {
      this.fetchParam.page = 1;
    }
    if (this.fetchParam.search) {
      this.fetchParam.search = '';
      delete this.fetchParam.search;
    }
    if (this.fetchParam.after_token) {
      this.fetchParam.after_token = '';
      delete this.fetchParam.after_token;
    }
  }

  setItems(items: any[]) {
    this.items = items;
    this.displayItems = Utils.copyObject(this.items);
    this.detectChanges();
  }


  /**
   * init events
   */
  initEvents() {
    // $('div').on('scroll', this.handleOnWindowScroll);
    document.addEventListener('mousedown', this.handleOnDocClick);
    // if (GLOBAL && EDITOR.editorWrap && EDITOR.editorWrap.getDocument()) {
    //   EDITOR.editorWrap.getDocument().addEventListener('mousedown', this.handleOnDocClick);dfsd
    // }
    window.addEventListener('resize', this.handleOnWindowResize);
  }

  /**
   * remove events
   */
  removeEvents() {
    // $('div').off('scroll', this.handleOnWindowScroll);
    document.removeEventListener('mousedown', this.handleOnDocClick);
    window.removeEventListener('resize', this.handleOnWindowResize);
    // if (GLOBAL && EDITOR.editorWrap && EDITOR.editorWrap.getDocument()) {
    //   EDITOR.editorWrap.getDocument().removeEventListener('mousedown', this.handleOnDocClick);
    // }
  }

  /**
   * handle load data completed
   * @param items 
   * @param afterToken 
   * @returns 
   */
  handleLoadDataCompleted(items: any[], afterToken: string) {
    this.loading = false;

    this.displayItems = !this.loaded ? items : [...this.displayItems, ...items];
    this.displayItems = this.displayItems.filter(item => {
      const id = item[this.key];
      if (this.ignoreKeys.includes(id)) {
        return false;
      } 
      return true;
    });
    this.fetchParam.after_token = afterToken;
    // update list height
    this.calcListItemsHeight();
    this.onItemsChanged.emit(this.displayItems);
    this.detectChanges();

    // preview load more auto
    if (!this.loaded) {
      this.containerEl.nativeElement.scrollTop = 0;
      setTimeout(() => {
        this.loaded = true;
        this.detectChanges();
      }, 150);
    }
    // check can load more
    if (!items.length || items.length < this.fetchParam.per_page || (!this.fetchParam.page && !afterToken)) {
      this.fetchParam.after_token = null;
      this.canLoadMore = false;
      return;
    }
    
    if (this.fetchParam.page) {
      this.fetchParam.page += 1;
    }
    
    const scrollTop = this.containerEl.nativeElement.scrollTop;
    // console.log('scrollTop= ', scrollTop);
    this.containerEl.nativeElement.scrollTop = scrollTop - 100;
  }

  /**
   * calculate height of list items
   */
  calcListItemsHeight() {
    let height = this.itemHeight * this.itemLengthDisplay;
    if (!this.displayItems.length) {
      this.height = 28;
      this.updateTotalHeight();
      return;
    }
    const length = this.getItemsLength(this.displayItems);
    // console.log('calcListItemsHeight length=', length);
    if (length < this.itemLengthDisplay) {
      height = this.itemHeight * length;
    }
    this.height = height;

    // limit height
    const extraTotal = this.getExtraHeight();
    const rect = this.targetEl.getBoundingClientRect();
    this.height = Math.min(this.height, window.innerHeight - 10 - rect.top - rect.height - extraTotal);
    const minLength = Math.min(this.minLengthDisplay, this.displayItems.length);
    this.height = Math.max(this.itemHeight * minLength, this.height);
    
    // update total height
    this.updateTotalHeight();
  }

  /**
   * return length of items
   * @params items
   */
  getItemsLength(items: any[]) {
    let length = items.length;
    for (let i=0; i < items.length; i++){
      if (!items[i][this.childKey]) {
        continue;
      }
      if (!items[i][this.childKey].length) {
        length += 1;
      }
      length += this.getItemsLength(items[i][this.childKey]);
    }
    return length;
  }

  /**
   * update total height
   */
  updateTotalHeight() {
    this.totalHeight = this.height + this.getExtraHeight();
  }

  /**
   * return total extra height 
   */
  getExtraHeight() {
    let height = 0;
    if (this.hasSearch) {
      height += 32;
    }
    if (this.hasRemoveButton) {
      height += 32;
    }
    if (this.hasAddButton) {
      height += 32;
    }
    return height;
  }

  /**
   * update input search max width
   * @param searchValue
   * @returns
   */
  updateSearchWidth(searchValue: string) {
    if (searchValue) {
      const width = 12 + 8 + 10 + 12 + 16;
      this.inputMaxWidth = `calc(100% - ${width}px)`;
      return;
    } 
    const width = 12 + 8 + 16;
    this.inputMaxWidth = `calc(100% - ${width}px)`;
  }

  /**
   * change search value
   * @param searchValue 
   */
  changeSearchValue(searchValue: string) {
    this.updateSearchWidth(searchValue);
    this.searchValue = searchValue.trim();
    // if is load dynamic data
    if (this.dynamicLoadData) {
      this.fetchParam.search = searchValue;
      if (this.fetchParam.page) {
        this.fetchParam.page = 1;
      }
      if (this.fetchParam.after_token) {
        this.fetchParam.after_token = '';
        delete this.fetchParam.after_token;
      }
      this.loaded = false;
      this.canLoadMore = true;
      this.loading = true;
      this.detectChanges();
      this.onLoadData.emit(this.fetchParam);
      return;
    }
    
    if (this.type === 'singe') {
      this.searchSingeValues();
    } else if (this.type === 'tree') {
      this.searchTreeValues();
    }

    // calculator height
    this.calcListItemsHeight();
    // update position
    this.updatePosition(true);
    
    this.detectChanges();
  }

  /**
   * search singe values
   */
  searchSingeValues() {
    if (!this.searchValue) {
      this.displayItems = Utils.copyObject(this.items);
      return;
    } 
    const _searchValue = Utils.toNormalize(this.searchValue.toLocaleLowerCase());
    this.displayItems = this.items.filter(item => {
      const name = Utils.toNormalize(item[this.keyName].toLowerCase());
      if(name.includes(_searchValue)) {
        return true;
      }
      return false;
    });
  }

  /**
   * search tree value
   */
  searchTreeValues() {
    this.displayItems = Utils.copyObject(this.items);
    // console.log('searchTreeValues displayItems=', this.displayItems, ' items=', this.items, ' searchValue=', this.searchValue);
    if (!this.searchValue) {
      return;
    } 
    const searchValue = Utils.toNormalize(this.searchValue.toLocaleLowerCase());
    this.displayItems.forEach((item: any) => {
      if (item[this.childKey]) {
        item[this.childKey] = this.filterChildItem(searchValue, item[this.childKey]);
      }
    });
  }

  /**
   * filter child value
   * @param searchValue 
   */
  filterChildItem(searchValue: string, childItems: any[]) {
    childItems = childItems.filter(item => {
      if (!item[this.childKey]) {
        const name = Utils.toNormalize(item[this.childItemName].toLowerCase());
        if(name.includes(searchValue)) {
          return true;
        }
        return false;
      }
      item[this.childKey] = this.filterChildItem(searchValue, childItems);
      return true;
    });

    return childItems;
  }

  /**
   * show dropdown
   */
  show() {
    // update position
    this.updatePosition();
    this.opacity = 1;
    this.detectChanges();
  }

  /**
   * update position
   * @param forceUpdate
   */
  updatePosition(forceUpdate: boolean = false): boolean {
    const rect = this.targetEl.getBoundingClientRect();
    if (!forceUpdate && !Utils.checkDifferentRect(rect, this.targetRect)) {
      return false;
    }
    this.top = rect.top + rect.height + 4;
    this.left = rect.left;
    this.width = rect.width;
    this.targetRect = rect;

    const windowHeight = window.innerHeight - 5;
    this.top = Math.min(windowHeight - this.totalHeight, this.top);
    this.top = Math.max(20, this.top);
    return true;
  }

  /**
   * close dropdown
   */
  close() {
    this.opacity = 0;
    this.detectChanges();
    setTimeout(() => {
      this.onClose.emit({});
    }, 150);
  }
  
  /**
   * handle on input search
   * @param event 
   */
  handleOnInputSearchKeyUp(event: any) {
    const searchValue = this.inputRef.nativeElement.value.trim();
    if (searchValue === this.searchValue) {
      return;
    }

    if (!this.dynamicLoadData) {
      this.changeSearchValue(searchValue);
      return;
    }
    
    if (event.keyCode === 13) {
      this.changeSearchValue(searchValue);
    }
  }

  /**
   * handle on clear search
   * @param event 
   */
  handleOnClearSearchClick(event: MouseEvent) {
    this.changeSearchValue('');
  }

  /**
   * handle document scroll
   * @param event 
   */
  handleOnWindowScroll = (event: any) => {
    // console.log('handleOnWindowScroll');
    if (this.updatePosition()) {
      this.detectChanges();
    }
  }
  /**
   * handle on window resize
   * @param event 
   */
  handleOnWindowResize = (event: any) => {
    this.calcListItemsHeight();
    this.updatePosition();
    this.detectChanges();
  }

  /**
   * handle on remove all selected
   * @param event 
   */
  handleOnRemoveAllSelected(event: MouseEvent) {
    this.selectedIds = [];
    this.detectChanges();
    this.onSelectItems.emit([]);

    this.calcListItemsHeight();
    this.updatePosition();
    this.detectChanges();
  }

  /**
   * handle on add click
   * @param event 
   */
  handleOnAddClick(event: MouseEvent) {
    this.onAddItem.emit({});
    this.close();
  }

  /**
   * handle on item select
   * @param item 
   */
  handleOnItemSelect(item: any) {
    if (this.selectedIds.includes(item[this.key])) {
      return;
    }
    if (this.type === 'singe') {
      this.selectedIds = [item[this.key]];
      // this.detectChanges();
      this.onSelectItems.emit(this.selectedIds);
      this.close();
      return;
    }

    this.selectedIds.push(item[this.key]);
    this.detectChanges();
    this.onSelectItems.emit(this.selectedIds);

    this.calcListItemsHeight();
    this.updatePosition();
    this.detectChanges();
  }

  /**
   * handle on dropdown mousedown
   * @param event 
   */
  handleOnDropdownMousedown(event: MouseEvent) {
    event.stopPropagation();
  } 

  /**
   * handle on dropdown click
   * @param event 
   */
  handleOnDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * handle on document click
   * @param event 
   */
  handleOnDocClick = (event: MouseEvent) => {
    this.close();
  }

  /**
   * handle on selected item
   * @param event 
   */
  handleOnSelectedItem(event: any) {
    const item = event.item;
    const isSelected: boolean = event.isSelected;
    const key = this.type === 'singe' ? this.key : this.childItemKey;

    // if is single 
    if (!this.isSelectMultiple) {
      this.selectedIds = [item[key]];
      this.detectChanges();

      this.onSelectItems.emit(this.selectedIds);
      this.close();
      return;
    }
    // console.log('dropdown handleOnSelectedItem event=', event, this.selectedIds);
    this.selectedIds = this.selectedIds.filter(selectedId => {
      return selectedId === item[key] ? false : true;
    });
    if (isSelected) {
      this.selectedIds.push(item[key]);
    }
    // console.log('dropdown handleOnSelectedItem event=', event, isSelected, this.selectedIds);
    this.detectChanges();
    this.onSelectItems.emit(this.selectedIds);

    this.calcListItemsHeight();
    this.updatePosition();
    this.detectChanges();
  }
  /**
   * handle on toggle open tree
   * @param $event 
   */
  handleOnToggleOpen(item: any) {
    if (!item[this.childKey] || !item[this.childKey].length) {
      return;
    }
    const childLength = this.getItemsLength(item[this.childKey]);
    const childHeight = childLength * this.itemHeight;
    if (this.itemTree.nativeElement.clientHeight - childHeight > this.totalHeight) {
      return;
    }
    if (item.isOpen) {
      if (this.height + childHeight < this.totalHeight - this.getExtraHeight()) {
        this.height += childHeight;
      } else {
        this.height = this.totalHeight - this.getExtraHeight();
      }
    } else {
      if (this.height - childHeight < this.totalHeight - this.getExtraHeight()) {
        if ((this.height - childHeight) > this.height) {
          this.height -= childHeight;
        } else {
          this.containerEl.nativeElement.style.height = 'auto';
        }
      } else {
        this.height = this.totalHeight - this.getExtraHeight();
      }
    }

    this.updateTotalHeight();
    this.detectChanges();
  }

  /**
   * handle on scroll list
   * @param e 
   */
  handleOnScroll(e: any) {
    const containerEl = this.containerEl.nativeElement;
    if(containerEl.scrollTop + containerEl.clientHeight + 2 > containerEl.scrollHeight) {
      this.onScrollToBottom.emit();

      if (this.canLoadMore && this.loaded && !this.loading) {
        this.loading = true;
        this.detectChanges();
        this.onLoadData.emit(this.fetchParam);
      }
    }
  }
}
