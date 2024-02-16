import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbComponentsModule } from 'src/app/components/components.module';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { ColorSketchModule } from 'ngx-color/sketch';
import { MoWbManagerNoteComponent } from './note.component';
import { FileManagerAuthApiServiceModule } from 'src/app/api/auth/authApi.module';
import { MoWbCheckboxModule } from 'src/app/components/checkbox/checkbox.module';
import { MoWbTooltipModule } from 'src/app/components/tooltip/tooltip.module';
import { MoWbManagerNoteTopbarComponent } from './topbar/topbar.component';
import { MoWbManagerNoteToolbarComponent } from './toolbar/toolbar.component';
import { MoWbManagerNoteCategoryComponent } from './category/category.component';
import { ManagerNoteApiServiceModule } from 'src/app/api/note/noteApi.module';
import { MoWbManagerNoteCategoryAddComponent } from './category/add/add.component';
import { MoWbManagerNoteListComponent } from './list/list.component';
import { MoWbManagerNoteCategoryEditComponent } from './category/edit/edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { MoWbManagerNoteEditorComponent } from './editor/editor.component';
import { MoWbManagerNoteListEditComponent } from './list/edit/edit.component';
import { MoWbManagerNoteListPipeModule } from './list/list.pipe';
import { MoWbManagerNoteListDuplicateComponent } from './list/duplicate/duplicate.component';
import { MoWbManagerNoteListAddComponent } from './list/add/add.component';
import { MoWbManagerNoteListPreviewComponent } from './list/preview/preview.component';
@NgModule({
    declarations: [
        MoWbManagerNoteComponent,
        MoWbManagerNoteTopbarComponent,
        MoWbManagerNoteToolbarComponent,
        MoWbManagerNoteCategoryComponent,
        MoWbManagerNoteCategoryAddComponent,
        MoWbManagerNoteListComponent,
        MoWbManagerNoteCategoryEditComponent,
        MoWbManagerNoteEditorComponent,
        MoWbManagerNoteListEditComponent,
        MoWbManagerNoteListDuplicateComponent,
        MoWbManagerNoteListAddComponent,
        MoWbManagerNoteListPreviewComponent,
    ],
    exports: [
        MoWbManagerNoteComponent,
        MoWbManagerNoteTopbarComponent,
        MoWbManagerNoteToolbarComponent,
        MoWbManagerNoteCategoryComponent,
        MoWbManagerNoteCategoryAddComponent,
        MoWbManagerNoteListComponent,
        MoWbManagerNoteCategoryEditComponent,
        MoWbManagerNoteEditorComponent,
        MoWbManagerNoteListEditComponent,
        MoWbManagerNoteListDuplicateComponent,
        MoWbManagerNoteListAddComponent,
        MoWbManagerNoteListPreviewComponent
    ],
    providers: [
        ToastTranslateService
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoWbComponentsModule,
        ManagerNoteApiServiceModule,
        TranslateModule.forChild({}),
        // FileManagerSettingsAccountPipeModule,
        FileManagerAuthApiServiceModule,
        MoWbCheckboxModule,
        MoWbTooltipModule,
        ColorSketchModule,
        EditorModule,
        MoWbManagerNoteListPipeModule
    ]
})
  export class MoWbManagerNoteModule { }
  