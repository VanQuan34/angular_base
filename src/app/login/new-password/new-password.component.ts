import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { AuthService } from 'src/app/auth.service';
import { FileManagerAuthApiService } from 'src/app/api/auth/authApi';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-register-new_password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {

  isPending: boolean;
  token: string;
  isSuccess: boolean;
  isError: boolean;

  @ViewChild('password') _passwordInput: MoWbInputComponent;
  @ViewChild('rePassword') _rePasswordInput: MoWbInputComponent;

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private _router: Router,
    private authService: AuthService,
    private _userApiService: FileManagerAuthApiService,
    private _toast: ToastTranslateService,
  ){}

  ngOnInit(){
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    this.token = params.get('token');
    console.log('params=', params, email, this.token);
    if(!email || !this.token){
      this._router.navigate(['/reset-password']);
    }
    const decodeToken = this.token && this.jwtHelper.decodeToken(this.token);
    const expired = decodeToken && decodeToken.exp;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if(!expired || expired < currentTime ){
      this._router.navigate(['/reset-password']);
    }
  }

  validate(){
    let result: boolean = true;
    if (!this._passwordInput.validate()) {
      result = false;
    }
    if(!this._rePasswordInput.validate()){
      result = false;
    }
    return result;
  }

  handleChangeText(e: string){
    this.isError = false;
  }

  async newPassword(){
    const host = environment.domainApiLocal
    await fetch(host+'/users/new-password', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'admin123',
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        this.isPending = false;
        if(res && res.code === 200){
          this.isSuccess = true;
          this._toast.show('success', res.message);
          return;
        }
        this._toast.show('error', res.message);
      })
      .catch((error) => {
        this.isPending = false;
      });
  }

  handleOnClickResetPassword(e: MouseEvent){
    if(!this.validate()){
      return;
    }
    if(this._passwordInput.getValue() !== this._rePasswordInput.getValue()){
      this._rePasswordInput.invalidMsg = 'Mật khẩu không khớp';
      this.isError = true;
      return;
    }
    this.isPending = true;
    this.newPassword();
  }

  handleOnClickRedirectLogin(e: MouseEvent){
    this._router.navigate(['/login']);
  }

}
