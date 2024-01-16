import {
  Component, Input, EventEmitter, SimpleChanges, ChangeDetectionStrategy, Output, ViewChild, ElementRef,
} from '@angular/core';
import { MoWbBaseComponent } from '../base.component';
// import { settings } from 'cluster';

interface IMenuListItem {
  id?: string,
  name?: string,
  icon?: string,
  isRemove?: boolean,
  isDivider?: boolean
}
@Component({
  selector: 'mo-wb-components-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMenuComponent extends MoWbBaseComponent {
  
  menuToggleEl: HTMLElement;
  @Input() classInclude: string = '';
  @Input() fixedShow: boolean = true;
  @Input() isShow: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() itemHeight: number = 34;
  @Input() parentEl: HTMLElement;
  @Input() items: IMenuListItem[];
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Input() pos: 'top' | 'left' | 'right' | 'bottom' = 'right';
  @Input() isActionMenu: boolean;
  @Input() icon: string;

  @Output() onClickToggle = new EventEmitter<any>();
  @Output() onSelectItem = new EventEmitter<IMenuListItem>();

  @ViewChild('menuPopup') menuPopupRef: ElementRef;

  override ngAfterViewInit() {
    if (this.parentEl) {
      this.parentEl.addEventListener('mouseover', this.handleOnParentMouseover);
      this.parentEl.addEventListener('mouseout', this.handleOnParentMouseout);
    }
    //window.addEventListener('scroll', this.handleOnWindowScroll);
    this.calcHeight();
  }

  override ngOnDestroy() {
    if (this.parentEl) {
      this.parentEl.removeEventListener('mouseover', this.handleOnParentMouseover);
      this.parentEl.removeEventListener('mouseout', this.handleOnParentMouseout);
    }
   // window.addEventListener('scroll', this.handleOnWindowScroll);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['items']) {
      this.calcHeight();
    }
  }

  /**
   * calculate menu height
   */
  calcHeight() {
    if (!this.items || !this.items.length) {
      return;
    }
    let height = 0;
    this.items.forEach(item => {
      if (item.isDivider) {
        height += 1;
      } else {
        height += this.itemHeight;
      }
    });

    this.height = height + 8;
  }

  /**
   * set menu position
   * @param menuToggleEl 
   */
  setMenuPosition() {
    const menuRect = this.menuPopupRef && this.menuPopupRef.nativeElement && this.menuPopupRef.nativeElement.getBoundingClientRect();
    const rect = this.menuToggleEl.getBoundingClientRect();
    const height = menuRect ? menuRect.height : this.height;
    this.top = rect.top + rect.height + 4;
    this.top = Math.min(this.top,  window.innerHeight - height - 30);
    if (this.pos === 'left') {
      this.left = rect.left;
      this.detectChanges();
      return;
    }
    if (this.pos === 'right') {
      this.left = rect.left + rect.width - this.width;
      this.detectChanges();
      return;
    }
    
  }

  /**
   * handle on parent mouseover
   * @param e 
   */
  handleOnParentMouseover = (e: MouseEvent) => {
    e.stopPropagation();
    this.isShow = true;
    this.detectChanges();
  }

  /**
   * handle on parent mouseout
   * @param event 
   * @returns 
   */
  handleOnParentMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }
    if (!this.isOpen) {
      // hide menu
      this.isShow = false;
      this.detectChanges();
    }
    return true;
  }

  /**
   * handle menu toggle click
   * @param event 
   */
  handleOnMenuToggleClick(event: MouseEvent, menuToggleEl: HTMLElement) {
    event.stopPropagation();
    this.onClickToggle.emit(menuToggleEl);
    this.menuToggleEl = menuToggleEl;
    this.isOpen =!this.isOpen;
    if (this.isOpen) {
      this.setMenuPosition();
    }
    this.detectChanges();
    
  }

  /**
   * handle on item click
   * @param event 
   * @param item 
   */
  handleOnItemClick(event: MouseEvent, item: IMenuListItem) {
    event.stopPropagation();
    this.onSelectItem.emit(item);
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    event.stopPropagation();
    this.isOpen = false;
    this.detectChanges();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }

}

export {
  IMenuListItem
}
