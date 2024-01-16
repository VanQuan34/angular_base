import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'calculatePercentPipe'
})
export class CalculatePercentPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(click: number, view: number) {
    if (click / view * 100 < 100) {
      const percent = click / view * 100;
      return percent.toFixed(2);
    }
    return 100;
  }
}
