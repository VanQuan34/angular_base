import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';

import { MoWbHoverActionComponent } from './hover-action.component';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule
	],
	exports: [
		MoWbHoverActionComponent
	],
	declarations: [
		MoWbHoverActionComponent
	],
})
export class MoWbHoverActionModule {}
