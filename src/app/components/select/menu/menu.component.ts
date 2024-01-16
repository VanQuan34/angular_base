import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, 
  ElementRef, Injector, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../../detection.component';
import { MoWbSelectMenuPopupComponent } from './popup/popup.component';

interface IMenuSelectItem {
  id: any;
  icon?: string;
  name: string;
  divider?: boolean;
}

@Component({
  selector: 'mo-wb-components-select-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectMenuComponent extends MoWbDetectionComponent {

  popupRef: ComponentRef<MoWbSelectMenuPopupComponent>;
  selectedItems: any[] = [];
  
  height: number = 0;
  isShow: boolean = false;
  
  @Input() isFixShow: boolean = false;
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

  @Output() onSelectItem: EventEmitter<IMenuSelectItem> = new EventEmitter<IMenuSelectItem>();
  @Output() onClick = new EventEmitter<any>;

  @ViewChild('selectMenu') selectRef: ElementRef<HTMLElement>;

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
    if (this.parentEl) {
      this.parentEl.addEventListener('mouseout', this.handleOnParentMouseout);
      this.parentEl.addEventListener('mouseover', this.handleOnParentMouseover);
    }
  }

  override ngOnDestroy(): void {
    if (this.parentEl) {
      this.parentEl.addEventListener('mouseout', this.handleOnParentMouseout);
      this.parentEl.addEventListener('mouseover', this.handleOnParentMouseover);
    }
  }

  /**
   * open popup menu
   */
  openMenuPopup() {
    this.popupRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbSelectMenuPopupComponent).create(this._injector);
    this.popupRef.instance.zIndex = this.zIndex + 50;
    this.popupRef.instance.menuRef = this.selectRef.nativeElement;
    this.popupRef.instance.items = this.items;
    this.popupRef.instance.width = this.width;
    this.popupRef.instance.parentEl = this.parentEl;

    this.popupRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(this.popupRef);
      this.popupRef = null;
      this.isShow = false;
      if (event && event.isCloseMenu) {
        this.isOpen = false;
      }
      this.detectChanges();
    });
    
    this.popupRef.instance.onSelectItem.subscribe((item: any) => {
      this.onSelectItem.emit(item);
      this.isOpen = false;
      this.detectChanges();
    });
    

    this._domService.addDomToBody(this.popupRef);
  }

  /**
   * handle on button toggle
   * @param event 
   */
  handleOnButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.isShow = !this.isShow;
    this.onClick.emit();
    if (this.isShow) {
      this.openMenuPopup();
      return;
    }
    this.popupRef && this.popupRef.instance.close();
  }

  /**
   * handle on menu item click
   * @param item 
   */
  handleOnMenuItemClick(item: IMenuSelectItem) {
    this.onSelectItem.emit(item);
    this.popupRef && this.popupRef.instance.close();
    this.detectChanges();
  }

  /**
   * handle on parent mouseout
   * @param event 
   * @returns 
   */
  handleOnParentMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    const popupEl = this.popupRef && this.popupRef.instance.getPopupEle();

    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl 
          || (e.parentNode == popupEl || e == popupEl) ) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }
    // hide menu
    this.isOpen = false;
    if (this.popupRef) {
      this.popupRef.instance.close();
    }
    this.detectChanges();
    return true;
  }

  /**
   * handle on parent mouseover
   * @param e 
   */
  handleOnParentMouseover = (e: MouseEvent) => {
    e.stopPropagation();
    this.isOpen = true;
    this.detectChanges();
  }

}

export { 
  IMenuSelectItem
}
