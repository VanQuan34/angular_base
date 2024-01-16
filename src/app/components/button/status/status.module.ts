import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoButtonStatusComponent } from './status.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    MoButtonStatusComponent
  ],
  exports: [MoButtonStatusComponent]
})
export class MoButtonStatusModule { }
