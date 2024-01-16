import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MoWbModalModule } from '../../components/modal/modal.module';
// import { MoWbBaseApiService } from '../baseApi';
import { AddComponentToBodyService } from './add-component-to-body.service';
import { DomHandlerService } from './dom-handler.service';
//import { SocketService } from './socket.service';
import { ToastTranslateService } from './toast-translate.service';


@NgModule({
  imports: [
    CommonModule,
    MoWbModalModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      maxOpened: 8,
      newestOnTop: true,
      enableHtml: true,
      autoDismiss: true
    }),
  ],
  providers: [
    AddComponentToBodyService,
    DomHandlerService,
    ToastTranslateService,
  ],
})
export class MoWbCommonServiceModule {

}
