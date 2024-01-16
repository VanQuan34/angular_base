import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbSpinnerComponent } from './spinner.component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbSpinnerComponent
  ],
  declarations: [
    MoWbSpinnerComponent
  ]
})
export class MoWbSpinnerModule { }
