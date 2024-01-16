import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbCheckboxModule } from '../../checkbox/checkbox.module';
import { FormsModule } from '@angular/forms';

import { MoWbDaysOfWeekComponent } from './days-of-week.component';
import { CheckDayOfWeekPipeModule } from './pipe/check-day-of-week.pipe';
import { MoWbDropDownModule } from '../../drop-down/drop_down.module';
import { MoCommonTranslateService } from '../../../service/common/common-translate.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({}),
        MoWbCheckboxModule,
        CheckDayOfWeekPipeModule,
        FormsModule,
        MoWbDropDownModule
    ],
    exports: [
        MoWbDaysOfWeekComponent
    ],
    declarations: [
        MoWbDaysOfWeekComponent
    ],
    providers: [
        MoCommonTranslateService
    ],
    entryComponents: [MoWbDaysOfWeekComponent]
})
export class MoWbDaysOfWeekModule {

}
