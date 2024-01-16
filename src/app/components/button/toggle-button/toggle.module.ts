import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbToggleComponent } from './toggle.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MoWbToggleComponent],
  exports: [MoWbToggleComponent]
})
export class MoWbToggleModule { }
