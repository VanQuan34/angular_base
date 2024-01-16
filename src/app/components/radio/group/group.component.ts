import {
  Component, EventEmitter, Input, Output, QueryList, ViewChildren, AfterViewInit
} from '@angular/core';

import { MoWbRadioComponent } from '../radio.component';
import { IRadioItem } from '../api/radio';

@Component({
  selector: 'mo-wb-components-radio-group',
  templateUrl: 'group.component.html',
  styleUrls: ['./group.component.scss']
})
export class MoWbRadioGroupComponent implements AfterViewInit {

  @Input() items: Array<IRadioItem> = new Array<IRadioItem>();
  @Input() showTextBottom: boolean;
  @Input() classTextBottomInclude: string;
  @Input() classLabelInclude: string;
  @Input() horizontal: boolean;
  @Input() disable: boolean;
  @Input() classPaddingBottom: string;
  @Input() classPaddingRight: string;
  @Input() clickExactly: boolean;
  @Input() classRadio: string;

  // @Output() onActiveChanged = new EventEmitter<any>();
  @Output() onSelectedChange = new EventEmitter<any>();
  @ViewChildren('radioItem') radioItems: QueryList<MoWbRadioComponent>;

  constructor() {
    this.classLabelInclude = '';
    this.classPaddingRight = 'mo-wb-pr-22px';
    this.classPaddingBottom = 'mo-wb-pb-4px';
    this.clickExactly = true;
  }

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (!this.radioItems) {
      return;
    }
    const radioItems = this.radioItems.toArray();
    radioItems.forEach((item) => {
      item.groups = radioItems;
    });
  }

  // public handleItemActiveChanged(event: any) {
  //   this.onActiveChanged.emit(event);
  // }

  public handleItemSelectedChanged(event: any, index: number) {
    this.items.forEach((radio,i) => {
      radio.active = false;
      if (index === i) {
        radio.active = true;
      }
    })
    this.onSelectedChange.emit(this.items[index]);
  }
}
