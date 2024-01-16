import { EventEmitter, ElementRef } from '@angular/core';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { ITime } from './api/time';

@Component({
    selector: 'mo-wb-components-date_picker-hours',
    templateUrl: './hours.component.html',
    styleUrls: ['./hours.component.scss']
})
export class MoWbDatePickerHoursComponent {
    @Input() hours: ITime; // required
    @Input() minutes: ITime; // required
    @Input() readOnly: boolean;
    @Input() errorHourMinutes: boolean;
    @Input() disabled: boolean;
    @Input() width: string = '100px';
    @Input() classInclude: string;

    @Output() onKeyUpHour = new EventEmitter<any>();
    @Output() onKeyUpMinutes = new EventEmitter<any>();

    @ViewChild('refMinutes') refMinutes: ElementRef;

    constructor() {
    }

    onKeyHour(dataHour: any) {
        if (!dataHour || !dataHour.value) {
            return;
        }
        this.hours = dataHour;
        let hourValue = dataHour.value;
        hourValue = hourValue.replace(/[^0-9]/g, '');
        this.hours.value = hourValue;
        if (this.hours.value > 23) {
            this.hours.value = 23;
        }
        setTimeout(() => {
            if (hourValue.length > 1) {
                this.refMinutes.nativeElement.focus();
            }
        }, 0);
        this.onKeyUpHour.emit(this.hours.value);
    }

    onKeyMinutes(dataMinutes: any) {
        if (!dataMinutes || !dataMinutes.value) {
            return;
        }
        this.minutes = dataMinutes;
        let minutesValue = dataMinutes.value;
        minutesValue = minutesValue.replace(/[^0-9]/g, '');
        this.minutes.value = minutesValue;
        if (this.minutes.value > 59) {
            this.minutes.value = 59;
        }
        setTimeout(() => {
            if (minutesValue.length > 2) {
                this.minutes.value = 59;
            }
        }, 0);
        this.onKeyUpMinutes.emit(this.minutes.value);
    }
}
