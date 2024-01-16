import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ITime } from './api/time';
import { IDate } from './api/date';
import { DayOfWeek } from './days-of-week.constant';
import { ICheckbox } from '../../checkbox/api/checkbox';
@Component({
    selector: 'mo-wb-components-date_picker-days_of_week',
    templateUrl: './days-of-week.component.html',
    styleUrls: ['./days-of-week.component.scss']
})
export class MoWbDaysOfWeekComponent implements OnInit {
    public dayOfWeek: Array<any>;
    public times: Array<ITime>;
    public isHasAddTime: boolean;

    @Input() dateData: Array<IDate>; // Bắt buộc khởi tạo mảng có 1 phần tử  khi sử dụng input dateData
    @Input() width: number;
    @Input() minWidth: number;
    @Input() maxLine: number;
    @Input() keyField: string;
    @Input() isDisabled: boolean;
    @Input() ignoreHour: boolean;
    @Input() ignoreDayOfWeek: boolean;
    @Input() timeLoop: number; // khoảng cách giữ các khoảng thời gian chọn trên 1 row date
    @Input() placeholder: string;
    @Input() selectedDaysAddDefault: Array<number>;
    @Input() hourAddDefault: number;
    @Input() minuteAddDefault: number;
    @Input() lengthOfAdd: number;
    @Input() isValidDayEmpty: boolean;
    @Input() messageErrorDay: string;

    @Output() onChangeDate = new EventEmitter<any>();

    constructor() {
        this.maxLine = 5;
        this.timeLoop = 30;
        this.dayOfWeek = DayOfWeek;
        this.messageErrorDay = 'i18n_select_day_of_week';
    }

    ngOnInit() {
        this.getTimeOption();
    }

    private getTimeOption() {
        this.times = new Array();
        for (let hour = 0; hour < 24; hour++) {
            const rangeTime = Math.round(60 / this.timeLoop);
            for (let minute = 0; minute < rangeTime; minute++) {
                const multiMinute: number = minute * this.timeLoop;
                const label = `${hour < 10 ? '0' + hour : hour}:${multiMinute < 10 ? '0' + multiMinute : multiMinute}`;
                this.times.push({
                    id: label,
                    hour: hour,
                    minute: multiMinute,
                    label: label
                });
            }
        }

    }

    onSelectedChangeCheckbox(e: ICheckbox, date: any) {

        if (e.key === -1) {
            if (e.checked) {
                date.selectedDays = [0, 1, 2, 3, 4, 5, 6];
                this.isValidDayEmpty = this.checkValidDate();
                return;
            }
            date.selectedDays = [];
            this.isValidDayEmpty = this.checkValidDate();
            return;
        }

        if (!e.checked) {
            date.selectedDays = date.selectedDays.filter(day => day !== e.key);
            this.onChangeDate.emit();
            this.isValidDayEmpty = this.checkValidDate();
            return;
        }
        date.selectedDays = [...date.selectedDays, ...[e.key]];
        this.isValidDayEmpty = this.checkValidDate();
        this.onChangeDate.emit();
    }

    removeDays(e: Event, index: number) {
        e.stopPropagation();
        this.dateData.splice(index, 1);
        this.onChangeDate.emit();
        if (this.dateData.length < this.lengthOfAdd) {
            this.isHasAddTime = false;
        }
        this.isValidDayEmpty = this.checkValidDate();
    }

    addDays(e: Event) {
        e.stopPropagation();
        this.dateData.push({
            hour: this.hourAddDefault,
            minute: this.minuteAddDefault,
            selectedDays: this.selectedDaysAddDefault,
            placeholder: this.placeholder
        });
        if (this.dateData.length >= this.lengthOfAdd) {
            this.isHasAddTime = true;
        }
        this.onChangeDate.emit();
        this.isValidDayEmpty = this.checkValidDate();
    }

    checkValidDate() {
        return this.dateData.find(item => item.selectedDays.length === 0) ? true : false;
    }

    onSelectedChangeHour(e, date) {
        const item = e.item;
        date.hour = item.hour;
        date.minute = item.minute;
        this.onChangeDate.emit();
    }
}
