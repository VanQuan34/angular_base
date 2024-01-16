import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MoWbRadioComponent } from './radio.component';
import { MoWbRadioGroupComponent } from './group/group.component';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbTooltipModule
  ],
  exports: [
    MoWbRadioComponent,
    MoWbRadioGroupComponent
  ],
  declarations: [
    MoWbRadioComponent,
    MoWbRadioGroupComponent
  ],
  providers: [
  ]
})
export class MoWbRadioModule {

}
