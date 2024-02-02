import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbComponentsModule } from 'src/app/components/components.module';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { FileManagerAuthApiServiceModule } from '../api/auth/authApi.module';
import { MoWbCheckboxModule } from "../components/checkbox/checkbox.module";
import { MoWbTooltipModule } from "../components/tooltip/tooltip.module";
import { ColorSketchModule } from 'ngx-color/sketch';
import { FileManagerFilesApiServiceModule } from '../api/files/filesApi.module';
import { MoWbManagerComponent } from './manager.component';
import { MoWbManagerNoteComponent } from './note/note.component';
import { MoWbManagerNoteModule } from './note/note.modules';
import { MoMediaStoreModule } from '../media-store/media-store.module';

@NgModule({
    declarations: [
        MoWbManagerComponent,
    ],
    exports: [
        MoWbManagerComponent,
    ],
    providers: [
        ToastTranslateService
    ],
    imports: [
        CommonModule,
        MoWbComponentsModule,
        MoWbManagerNoteModule,
        TranslateModule.forChild({}),
        // FileManagerSettingsAccountPipeModule,
        FileManagerAuthApiServiceModule,
        FileManagerFilesApiServiceModule,
        MoWbCheckboxModule,
        MoWbTooltipModule,
        ColorSketchModule,
        MoMediaStoreModule
    ]
})
  export class MoWbManagerModule { }
  