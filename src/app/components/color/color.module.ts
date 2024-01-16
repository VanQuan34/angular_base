import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbColorComponent } from './color.component';
import { ColorSketchModule } from 'ngx-color/sketch';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule,
    ColorSketchModule
	],
	exports: [
		MoWbColorComponent
	],
	declarations: [
		MoWbColorComponent
	],
})
export class MoWbColorModule {

}
