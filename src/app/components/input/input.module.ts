import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbInputComponent } from './input.component';
import { MoWbInputNumberComponent } from './number/input-number.component';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';
import { MoWbPipeModule } from '../../pipe/pipe.module';
import { MoWbInputNumberUnitDropdownComponent } from './number/unit-dropdown/unit-dropdown.component';
import { MoWbInputNumberMinmaxComponent } from './number/minmax/minmax.component';
import { MoWbInputAngleComponent } from './angle/angle.component';
import { MoWbButtonModule } from './../button/button.module';
 
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
    MoWbTooltipModule,
    MoWbPipeModule,
    MoWbButtonModule
  ],
  declarations: [
    MoWbInputComponent,
    MoWbInputNumberComponent,
    MoWbInputNumberUnitDropdownComponent,
    MoWbInputNumberMinmaxComponent,
    MoWbInputAngleComponent
  ],
  exports: [
    MoWbInputComponent,
    MoWbInputNumberComponent,
    MoWbInputNumberMinmaxComponent,
    MoWbInputAngleComponent
  ],
  providers: [
  ]
})
export class MoWbInputModule {

}
