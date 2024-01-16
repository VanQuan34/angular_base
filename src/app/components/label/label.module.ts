import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbLabelComponent  } from './label.component';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { MoWbToggleModule } from '../button/toggle-button/toggle.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MoWbTooltipModule,
    MoWbToggleModule
  ],
  declarations: [MoWbLabelComponent],
  exports: [MoWbLabelComponent]
})
export class MoWbLabelModule { }
