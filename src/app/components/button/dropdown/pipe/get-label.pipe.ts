import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getLabelPipe'
})
export class GetLabelPipe implements PipeTransform {

  transform(keySelected: string, items: any, keyField: string, fieldDisplay: string, label: string, applyNow: boolean): any {
    if (!keySelected || !items || !keyField || !items.length || applyNow) {
      return label;
    }

    for (const item of items) {
      if (item[keyField] === keySelected) {
        return item[fieldDisplay];
      }
    }

    return label;
  }

}
