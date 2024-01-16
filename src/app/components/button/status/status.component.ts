import { Component, Input } from '@angular/core';
import { IButtonStatus } from '../api/button-status';

@Component({
  selector: 'mo-wb-components-button-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class MoButtonStatusComponent {
  @Input() config: IButtonStatus;

  constructor() {
    this.config = {
      type: 'success',
      label: 'Thành công',
      class: 'mo-mt-16px'
    };
  }
}
