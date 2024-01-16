import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../../../detection.component';
import { Utils } from 'src/app/utils/utils';
declare var $: any;
@Component({
  selector: 'mo-wb-components-select-toggle-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectTogglePopupComponent extends MoWbDetectionComponent {
  
  targetRect: DOMRect;

  @Input() templateContent: TemplateRef<any>;
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 2500;
  @Input() width: number = 184;
  @Input() height: number = 50;
  @Input() pos: 'center' | 'left' | 'right' = 'center';
  @Input() parentEl: HTMLElement;
  @Input() toggleRef: HTMLElement;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('popupEl') popupEl: ElementRef<HTMLElement>;

  constructor(
    public _toast: ToastTranslateService,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public override _changeDetection: ChangeDetectorRef
  ) {
    super(_changeDetection);
  }

  override ngAfterViewInit(): void {
    this.initEvents();
    this.updatePosition();
    this.isOpen = true;
    this.detectChanges();
  }

  override ngOnDestroy(): void {
    this.removeEvents();
  }

  /**
   * init events
   */
  initEvents() {
    $('div').on('scroll', this.handleOnWindowScroll);
    document.addEventListener('mousedown', this.handleOnDocClick);
    window.addEventListener('resize', this.handleOnWindowResize);
  }

  /**
   * remove events
   */
  removeEvents() {
    $('div').off('scroll', this.handleOnWindowScroll);
    document.removeEventListener('mousedown', this.handleOnDocClick);
    window.removeEventListener('resize', this.handleOnWindowResize);
  }

  /**
   * update position
   * @param forceUpdate
   */
  updatePosition(forceUpdate: boolean = true): boolean {
    const rect = this.toggleRef.getBoundingClientRect();
    if (!forceUpdate && !Utils.checkDifferentRect(rect, this.targetRect)) {
      return false;
    }
    this.targetRect = rect;
    this.top = rect.top + rect.height + 4;
    this.left = rect.left;

    // if (window.innerHeight - this.top < this.height) {
    //   this.top = rect.top - (this.height + 4); 
    // }

    return true;
  }
  
  /**
   * close popup
   */
  close() {
    this.onClose.emit({});
  }

  /**
   * get popup element
   * @returns popup element
   */
  getPopupEle() {
    return this.popupEl.nativeElement;
  }

  /**
   * handle on window scroll
   * @param event 
   */
  handleOnWindowScroll = (event: any) => {
    if (this.updatePosition(false)) {
      this.detectChanges();
    }
  }

  /**
   * handle on document click
   * @param event 
   */
  handleOnDocClick = (event: any) => {
    this.close();
  }

  /**
   * handle on window resize
   * @param event 
   */
  handleOnWindowResize = (event: any) => {
    if (this.updatePosition()) {
      this.detectChanges();
    }
  }

  /**
   * handle on popup mousedown
   * @param event 
   */
  handleOnPopupMousedown = (event: MouseEvent) => {
    event.stopPropagation();
  }
}