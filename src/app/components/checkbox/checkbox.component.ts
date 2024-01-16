import { ChangeDetectionStrategy, Component, 
  EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITooltip } from '../tooltip/api/tooltip';
import { ICheckbox } from './api/checkbox';
import { MoWbDetectionComponent } from '../detection.component';

@Component({
  selector: 'mo-wb-components-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbCheckBoxComponent extends MoWbDetectionComponent {

  @Input() state: 'selected' | 'inactive' | 'unselected' = 'unselected';
  @Input() type: 'red' | 'pri' = 'pri';
  @Input() checked: boolean;
  @Input() key: any;
  @Input() label: string;
  @Input() disable: boolean;
  @Input() readonly: boolean;
  @Input() tooltip: ITooltip;
  @Input() classLabelInclude: string = '';
  @Input() classInclude: string = '';
  @Input() hasTooltip: boolean = true;
  @Input() avatar: string;
  @Input() classAvatarInclude: string;
  @Input() bullet: any;
  @Input() clickExactly: boolean;
  @Input() showBorderRed: boolean;
  @Input() helpText: string = '';
  @Input() disableEventChange: boolean = false;

  @Output() onChangeChecked = new EventEmitter<ICheckbox>();
  @Output() onAvatarLoadError = new EventEmitter<any>();
  @Output() onCheckedChange = new EventEmitter<boolean>();

  public changeChecked() {
    if (this.readonly || this.disable) {
      return;
    }
    this.checked = (this.checked) ? false : true;
    this.onChangeChecked.emit({ checked: this.checked, key: this.key });
  }

  public setChecked(checked: boolean) {
    this.checked = checked;
  }

  public setState(state: 'selected' | 'unselected' | 'inactive') {
    this.state = state;
    this.detectChanges();
  }

  public isChecked() {
    return this.checked;
  }

  public getKey() {
    return this.key;
  }

  handlerAvatarError() {
    this.onAvatarLoadError.emit({});
  }

  public handleOnClick(e: MouseEvent) {
    this.changeChecked();
  }

  /**
   * handle on checkbox click
   * @param e 
   */
  handleOnCheckboxClick(e: MouseEvent) {
    if(this.disableEventChange){
      return;
    }
    if (this.state === 'inactive' || this.disable) {
      return;
    }
    this.state = this.state === 'selected' ? 'unselected' : 'selected';
    this.detectChanges();
    this.onCheckedChange.emit(this.state === 'selected' ? true : false);
  }

}
