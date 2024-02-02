import { Component, OnInit, EventEmitter, ViewChild,
  Output, Input, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';

@Component({
  selector: 'mo-wb-media_store_delete_file_noti',
  templateUrl: './media-store-delete-file-noti.component.html',
  styleUrls: ['./media-store-delete-file-noti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreDeleteNotiComponent implements OnInit {

  @Input() deleteFiles: any[] = [];
  @Input() zIndex: number = 2500;
  
  @Output() onClose = new EventEmitter<any>();
  @Output() onOk = new EventEmitter<any>();

  @ViewChild('modal') modalRef: MoWbV4ModalComponent;

  constructor(
    private changeDetection: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.changeDetection.detectChanges()
  }

  ngAfterViewInit() { 
    this.showModal();
    this.changeDetection.detectChanges();
   }

  handlerClickButtonClose(){
    this.modalRef.close();
    this.changeDetection.detectChanges();
    this.onClose.emit({});
  }
  
  public showModal() {
    this.modalRef?.show();
  }

  public hideModal() {
    this.modalRef.close();
  }
  
  handleOnCancelModal() {
    this.hideModal();
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  handleOnOkClick() {
    this.hideModal();
    this.onOk.emit({});
  }

}
