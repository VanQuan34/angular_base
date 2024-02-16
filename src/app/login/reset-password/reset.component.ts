import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { AuthService } from 'src/app/auth.service';
import { FileManagerAuthApiService } from 'src/app/api/auth/authApi';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';

@Component({
  selector: 'app-register-reset_password',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetPasswordComponent {

  isPending: boolean;
  isShow: boolean;

  @ViewChild('email') _emailInput: MoWbInputComponent;
  @ViewChild('password') _password: MoWbInputComponent;

  constructor(
    private _router: Router,
    private authService: AuthService,
    private _userApiService: FileManagerAuthApiService,
    private _toast: ToastTranslateService,
  ){}

  ngOnInit(){
  }

  validate(){
    let result: boolean = true;
    if (!this._emailInput.validate()) {
      result = false;
    }
    return result;
  }

  handleChangeText(e: any){
  }

  async resetPassword(){
    const response = await this._userApiService.resetPassword(this._emailInput.getValue());
    if(!response || response.code !== 200){
      this._toast.show('error', response.message);
      return;
    }
    this.isShow = true;
    this._toast.show('success', 'Email đã gửi thành công');
  }

  handleOnClickResetPassword(e: MouseEvent){
    if(!this.validate()){
      return;
    }
    this.resetPassword();
  }
}
