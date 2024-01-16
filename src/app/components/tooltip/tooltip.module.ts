import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoWbTooltipComponent } from './tooltip.component';
import { MoWbTooltipContentComponent } from './content/content.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
// import { MoWbClickOutsideModule } from '../../directives/click-outside.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild({}),
        // MoWbClickOutsideModule
    ],
    exports: [
        MoWbTooltipComponent,
    ],
    declarations: [
        MoWbTooltipComponent,
        MoWbTooltipContentComponent
    ],
    // entryComponents: [
    //     MoWbTooltipContentComponent,
    //     MoWbTooltipComponent]
})
export class MoWbTooltipModule {

}
