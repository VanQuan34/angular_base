import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbSliderComponent } from './slider.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    MoWbSliderComponent
  ],
  declarations: [
    MoWbSliderComponent
  ],
  providers: [
  ]
})
export class MoWbSliderModule {

}
