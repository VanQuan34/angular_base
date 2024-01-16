import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbDateTimePickerComponent } from './date-time/date-time.component';
import { MoWbMultiDatePickerComponent } from './multi-date/multi-date.component';
import { Daterangepicker } from '../../directives/m-daterangepicker/daterangepicker.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { LabelTimePipe } from './date-time/label-time.pipe';
import { MoWbDateTimePickerViewComponent } from './date-time/view/view.component';
// import { MoWbDropDownModule } from '../drop-down/drop_down.module';
import { MoWbLabelModule } from '../label/label.module';
import { MoWbButtonModule } from '../button/button.module';
import { MyDatePickerModule } from './date-time/calendar/my-date-picker';
import { DisplayMultiDatePipeModule } from './multi-date/pipe/multi-date.pipe';
import { MoWbClickOutsideModule } from '../../directives/click-outside.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Daterangepicker,
        TranslateModule.forChild({}),
        MoWbClickOutsideModule,
        // MoWbDropDownModule,
        MoWbLabelModule,
        MoWbButtonModule,
        MyDatePickerModule,
        DisplayMultiDatePipeModule
    ],
    declarations: [
        MoWbDateTimePickerComponent,
        MoWbMultiDatePickerComponent,
        LabelTimePipe,
        MoWbDateTimePickerViewComponent,
    ],
    exports: [
        CommonModule,
        Daterangepicker,
        MoWbDateTimePickerComponent,
        MoWbMultiDatePickerComponent,
        MoWbButtonModule
    ],

    entryComponents: [MoWbDateTimePickerViewComponent]
})
export class MoWbDatePickerModule {
}
