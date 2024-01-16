import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { MoWbButtonDropdownListComponent } from './list/list.component';
import { CheckedItemPipe } from './pipe/checked-item.pipe';
import { GetLabelPipe } from './pipe/get-label.pipe';
import { MoWbButtonModule } from '../button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbTooltipModule } from '../../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbButtonModule,
    MoWbTooltipModule
  ],
  declarations: [
    DropdownComponent,
    MoWbButtonDropdownListComponent,
    CheckedItemPipe,
    GetLabelPipe
  ],
  exports: [DropdownComponent],
  entryComponents: [MoWbButtonDropdownListComponent]
})
export class MoWbButtonDropdownModule { }
