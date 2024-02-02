import { Component, ViewChild } from '@angular/core';
import { MoWbInputComponent } from '../components/input/input.component';
import { FileManagerAuthApiService, ICreateUser } from '../api/auth/authApi';
import { ToastTranslateService } from '../api/common/toast-translate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

  isChat: boolean;
  isPending: boolean;

  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;

  @ViewChild('firstName') _firstName: MoWbInputComponent;
  @ViewChild('lastName') _lastName: MoWbInputComponent;
  @ViewChild('userName') _userName: MoWbInputComponent;
  @ViewChild('password') _password: MoWbInputComponent;
  @ViewChild('email') _email: MoWbInputComponent;

  constructor(
    private authService: FileManagerAuthApiService,
    private _toast: ToastTranslateService,
    private _router: Router,
    ){
  }

  ngOnInit(){

  }


  handleChangeText(val: string, type: 'FIRST_NAME' | 'LAST_NAME' | 'EMAIL' | 'USER_NAME' | 'PASSWORD'){
    switch(type){
      case 'FIRST_NAME':
        this.firstName = val;
        break;
      case 'LAST_NAME':
        this.lastName = val;
        break;
      case 'EMAIL':
        this.email = val;
        break;
      case 'USER_NAME':
        this.userName = val;
        break;
      case 'PASSWORD':
        this.password = val;
        break;
    }
  }

  /**
 * validate
 * @returns 
 */
  validate() {
    let result: boolean = true;
    if (!this._firstName.validate()) {
      result = false;
    }
    if (!this._lastName.validate()) {
      result = false;
    }
    if (!this._userName.validate()) {
      result = false;
    }
    if (!this._email.validate()) {
      result = false;
    }
    if (!this._password.validate()) {
      result = false;
    }
    return result;
  }

  async register(){
    const param: ICreateUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.userName,
      password: this.password,
      role: 'user',
      department: 'developer',
      email: this.email,
      status: true
    }
    const response = await this.authService.fetchCreateUser(param);
    if(!response || response.code !== 200){
      this.isPending = false;
      this._toast.show('error', response.message);
      return;
    }
    this.isPending = false;
    this._toast.show('success', 'Tạo tài khoản thành công');
    setTimeout(()=>{
      this._router.navigate(['/login']);
    }, 500);
  }

  handleOnClickRegister(e: MouseEvent){
    if(!this.validate()){
      return;
    }
    this.isPending = true;
    this.register();
  }

}
