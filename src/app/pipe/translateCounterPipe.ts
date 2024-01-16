import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { COUNTER_TYPE } from '../common/types/landing/counter';


@Pipe({
  name: 'translateCounter'
})
export class TranslateCounterPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer, private translate: TranslateService) { }
  transform(value: string) {
    switch (value) {
      case COUNTER_TYPE.DAY:
        return this.translate.instant('i18n_date');
      case COUNTER_TYPE.HOUR:
        return this.translate.instant('i18n_hour');
      case COUNTER_TYPE.MINUTE:
        return this.translate.instant('i18n_minute');
      case COUNTER_TYPE.SECOND:
        return this.translate.instant('i18n_seconds');
      default:
        return value;
    }
  }
}
