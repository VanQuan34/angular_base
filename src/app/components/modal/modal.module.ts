import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoWbModalComponent } from './modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbButtonModule } from '../button/button.module';
import { MoWbModalDeleteComponent } from './delete/delete.component';
import { MoWbModalConfirmComponent } from './confirm/confirm.component';

// v4 modal
import { MoWbV4ModalComponent } from './v4/modal/modal.component';
import { MoWbModalV4ConfirmComponent } from './v4/confirm/confirm.component';
import { MoWbConfirmModalService } from './v4/confirm/showConfirmModal.service';

@NgModule({
	imports: [
		TranslateModule.forChild({}),
		MoWbButtonModule,
		CommonModule
	],
	exports: [
		MoWbModalComponent,
		MoWbModalDeleteComponent,
		MoWbModalConfirmComponent,
		MoWbV4ModalComponent,
		MoWbModalV4ConfirmComponent,
	],
	declarations: [
		MoWbModalComponent,
		MoWbModalDeleteComponent,
		MoWbModalConfirmComponent,
		MoWbV4ModalComponent,
		MoWbModalV4ConfirmComponent
	],
	providers: [
		MoWbConfirmModalService
	]
})
export class MoWbModalModule {

}
