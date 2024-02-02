import { Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver, Injector,
  Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { MoWbModalComponent } from 'src/app/components/modal/modal.component';
// import { AddComponentToBodyService } from 'lib/src/app/service/common/add-component-to-body.service';
// import { MoWbFolderApiService } from 'src/app/service/folderApiService';
// import { MoLibValidComponent } from 'lib/src/app/components/input/valid/valid.component';
// import { MoWbDropdownComponent } from 'src/app/components';
// import { ToastTranslateService } from 'src/app/service/common/toast-translate.service';
// import { MoWbFolderApiService } from 'src/app/api/media/folderApiService';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { MoWbSelectComponent } from 'src/app/components/select/select.component';
// import { DefineConstants } from 'lib/src/app/common/define/constants.define';

@Component({
  selector: 'mo-wb-media_edit_add_new',
  templateUrl: './media-store-edit-add-new.component.html',
  styleUrls: ['./media-store-edit-add-new.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbMediaStoreEditAddNewFileComponent extends MoWbV4ModalComponent {
  
  loading: boolean;
  name: string;
  
  @Input() folderId: string = null;
  @Input() folderListItems: any[] = [];
  @Input() override level: number = 2;
  
  @Output() onSelectFolder = new EventEmitter<any>();
  
  @ViewChild('folder') folderRef: MoWbSelectComponent;


  constructor(
    // private _folderApiService: MoWbFolderApiService,
    private changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
  ) {
    super(_changeDetection);
  }

  override ngAfterViewInit() { 
    super.ngAfterViewInit();
    // setTimeout(() => {
    //   this.fetchFolderList();
    // }, 0);
  }

  async fetchFolderList() {
    this.loading = true;
    this.changeDetection.detectChanges();
    // const response = await this._folderApiService.getFolderList();
    // this.folderListItems = [];
    // this.folderListItems.splice(0,0, {
    //   id : null,
    //   name: 'i18n_default',
    //   count: response.count_default
    // });

    // for (let i = 0; i < response.list.length; i++) {
    //   this.folderListItems.push(response.list[i]);
    // }
    this.loading = false;
    this.changeDetection.detectChanges();
  }

  handleOnInitData() {
    this.fetchFolderList();
  }

  handleOnSelectFolders(items: any[]) {
    this.folderId = items[0].id;
    this.detectChanges();
  }

  handleOnSaveClick(event: any) {
    // event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    if (this.folderId === null || this.folderId) {
      this.close();
      this.onSelectFolder.emit(this.folderId);
      return;
    }
  }


  validate() {
    let result: boolean = true;
    if (!this.folderRef.validate()) {
      result = false;
    }

    return result;
  }
}
