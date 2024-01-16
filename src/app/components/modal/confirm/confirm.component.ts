import {
	Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter, ViewRef
} from '@angular/core';

import { MoWbBaseComponent } from '../../base.component';

@Component({
	selector: 'mo-wb-components-modal-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss'],
})

export class MoWbModalConfirmComponent extends MoWbBaseComponent {

	zIndex: number = 5000;

  @Input() title: string = '';
  @Input() classInclude: string = '';
	@Input() isOpen: boolean = false;

	@Output() onClose = new EventEmitter<any>();
	@Output() onOk = new EventEmitter<any>();

  override onAfterInit(): void {
    this.isOpen = true;
    this.detectChanges();
  }

  /**
   * close modal
   */
  close() {
    this.isOpen = false;
    this.onClose.emit({});
    this.detectChanges();
  }

  /**
   * handle on Apply button click
   * @param event 
   */
  handleOnApplyButtonClick(event: MouseEvent) {
    this.onOk.emit({});
  }

  /**
   * handle on Cancel button click
   * @param event 
   */
  handleOnCancelButtonClick(event: MouseEvent) {
    this.close();
  }

  /**
   * handle on close modal click
   * @param event 
   */
  handleOnCloseClick(event: MouseEvent) {
    this.close();
  }
}

