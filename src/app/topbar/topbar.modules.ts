import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbComponentsModule } from 'src/app/components/components.module';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { FileManagerTopbarComponents } from './topbar.component';

@NgModule({
    imports: [
      CommonModule,
      MoWbComponentsModule,
      TranslateModule.forChild({}),
    ],
    declarations: [
        FileManagerTopbarComponents
    ],
    exports: [
        FileManagerTopbarComponents
    ],
    providers: [
        ToastTranslateService
    ]
  })
  export class MoWbFileManagerTopbarModule { }
  