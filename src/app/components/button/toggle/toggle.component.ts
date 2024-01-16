import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MoWbDetectionComponent } from '../../detection.component';

@Component({
  selector: 'mo-wb-components-button-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbButtonToggleComponent extends MoWbDetectionComponent {

  @Input() label: string | undefined;
  @Input() classInclude: string = '';
  @Input() state: 'ON' | 'OFF' = 'ON';
  @Input() textOn: string = 'ON';
  @Input() textOff: string = 'OFF';
  @Input() width: number | undefined;
  @Input() enable: boolean = true;

  @Output() onSelectedChange = new EventEmitter<any>();


  setState(state: 'ON' | 'OFF') {
    this.state = state;
    this.detectChanges();
  }

  handleOnButtonClick(event: any, state: 'ON' | 'OFF') {
    if (!this.enable) {
      return;
    }
    this.state = state;
    this.detectChanges();
    this.onSelectedChange.emit(state);
  }
}
