import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbCheckBoxComponent } from './checkbox.component';
import { MoWbTooltipModule } from '../tooltip/tooltip.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({}),
        MoWbTooltipModule
    ],
    exports: [
        MoWbCheckBoxComponent
    ],
    declarations: [
        MoWbCheckBoxComponent
    ],
    providers: [
    ]
})
export class MoWbCheckboxModule {

}
