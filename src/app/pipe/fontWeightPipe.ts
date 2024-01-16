import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'fontWeightPipe'
})
export class FontWeightPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value: string) {
    switch (value) {
      case '300':
        return 'Light';
      case '400':
        return 'Regular';
      case '500':
        return 'Medium';
      case '600':
        return 'Semi Bold';
      case '700':
        return 'Bold';
      case '800':
        return 'Extra Bold';
      case '900':
        return 'Black';
      default: 
        return ''
    }
  }
}
