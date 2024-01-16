import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbUploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbUploadComponent
  ],
  declarations: [
    MoWbUploadComponent
  ],
  providers: [
  ]
})
export class MoWbUploadModule {

}
