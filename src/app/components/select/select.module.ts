import { MoWbButtonModule } from './../button/button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbSpinnerModule } from '../spinner/spinner.module';
import { MoWbPipeModule } from '../../pipe/pipe.module';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MoWbClickOutsideModule } from '../../directives/click-outside.directive';
import { MoWbCheckboxModule } from '../checkbox/checkbox.module';
import { MoWbRadioModule } from '../radio/radio.module';

import { MoWbSelectDropdownComponent } from './dropdown/dropdown.component'; 
import { MoWbSelectComponent } from './select.component';
import { MoWbSelectMenuComponent } from './menu/menu.component';
import { MoWbSelectMenuPopupComponent } from './menu/popup/popup.component';
import { MoWbSelectToggleComponent } from './toggle/toggle.component';
import { MoWbSelectTogglePopupComponent } from './toggle/popup/popup.component';
import { MoWbSelectDropdownTreeViewComponent } from './dropdown/tree-view/tree-view.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbSpinnerModule,
    MoWbButtonModule,
    MoWbPipeModule,
    MoWbTooltipModule,
    VirtualScrollerModule,
    MoWbClickOutsideModule,
    MoWbCheckboxModule,
    MoWbRadioModule
  ],
  exports: [
    MoWbSelectDropdownComponent,
    MoWbSelectComponent,
    MoWbSelectMenuComponent,
    MoWbSelectMenuPopupComponent,
    MoWbSelectToggleComponent,
    MoWbSelectTogglePopupComponent,
    MoWbSelectDropdownTreeViewComponent
  ],
  declarations: [
    MoWbSelectDropdownComponent,
    MoWbSelectComponent,
    MoWbSelectMenuComponent,
    MoWbSelectMenuPopupComponent,
    MoWbSelectToggleComponent,
    MoWbSelectTogglePopupComponent,
    MoWbSelectDropdownTreeViewComponent
  ],
  providers: [
  ]
})
export class MoWbSelectModule {

}
