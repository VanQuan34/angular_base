import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'labelTime'
})

export class LabelTimePipe implements PipeTransform {
  constructor() { }
  transform(dateUpPost: any, hiddenTime: any, keepFormat: any) {
    if (dateUpPost) {
      const date = moment(dateUpPost);
      if (keepFormat) {
        return date.format(this.replaceFormatDateTime(keepFormat));
      }
      if (hiddenTime) {
        return date.format('DD/MM/YYYY');
      }
      return date.format('DD/MM/YYYY HH:mm');
    }
    if (keepFormat) {
      return keepFormat;
    }
    if (hiddenTime) {
      return 'dd/mm/yyyy';
    }
    return 'dd/mm/yyyy hh:mm';
  }

  replaceFormatDateTime(format: string) {
    format = format.replace('dd', 'DD');
    format = format.replace('mm', 'MM');
    format = format.replace(':MM', ':mm');
    if (format.indexOf('yyyy') > -1) {
      format = format.replace('yyyy', 'YYYY');
    }
    if (format.indexOf('hh') > -1) {
      format = format.replace('hh', 'HH');
    }
    return format;
  }
}
