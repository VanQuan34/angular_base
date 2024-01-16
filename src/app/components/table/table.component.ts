import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, 
  ElementRef, Injector, Input, SimpleChanges, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../detection.component';
import * as $ from 'jquery';

interface ITableColumnSetting {
  type: 'CHECKBOX' | 'TEXT',
  key: string,
  name?: string;
  width: number;
  widthUnit: 'px' | '%';
  textAlign: 'start' | 'center' | 'end';
}

interface ITableFetchDataParam {
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
  selector: 'mo-wb-components-table',
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbTableComponent extends MoWbDetectionComponent {

  loading: boolean = false;
  canLoadMore: boolean = true;
  isLoadingMore: boolean = false;

  @Input() loaded: boolean = false;
  @Input() fetchParam: any = {per_page: 15};
  @Input() classInclude: string = 'mo-wb-bg-w ';
  @Input() columnSetting: ITableColumnSetting[];
  @Input() templateHeader: TemplateRef<any>;
  @Input() templateRow: TemplateRef<any>;
  @Input() items: any[] = [];
  @Input() emptyErrorMsg: string = 'i18n_valid_empty_message';
  @Input() headerHeight: string = '32px';
  @Input() bodyClassInclude: string = '';
  @Input() containerClassInclude: string = '';
  @Input() isClick: boolean;
  @Input() spinnerSize: 'l' | 'm' | 's' | 't' = 'l';
  @Input() noneDataMsg: string = 'Chưa có dữ liệu';
  @Input() notFoundMsg: string = 'Không có kết quả';
  @Input() key: string = 'id';
  @Input() maxHeight: number;

  @Output() onSelectedChange = new EventEmitter<any[]>();
  @Output() onLoadedData = new EventEmitter<any>();
  @Output() onLoadedDataPerPage = new EventEmitter<any>();

  @ViewChild('container') containerEl: ElementRef<HTMLElement>;

  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver,
    public override _changeDetection: ChangeDetectorRef
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    // window.addEventListener('resize', this.handleOnWindowResize);
    if (this.items && this.items.length) {
      this.loaded = true;
      this.canLoadMore = false
    }
  }

  override ngAfterViewInit(): void {
    if (this.loaded) {
      return;
    }
    this.loading = true;
    this.canLoadMore = true;
    this.detectChanges();
    if(!this.isClick){
      this.onLoadedData.emit(this.fetchParam);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && change['items']) {
      // console.log('change items=', this.items);
      this.detectChanges();
    }
  }

  override ngOnDestroy(): void {
    // window.removeEventListener('resize', this.handleOnWindowResize);
  }

  /*
   * check scroll to bottom
   */
  checkScrollToBottom() {
    const containerEl = this.containerEl.nativeElement;
    // console.log('containerEl).scrollTop()=', $(containerEl).scrollTop(), $(containerEl).innerHeight(), containerEl.scrollHeight)
    if($(containerEl).scrollTop() + $(containerEl).innerHeight() > containerEl.scrollHeight - 5) {
      // console.log('scroll reach to bottom');
      return true;
    }
    return false;
  }

  /**
   * check if table is loaded data
   * @returns 
   */
  checkIsFirstLoadData() {
    return this.loaded ? false : true;
  }

  /**
   * update fetch param
   * @param params 
   * @param isReload
   */
  updateFetchParams(params: ITableFetchDataParam, isReload: boolean = false) {
    this.fetchParam = {...this.fetchParam, ...params};
    if (isReload) {
      this.reLoadData();
    }
  }


  /**
   * reload data
   */
  reLoadData() {
    this.loading = true;
    this.loaded = false;
    this.canLoadMore = true;
    this.fetchParam.after_token = null;
    if (this.fetchParam.page) {
      this.fetchParam.page = 1;
    }
    this.items = [];
    this.detectChanges();
    console.log('reload data');
    this.onLoadedData.emit(this.fetchParam);
  }

  /**
   * update items
   * @param items 
   * @param afterToken 
   */
  updateItems(items: any[], afterToken: string = '') {
    this.items = items;
    if (afterToken) {
      this.fetchParam.after_token = afterToken;
    }
    this.containerEl.nativeElement.scrollTop = 0;
    this.loaded = true;
    this.canLoadMore = true;
    this.loading = false;
    this.detectChanges();
  }

  /**
   * check if container has scroll height
   * @returns 
   */
  checkContainerHasScroll(): boolean {
    const scrollHeight = this.containerEl.nativeElement.scrollHeight;
    const clientHeight = this.containerEl.nativeElement.clientHeight;

    const offsetHeight = scrollHeight - clientHeight;
    // console.log('checkContainerHasScroll offsetHeight=',offsetHeight, ' scrollHeight=', scrollHeight, ' clientHeight=', clientHeight);
    return offsetHeight > 0 ? true : false;
  }

  /**
   * handle load data completed
   * @param isSuccess
   * @param items 
   * @param afterToken
   */
  handleLoadDataCompleted(isSuccess: boolean, items: any[], offset: number) {
    // console.log('handleLoadDataCompleted afterToken=', afterToken);
    this.loading = false;
    this.isLoadingMore = false;
    this.detectChanges();

    if (!isSuccess) { 
      return;
    }

    this.items = !this.loaded ? items : [...this.items, ...items];
    this.fetchParam['offset'] = offset;
    this.detectChanges();

    if (!this.loaded) {
      this.containerEl.nativeElement.scrollTop = 0;
      console.log('table reload data');
      setTimeout(() => {
        this.loaded = true;
        this.detectChanges();
      }, 150);
    }

    // this.canLoadMore = true;
    if (!items.length || items.length < 15 || (!this.fetchParam.page && !offset)) {
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
    // check auto load more
    setTimeout(() => {
      this.autoLoadMore();
    }, 500);
  }

  /**
   * update list item
   */
  updateListItem(ids: Array<string>, unCheckedList: boolean = false, isMoveAll: boolean = false){
    if(isMoveAll){
      this.items = [];
      this.detectChanges();
      return;
    }
    if(!unCheckedList){
      this.items = this.items.filter(item => !ids.includes(item.id));
      this.detectChanges();
      return;
    }
    this.items = this.items.filter(item => ids.includes(item.id));
    this.detectChanges();
  }

  /**
   * update category
   * @param cateId 
   */
  updateCategoryInList(checkedList: Array<string>, unCheckedList: Array<string>, cateId: string, isAll: boolean = false){
    if(isAll){
      this.items.map(item => {
        item.folderId = cateId;
        return item;
      });
      return;
    }
    if(checkedList.length){
      this.items.map(item => {
        if(checkedList.includes(item.id)){
          item.folderId = cateId;
        }
        return item;
      });
      return;
    }
    if(unCheckedList.length){
      this.items.map(item => {
        if(!unCheckedList.includes(item.id)){
          item.folderId = cateId;
        }
        return item;
      });
      return;
    }
    
  }

  /**
   * remove items
   * @param ids 
   */
  removeItems(ids: string[]) {
    this.items = this.items.filter(item => {
      return ids.includes(item[this.key]) ? false : true;
    });
    this.detectChanges();
  } 

  /**
   * add new item
   * @param item 
   * @param index
   */
  insertItem(item: any, index: number = 0) {
    this.items.splice(index,0, item);
    this.detectChanges();
  }

  /**
   * get list items
   * @returns 
   */
  getItems() {
    return this.items;
  }

  /**
   * auto load more
   */
  autoLoadMore() {
    console.log('autoLoadMore loaded=', this.loaded, ' canLoadMore=', this.canLoadMore, ' has scroll=',this.checkContainerHasScroll() );
    if (this.loaded && (!this.fetchParam.offset && !this.fetchParam.page)) {
      this.canLoadMore = false;
    }
    if (this.loaded && this.canLoadMore && !this.checkContainerHasScroll()) {
      this.loadMore();
    }
  }

  /**
   * load more
   */
  loadMore() {
    this.isLoadingMore = true;
    this.detectChanges();
    console.log('fetchParam=', this.fetchParam);
    this.onLoadedData.emit(this.fetchParam);
  }

  /**
   * handle on table scroll
   * @param event 
   */
  handleOnTableScroll(event: any) {
    if (!this.checkScrollToBottom()) {
      return;
    }
    console.log('this.loading=', this.loading, this.isLoadingMore, !this.loaded, !this.canLoadMore);
    if (this.loading || this.isLoadingMore ||  !this.loaded || !this.canLoadMore) {
      return;
    }
    console.log('handleOnTableScroll ')
    // load more
    this.loadMore();
  }

  /**
   * handle on window resize
   * @param event 
   */
  handleOnWindowResize = (event: any) => {
    // setTimeout(() => {
    //   this.autoLoadMore();
    // }, 100);
  }
}

export {
  ITableColumnSetting,
  ITableFetchDataParam 
}
