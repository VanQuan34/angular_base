import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './safeHtml';
import { UpperCasePipe } from './upperCasePipe';
import { FontWeightPipe } from './fontWeightPipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  declarations: [
    SafeHtmlPipe,
    UpperCasePipe,
    FontWeightPipe,
  ],
  exports: [
    SafeHtmlPipe,
    UpperCasePipe,
    FontWeightPipe,
  ]
})
export class MoWbPipeModule { }
