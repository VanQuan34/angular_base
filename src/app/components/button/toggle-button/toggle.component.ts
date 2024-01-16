import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IToggleEvent } from '../api/toggle-event';
import { MoWbDetectionComponent } from '../../detection.component';

@Component({
  selector: 'mo-wb-components-button-toggle_button',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbToggleComponent extends MoWbDetectionComponent  {
  @Input() disable: boolean;
  @Input() active: boolean;

  @Output() onChangeToggle: EventEmitter<IToggleEvent> = new EventEmitter<IToggleEvent>();

  handleOnToggleClick(event: Event) {
    if (this.disable) {
      return;
    }
    this.setActiveToggle();
    this.onChangeToggle.emit({
      active: this.active,
      revert: () => {this.setActiveToggle();
      }
    });
    this.detectChanges();
  }

  private setActiveToggle() {
    this.active = this.active ? false : true;
  }
}
