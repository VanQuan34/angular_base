import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
    name: 'CheckDayOfWeek'
})
export class CheckDayOfWeekPipe implements PipeTransform {

    transform(day: number, dayOfWeek: Array<number>): boolean {
        if (!dayOfWeek || !dayOfWeek.length) {
            return false;
        }

        if (day === -1) {
            if (dayOfWeek.length < 7) {
                return false;
            }
            return true;
        }

        return dayOfWeek.find(item => item === day) !== undefined ? true : false;
    }

}

@Pipe({
    name: 'CheckDayOfWeekBuildKey'
})
export class CheckDayOfWeekBuildKey implements PipeTransform {

    transform(hour: number, minute: number): Array<string> {
        return [`${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`];
    }

}

@NgModule({
    imports: [CommonModule],
    declarations: [CheckDayOfWeekPipe, CheckDayOfWeekBuildKey],
    exports: [CheckDayOfWeekPipe, CheckDayOfWeekBuildKey]
})

export class CheckDayOfWeekPipeModule { }
