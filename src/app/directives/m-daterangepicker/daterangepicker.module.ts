import { NgModule } from '@angular/core';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { DaterangepickerConfig } from './config.service';

@NgModule({
  declarations: [
    DaterangepickerDirective
  ],
  providers: [
    DaterangepickerConfig
  ],
  exports: [
    DaterangepickerDirective
  ]
})

export class Daterangepicker {
}
