import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'multiDate' })
export class DisplayMultiDatePipe implements PipeTransform {

  constructor(private _translate: TranslateService) { }

  transform(start: string, end: string, dateTimeType: string, showDate: boolean, lang?: any): Promise<string> {
    return new Promise(resolve => {
      if (showDate || !dateTimeType) {
        // Replace 24h về 0h
        if (start.search(' 24')) {
          start = start.replace(' 24', ' 00');
        }

        if (end.search(' 24')) {
          end = end.replace(' 24', ' 00');
        }
        return resolve(`${start} - ${end}`);
      }
      this._translate.get('dOptions').subscribe((opt) => {
        resolve(opt.ranges[dateTimeType]);
      });
    })
  }
}

@NgModule({
  declarations: [DisplayMultiDatePipe],
  imports: [CommonModule],
  exports: [DisplayMultiDatePipe],
  providers: [],
})
export class DisplayMultiDatePipeModule { }