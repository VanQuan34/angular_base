import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, 
  ElementRef, Injector, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../../../detection.component';
import { ZIndex } from 'src/app/common/types/global/zIndex';

interface IMenuSelectItem {
  id: any;
  icon?: string;
  name: string;
  divider?: boolean;
  disable?: boolean; 
}

@Component({
  selector: 'mo-wb-components-select-menu-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectMenuPopupComponent extends MoWbDetectionComponent {
  
  height: number = 0;

  @Input() menuIcon: string = 'mo-icn-more-horizontal';
  @Input() items: IMenuSelectItem[] = [];
  @Input() templateItem: TemplateRef<any>;
  @Input() classInclude: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 2500;
  @Input() width: number = 184;
  @Input() itemHeight: number = 38;
  @Input() pos: 'center' | 'left' | 'right' = 'center';
  @Input() parentEl: HTMLElement;
  @Input() menuRef: HTMLElement;

  @Output() onSelectItem: EventEmitter<IMenuSelectItem> = new EventEmitter<IMenuSelectItem>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCloseMenu: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('popupEl') popupEl: ElementRef<HTMLElement>;

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
    this.zIndex = ZIndex.popup;
  }

  override ngAfterViewInit(): void {
    this.setPosition();
    this.isOpen = true;
    this.detectChanges();
  }

  /**
   * set position
   */
  setPosition() {
    const rect = this.menuRef.getBoundingClientRect();
    this.top = rect.top + rect.height + 2;
    this.left = rect.left + rect.width / 2 - this.width / 2; 
    this.height = this.items.length * this.itemHeight;

    if (window.innerHeight - this.top < this.height) {
      this.top = rect.top - (this.height + 4); 
    }

    if (window.innerWidth - this.left < this.width + 20) {
      this.left = window.innerWidth - this.width - 20;
    }
  }
  
  /**
   * close popup
   * @param isCloseMenu
   */
  close(isCloseMenu: boolean = false) {
    this.onClose.emit({isCloseMenu: isCloseMenu});
  }

  /**
   * get popup element
   * @returns popup element
   */
  getPopupEle() {
    return this.popupEl.nativeElement;
  }

  /**
   * handle on menu item click
   * @param item 
   */
  handleOnMenuItemClick(item: IMenuSelectItem) {
    this.onSelectItem.emit(item);
    this.isOpen = false;
    this.detectChanges();

    this.close();
  }

  /**
   * handle on mouseout
   * @param event 
   * @returns 
   */
  handleOnMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    const popupEl = this.popupEl.nativeElement;
    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl
          || e.parentNode === popupEl || e === popupEl) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }
    // hide menu
    this.close(true);
    this.detectChanges();
    return true;
  }

}

export { 
  IMenuSelectItem
}
