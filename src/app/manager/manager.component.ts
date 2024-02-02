import { Component, ViewChild } from '@angular/core';
import { MoWbInputComponent } from '../components/input/input.component';
import { FileManagerAuthApiService, ICreateUser } from '../api/auth/authApi';
import { ToastTranslateService } from '../api/common/toast-translate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mo-wb-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class MoWbManagerComponent {

  constructor(
    private _router: Router,
    private authService: FileManagerAuthApiService,
    private _toast: ToastTranslateService
    ){
  }

  ngOnInit(){

  }

  handleOnClickItem(type: 'NOTE' | 'CHAT'){
    switch(type){
      case 'CHAT':
        this.handleOnClickChat();
        break;
      case 'NOTE':
        this.handleOnClickNote();
        break;
    }
  }

  handleOnClickChat(){
    this._router.navigate(['/chat']);
  }

  handleOnClickNote(){
    this._router.navigate(['/manager/note']);
  }

}
