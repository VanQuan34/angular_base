import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbButtonGroupComponent } from './group.component';
import { MoWbButtonModule } from '../button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule
  ],
  declarations: [MoWbButtonGroupComponent],
  exports: [MoWbButtonGroupComponent]
})
export class MoWbButtonGroupModule { }
