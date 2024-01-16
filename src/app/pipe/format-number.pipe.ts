import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefineFunction } from '../common/define/function.define';

@Pipe({ name: 'MoWbFormatNumberPipe' })
export class MoWbFormatNumberPipe implements PipeTransform {
  transform(value: number, acceptNegativeValue: boolean, parseFixed: number = 1) {
    return DefineFunction.formatNumberValue(value, acceptNegativeValue, parseFixed);
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MoWbFormatNumberPipe],
  exports: [MoWbFormatNumberPipe]
})

export class MoWbFormatNumberPipeModule { }
