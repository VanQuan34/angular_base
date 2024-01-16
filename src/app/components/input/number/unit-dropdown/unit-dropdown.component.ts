import { Component, EventEmitter, Input, ChangeDetectionStrategy, Output } from '@angular/core';
import { MoWbDetectionComponent } from '../../../detection.component';
import { IUnit } from 'src/app/common/types/landing/unit';
import { ZIndex } from 'src/app/common/types/global/zIndex';

@Component({
  selector: 'mo-wb-components-input_number-unit_dropdown',
  templateUrl: './unit-dropdown.component.html',
  styleUrls: ['./unit-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberUnitDropdownComponent extends MoWbDetectionComponent {

  @Input() width: number = 230;
  @Input() height: number = 200;
  @Input() zIndex: number = ZIndex.popup;
  @Input() classInclude: string;
  @Input() units: any[] = [];
  @Input() isShow: boolean = false;
  @Input() selectedKey: string = '';

  
  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectItem = new EventEmitter<any>();

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {
  }

  show(target: HTMLElement) {
    const targetRect = target.getBoundingClientRect();
    // console.log('show targetRect=', targetRect);
    this.height = this.getHeight();
    this.top = Math.min(window.innerHeight - this.height - 10, targetRect.top + targetRect.height + 4) ;
    this.left = targetRect.left + targetRect.width - this.width;
    this.isShow = true;
    this.detectChanges();
  }

  getHeight() {
    let height = 0;
    this.units.forEach(unit => {
      height += 34;
    });

    height += 8;
    return height;
  }

  close() {
    this.isShow = false;
    this.detectChanges();
    setTimeout(() => {
      this.onClose.emit();
    }, 50);
  }

  /**
   * handle overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    this.close();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }

  /**
   * handle unit item select
   * @param e 
   * @param item 
   */
  handleOnUnitItemSelect(e: any, item: IUnit) {
    e.stopPropagation();
    if (item.key === this.selectedKey) {
      return;
    }
    this.onSelectItem.emit(item);
    this.close();
  }

}
