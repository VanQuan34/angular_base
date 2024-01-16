import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbDatePickerHoursComponent } from './hours.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        FormsModule
    ],
    exports: [
        MoWbDatePickerHoursComponent
    ],
    declarations: [
        MoWbDatePickerHoursComponent
    ],
    providers: [
    ]
})
export class MoWbDatePickerHoursModule {
}
