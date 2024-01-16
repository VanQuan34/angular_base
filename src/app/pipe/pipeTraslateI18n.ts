import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'translateI18nPipe'
})
export class TranSlateI18nPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string, valueReplace: any) {
    let indexStart = value.indexOf("{");
    let indexEnd= value.lastIndexOf("}");
    let findValue = value.slice(indexStart, indexEnd+1);
    return value.replace(findValue, valueReplace);
  }
}