import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbMenuComponent } from './menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule
	],
	exports: [
		MoWbMenuComponent
	],
	declarations: [
		MoWbMenuComponent
	],
})
export class MoWbMenuModule {

}
