import { Component, ViewChild, Input, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
// import { MoWbFolderApiService } from 'src/app/api/media/folderApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';


@Component({
  selector: 'mo-wb-media_store_folder_add_edit',
  templateUrl: './media-store-folder-add-edit.component.html',
  styleUrls: ['./media-store-folder-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreFolderAddEditComponent extends MoWbV4ModalComponent {
  
  loading: boolean;

  @Input() name: string = '';
  @Input() folderId: string;

  // @Output() onClose = new EventEmitter<any>();
  // @Output() onOk = new EventEmitter<any>();
  // @ViewChild('input') inputRef: MoLibValidComponent;
  @ViewChild('input') inputRef: MoWbInputComponent;
  
  constructor(
    // private _folderApiService: MoWbFolderApiService,
    private _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
  ) {
    super(_changeDetection);
  }

  validate() {
    const isValid = this.inputRef.validate();
    if (!isValid) {
      return false;
    }
    return true;
  }

  async addNewFolder() { 
    this.loading = true;
    this.detectChanges();
    // const response = await this._folderApiService.addNewFolder(this.name);
    // this.loading = false;
    // this.detectChanges();

    // if (!response || response.code !== 200) {
    //   this._toast.show('error',response && response.message);
    //   return;
    // }

    // this.onOk.emit(this.name);
    // this.close();
    // this._toast.show('success','i18n_notification_manipulation_success');
  }

  async editFolder() {
    this.loading = true;
    this.detectChanges();

    // const response = await this._folderApiService.editFolder(this.name, this.folderId);
    // this.loading = false;
    // this.detectChanges();

    // if (!response || response.code !== 200) {
    //   this._toast.show('error',response && response.message);
    //   return;
    // }

    // this.onOk.emit(response.data);
    // this.close();
    // this._toast.show('success','i18n_notification_manipulation_success');
  }

  handleOnNameChanged(nameValue: string) {
    this.name = nameValue;
    this.detectChanges();
  }

  handleOnSaveClick() {
    if (!this.validate()) { 
      return;
    }

    if (!this.folderId) {
      this.addNewFolder();
    } else {
      this.editFolder();
    }
    
  }
}
