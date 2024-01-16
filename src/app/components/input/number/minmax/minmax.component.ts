import { Component, EventEmitter, Input, ChangeDetectionStrategy, Output, ElementRef } from '@angular/core';
import { MoWbDetectionComponent } from '../../../detection.component';
import { GLOBAL } from 'src/app/common/types/global/global';
import { IUnit } from 'src/app/common/types/landing/unit';
import { ZIndex } from 'src/app/common/types/global/zIndex';

@Component({
 selector: 'mo-wb-components-input_number-minmax',
 templateUrl: './minmax.component.html',
 styleUrls: ['./minmax.component.scss'],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbInputNumberMinmaxComponent extends MoWbDetectionComponent {

 @Input() width: number = 250;
 @Input() height: number = 200;
 @Input() zIndex: number = ZIndex.popup;
 @Input() classInclude: string;
 @Input() isShow: boolean = false;
 @Input() min: any;
 @Input() max: any;
 @Input() units:  IUnit[];

 
 @Output() onClose = new EventEmitter<any>();
 @Output() onSelectItem = new EventEmitter<any>();
 @Output() onChangeMinUnit = new EventEmitter<any>();
 @Output() onChangeMaxUnit = new EventEmitter<any>();
 @Output() onChangeMinValue = new EventEmitter<any>();
 @Output() onChangeMaxValue = new EventEmitter<any>();
 @Output() onChangeValue = new EventEmitter<any>();


 override ngOnInit() {
  console.log('min=', this.min);
 }

 override ngAfterViewInit() {
 }

 override ngOnDestroy() {
 }

 show(target: ElementRef) {
   const targetRect = target.nativeElement.getBoundingClientRect();
   this.top = targetRect.top - 20;
   this.left = targetRect.left - 20;
   this.isShow = true;
   this.detectChanges();
 }

 close() {
   this.isShow = false;
   this.detectChanges();
   setTimeout(() => {
     this.onClose.emit();
   }, 50);
 }

 changeValueByUnit(unit: string, value: any) {
  if (unit === 'auto' || unit === 'min-content' || unit === 'max-content' || unit === 'none') {
    value = '';
    return;
  }

  if (!value) {
    value = 0;
  }
 }

 /**
  * handle overlay click
  * @param event 
  */
 handleOnOverlayClick(event: any) {
   // this.close();
 }

 /**
  * handle on menu click
  * @param event 
  */
 handleOnMousedown(event: MouseEvent) {
  event.stopPropagation();
 }

 handleOnMinUnitChange(unitItem: IUnit) {
  // console.log('handleOnMinUnitChange unitItem=', unitItem);
  this.min.unit = unitItem.key;
  this.changeValueByUnit(unitItem.key, this.min.value);
  this.detectChanges();
 }

 handleOnMaxUnitChange(unitItem: IUnit) {
  this.max.unit = unitItem.key;
  this.changeValueByUnit(unitItem.key, this.max.value);
  this.detectChanges();
 }

 handleOnMinValueChange(value: number) {
  // console.log('handleOnMinValueChange value=', value);
  this.min.value = value;
  this.detectChanges();
 }

 handleOnMaxValueChange(value: number) {
  this.max.value = value;
  this.detectChanges();
 }

 handleOnCloseClick(event: MouseEvent) {
  this.close();
 }

 handleOnSave() {
  this.onChangeValue.emit({min: this.min, max: this.max});
  this.close();
 }
 

}
