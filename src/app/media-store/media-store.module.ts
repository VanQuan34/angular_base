import { MoWbInputModule } from './../components/input/input.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MoWbMediaStoreComponent } from './media-store.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../components/button/button.module';
import { MoWbModalModule } from '../components/modal/modal.module';
import { MoWbCheckboxModule } from '../components/checkbox/checkbox.module';
// import { MoWbDropDownModule } from '../components/dropdown/dropdown.module';
import { MoWbRadioModule } from '../components/radio/radio.module';
import { MoWbTooltipModule } from '../components/tooltip/tooltip.module';
import { MoWbSpinnerModule } from '../components/spinner/spinner.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
// import { MoWbMediaApiServiceModule } from '../api/media/mediaApi.module';

import { MoWbMediaStoreEditModalComponent } from './edit/media-store-edit.component';
import { MoWbMediaStoreModalComponent } from './store-modal/media-store-modal.component';
import { MoWbMediaStoreFileComponent } from './file/media-store-file.component';
import { MoWbMediaStoreMoveFileComponent } from './move-file/media-store-move-file.component';
import { MoWbMediaStoreDeleteNotiComponent } from './delete-file-noti/media-store-delete-file-noti.component';
import { MoWbMediaStoreFolderComponent } from './folder/media-store-folder.component';
import { MoWbMediaStoreFolderAddEditComponent } from './folder/add-edit/media-store-folder-add-edit.component';
import { MoWbMediaStoreUploadModalComponent } from './upload-modal/media-store-upload-modal.component';
import { MoWbMediaStoreDetailComponent } from './detail/media-store-detail.component';
import { MoWbMediaStoreEditAddNewFileComponent } from './edit/add-new/media-store-edit-add-new.component';
import { MoWbMediaStoreFolderDeleteNotiComponent } from './folder/delete-noti/media-store-folder-delete-noti.component';
import { MoWbMediaStoreLoaderComponent } from './loader/media-store-loader.component';
import { MoWbMediaStoreUploadComponent } from './upload/media-store-upload.component';

// services
// import { MoWbFolderApiService } from '../service/folderApiService';
// import { MoWbFileApiService } from '../service/fileApiService';
import { TranSlateI18nPipe } from '../pipe/pipeTraslateI18n';
import { MoWbPipeModule } from '../pipe/pipe.module';
// import { MoWbFolderApiService } from '../api/media/folderApiService';
// import { MoWbFileApiService } from '../api/media/fileApiService';
import { MoWbSelectModule } from '../components/select/select.module';
import { MoWbFileUploadV4Module } from '../components/upload/file-upload-v4/file-upload.module';
import { MoWbTableModule } from '../components/table/table.module';


@NgModule({
  imports: [
    MoWbModalModule,
    MoWbButtonModule,
    // MoWbDropDownModule,
    MoWbInputModule,
    MoWbTooltipModule,
    MoWbSpinnerModule,
    MoWbRadioModule,
    MoWbCheckboxModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    MoWbPipeModule,
    MoWbSelectModule,
    MoWbFileUploadV4Module,
    MoWbTableModule,
    // MoWbMediaApiServiceModule,
    // RouterModule.forChild(routes),
    // MoLibValidModule,
    // MoLibSearchModule,
    VirtualScrollerModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    MoWbMediaStoreComponent,
    MoWbMediaStoreModalComponent,
    MoWbMediaStoreEditModalComponent,
    MoWbMediaStoreEditModalComponent,
    MoWbMediaStoreFileComponent,
    MoWbMediaStoreMoveFileComponent,
    MoWbMediaStoreDeleteNotiComponent,
    MoWbMediaStoreFolderComponent,
    MoWbMediaStoreFolderAddEditComponent,
    MoWbMediaStoreUploadModalComponent,
    MoWbMediaStoreDetailComponent,
    MoWbMediaStoreEditAddNewFileComponent,
    MoWbMediaStoreFolderDeleteNotiComponent,
    MoWbMediaStoreLoaderComponent,
    MoWbMediaStoreUploadComponent,
    TranSlateI18nPipe,
  ],
  entryComponents: [
    MoWbMediaStoreModalComponent,
    MoWbMediaStoreEditModalComponent,
    MoWbMediaStoreMoveFileComponent,
    MoWbMediaStoreDeleteNotiComponent,
    MoWbMediaStoreFolderComponent,
    MoWbMediaStoreFolderAddEditComponent,
    MoWbMediaStoreUploadModalComponent,
    MoWbMediaStoreDetailComponent,
    MoWbMediaStoreEditAddNewFileComponent,
    MoWbMediaStoreFolderDeleteNotiComponent,
  ],
  providers: [
    // MoWbFolderApiService,
    // MoWbFileApiService,
    TranSlateI18nPipe

  ],
  exports: [
    MoWbMediaStoreComponent,
    MoWbMediaStoreModalComponent,
    MoWbMediaStoreEditModalComponent,
    MoWbMediaStoreUploadComponent,

  ],
})
export class MoMediaStoreModule { }
