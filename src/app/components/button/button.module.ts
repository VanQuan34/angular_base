
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbToggleModule } from './toggle-button/toggle.module';
import { MoWbButtonToggleComponent } from './toggle/toggle.component';
import { ButtonComponent } from './button.component';
@NgModule({
  imports: [
    CommonModule,
    MoWbTooltipModule,
    MoWbSpinnerModule,
    MoWbToggleModule,
  ],
  declarations: [
    ButtonComponent,
    MoWbButtonToggleComponent
  ],
  exports: [
    ButtonComponent,
    // MoWbToggleComponent,
    MoWbButtonToggleComponent
  ]
})
export class MoWbButtonModule { }
