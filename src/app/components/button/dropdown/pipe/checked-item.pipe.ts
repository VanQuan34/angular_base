import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkedItemPipe'
})
export class CheckedItemPipe implements PipeTransform {

  transform(keySelected: string, item: any, keyField: string): any {
    if (!keySelected || !item || !keyField || !item[keyField]) {
      return false;
    }

    return item[keyField] === keySelected;
  }

}
