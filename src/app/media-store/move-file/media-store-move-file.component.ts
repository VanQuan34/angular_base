import { Component, OnInit, EventEmitter, ViewChild,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component'; 
// import { DefineConstants } from 'src/app/common/define/constants.define';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { MoWbFileApiService } from 'src/app/api/media/fileApiService';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';

@Component({
  selector: 'mo-wb-media_store_move_file',
  templateUrl: './media-store-move-file.component.html',
  styleUrls: ['./media-store-move-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreMoveFileComponent implements OnInit {
  
  loading: boolean;
  toFolderId: string; 

  @Input() fileUrls: string[] = [];
  @Input() folderId: string = null;
  @Input() folderListItems: any[] = [];
  @Input() zIndex: number = 2500;

  @Output() onClose = new EventEmitter<any>();
  @Output() onMove = new EventEmitter<any>();
  
  @ViewChild('modal') modalRef: MoWbV4ModalComponent;

  constructor(
    // private _fileApiService: MoWbFileApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.initData();
    }, 0);
  }

  ngAfterViewInit() { 
    this.showModal();
  }

  initData() {
    this.folderListItems = this.folderListItems.filter((item: any) => {
      if (item.id === this.folderId) {
        return false;
      }
      return true;
    });

    // console.log('folderListItems=', this.folderListItems, ' fileUrls=', this.fileUrls);
  }

  public showModal() {
    this.modalRef.show();
    this.changeDetection.detectChanges();
  }

  handlerClickButtonClose(){
    this.modalRef.close();
    this.changeDetection.detectChanges();
    this.onClose.emit({});}

  public hideModal() {
    this.modalRef.close();
  }

  handleOnSelectFolder(selectedItems: any) {
    this.toFolderId = selectedItems.id;
    // console.log(selectedItems.id);
  }
  
  handleOnCancelModal() {
    this.hideModal();
    this.onClose.emit({});
  }

  handleOnSaveClick() {
    this.moveFiles();
  }

  handleOnCloseModal() {
    this.onClose.emit({});
  }

  async moveFiles() {
    this.loading = true;
    this.changeDetection.detectChanges();
    // const response = await this._fileApiService.moveFiles(this.folderId, this.toFolderId, this.fileUrls);
    // this.loading = false;
    // this.changeDetection.detectChanges();
    
    // if (response && response.code === 200) { 
    //   this.onMove.emit({});
    //   this._toast.show(
    //     'success','i18n_notification_manipulation_success' //`Đã chuyển file thành công.`
    //   );
    //   this.hideModal();
    // }
    
  }
}
