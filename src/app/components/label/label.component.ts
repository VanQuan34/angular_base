import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { IMoWbLabel, IMoWbLabelTooltip, ILabelRight } from './api/ILabel';
import { ILabelButton } from './api/ILabelButton';
import { IToggleEvent } from '../button/api/toggle-event';
// import { MoCommonTranslateService } from '../../service/common/common-translate.service';

@Component({
  selector: 'mo-wb-components-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class MoWbLabelComponent implements OnInit, OnChanges {
  @Input() label: IMoWbLabel;
  @Input() characters: number;
  @Input() text: string;
  @Input() tooltip: IMoWbLabelTooltip;
  @Input() iconClass: any;
  @Input() notRequired: boolean;
  @Input() limitLength: number;
  @Input() classInclude: string;
  @Input() classFontInclude: string;
  @Input() classLimitInclude: string;
  @Input() tooltipContent: string;
  @Input() description: string;
  @Input() enable: boolean;
  @Input() buttons: Array<ILabelButton> = new Array<ILabelButton>();
  @Input() classButtonInclude: string;
  @Input() classDescInclude: string;
  @Input() classToggleInclude: string;
  @Input() hasToggle: boolean;
  @Input() toggleActive: boolean;
  @Input() disableToggle: boolean;
  @Input() isUpperCase: boolean;
  @Input() configLabelRight: ILabelRight;
  @Input() countCharacters: boolean;

  @Output() onButtonClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() onButtonRight: EventEmitter<any> = new EventEmitter<any>();
  @Output() onToggleChange: EventEmitter<IToggleEvent> = new EventEmitter<IToggleEvent>();

  constructor() {
    this.enable = true;
    this.classButtonInclude = '';
    this.classDescInclude = '';
    this.configLabelRight = undefined;
  }

  ngOnInit() {
    this.classInclude = (this.label && this.label.classInclude) || this.classInclude || '';
    this.classLimitInclude = this.classLimitInclude || (this.label && this.label.classLimitInclude) || '';
    this.classFontInclude = (this.label && this.label.classFontInclude) || this.classFontInclude || 'mo-wb-font-head-4s';
    this.text = this.text || (this.label && this.label.text) || '';
    this.iconClass = this.iconClass || (this.label && this.label.iconClass) || '';
    this.notRequired = this.notRequired || (this.label && this.label.notRequired) || false;
    this.limitLength = this.limitLength || (this.label && this.label.limitLength);
    this.tooltip = this.tooltip || (this.label && this.label.tooltip);
    this.description = this.description || (this.label && this.label.description);
    this.classDescInclude = (this.label && this.label.classDescInclude) || this.classDescInclude || '';
    this.classToggleInclude = (this.label && this.label.classToggleInclude) || this.classToggleInclude || 'mo-wb-pt-4px mo-wb-pb-6px';
  }

  ngOnChanges(changes: any) {
    if (changes.label) {
      this.text = changes.label.currentValue.text;
    }
  }

  public setEnable(enable: boolean = true) {
    this.enable = enable;
  }

  public handleButtonClick(e: any, i: number) {
    this.onButtonClick.emit(i);
  }

  public handleButtonRight(e: any) {
    this.onButtonRight.emit(e);
  }

  public handleToggleChange($event: any) {
    this.onToggleChange.emit($event);
  }
}
