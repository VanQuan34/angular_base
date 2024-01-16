import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbUploadFileComponent } from './font-upload-file.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbUploadFileComponent
  ],
  declarations: [
    MoWbUploadFileComponent
  ],
  providers: [
  ]
})
export class MoWbUploadFontModule {

}
