import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../detection.component';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';

@Component({
  selector: 'mo-wb-components-test-modal-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbTestModalTest1Component extends MoWbV4ModalComponent {
  
  /**
   * handle on after view init
   */
  override ngAfterViewInit(): void {
  }

}
