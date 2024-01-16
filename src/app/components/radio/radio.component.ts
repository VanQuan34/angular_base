import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITooltip } from '../tooltip/api/tooltip';
import { MoWbDetectionComponent } from '../detection.component';

@Component({
  selector: 'mo-wb-components-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbRadioComponent extends MoWbDetectionComponent {
  
  @Input() isSelected: boolean;
  @Input() helpText: string = '';
  @Input() active: boolean;
  @Input() key: any;
  @Input() label: string;
  @Input() groups: MoWbRadioComponent[];
  @Input() tooltip: ITooltip;
  @Input() disable: boolean;
  @Input() readonly: boolean;
  @Input() hasTooltip: boolean;
  @Input() classLabelInclude: string;
  @Input() classInclude: string;
  @Input() clickExactly: boolean;
  @Input() disableText: boolean;
  @Input() classRadio: string; 
  @Input() classIncludeRadio: string;


  @Output() onActiveChanged = new EventEmitter<any>();
  @Output() onSelectedChange = new EventEmitter<any>();

  public handleOnClick(e: Event, clickElementContainer: boolean) {
    e.stopPropagation();
    if (clickElementContainer && this.clickExactly) {
      return;
    }
    this.changeActive();
  }

  public changeActive() {
    if (this.active || this.readonly || this.disable) {
      return;
    }
    this.setActive(true);
    this.onActiveChanged.emit({ active: this.active, key: this.key });
  }

  public setActive(active: boolean) {
    if (active) {
      if (this.groups) {
        this.groups.forEach((item) => {
          item.setActive(false);
        });
      }
    }
    this.active = active;
  }

  public isChecked() {
    return this.active;
  }

  public getKey() {
    return this.key;
  }

  /**
   * handle on select radio
   * @param e 
   */
  handleOnRadioClick(e: MouseEvent) {
    if (this.isSelected) {
      return;
    }

    this.isSelected = !this.isSelected;
    this.detectChanges();

    this.onSelectedChange.emit(this.isSelected);
    // this.onSelectedChange.emit({isActive: this.isSelected, key: this.key});
  }

}
