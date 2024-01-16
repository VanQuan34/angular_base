import { MoWbButtonModule } from './../button/button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbPipeModule } from '../../pipe/pipe.module';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
// import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MoWbClickOutsideModule } from '../../directives/click-outside.directive';
import { MoWbCheckboxModule } from '../checkbox/checkbox.module';
import { MoWbRadioModule } from '../radio/radio.module';
// import { MoWbScrollOverlayModule } from '../scroll-overlay/scroll-overlay.module';

import { MoWbTableComponent } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbSpinnerModule,
    MoWbButtonModule,
    MoWbPipeModule,
    MoWbTooltipModule,
    // VirtualScrollerModule,
    MoWbClickOutsideModule,
    MoWbCheckboxModule,
    MoWbRadioModule,
    // MoWbScrollOverlayModule
  ],
  exports: [
    MoWbTableComponent
  ],
  declarations: [
    MoWbTableComponent
  ],
  providers: [
  ]
})
export class MoWbTableModule {

}
