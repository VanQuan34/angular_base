import {
	Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter, ViewRef
} from '@angular/core';
import { MoWbModalComponent } from '../modal.component'; 
@Component({
	selector: 'mo-wb-components-modal-delete',
	templateUrl: './delete.component.html',
	styleUrls: ['./delete.component.scss'],
})

export class MoWbModalDeleteComponent implements OnInit {

	label: string = 'i18n_push_notification_popup_message';
	modalDeleteWidth: number = 598;
	modalDeleteHeight: number = 169;
	nameTypeDelete: string = '';
	zIndex: number = 5000;

	@Input() selectedIds!: Array<any>
	@Input() contentDeleteMsg!: string;

	@Output() onClose = new EventEmitter<any>();
	@Output() onDelete = new EventEmitter<any[]>();

	@ViewChild('modal') modal!: MoWbModalComponent;

	constructor(
		private changeDetection: ChangeDetectorRef,
	) { }

	ngOnInit() {
	}

  detectChanges() {
    if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed) {
      this.changeDetection.detectChanges();
    }
  }

	ngAfterViewInit() {
		this.showModalDelete();
		this.detectChanges();
	}

	public showModalDelete() {
		this.modal.open();
	}

	public hideModalDelete() {
		this.modal.hide();
	}

	close() {
		this.hideModalDelete();
		this.onClose.emit({});
	}

	handleOnCancelModalDelete() {
		this.close();
	}

	handleOnDeleteIcon() {
		this.onDelete.emit(this.selectedIds);
		this.close();
		this.detectChanges();
	}

	ngOnDestroy() {
	}
}

