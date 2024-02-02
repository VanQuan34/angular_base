import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MoWbInputComponent } from '../components/input/input.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isPending: boolean;

  @ViewChild('username') _username: MoWbInputComponent;
  @ViewChild('password') _password: MoWbInputComponent;

  constructor(
    private _router: Router,
    private authService: AuthService,
  ){}

  ngOnInit(){
 // Check if user is already authenticated when the LoginComponent is initialized
  if (this.authService.isAuthenticatedUser()) {
    // Redirect to the feature component if already authenticated
    this._router.navigate(['/chat']);
    } else{
      this._router.navigate(['/login']);
    }
  }

  validate(){
    let result: boolean = true;
    if (!this._username.validate()) {
      result = false;
    }
    if (!this._password.validate()) {
      result = false;
    }
    return result;
  }

  handleChangeText(e: any){
  }

  handleOnClickLogin(e: MouseEvent){
    if(!this.validate()){
      return;
    }
    if (this.authService.login(this._username.getValue(), this._password.getValue())) {
      // Check for a redirect URL
      const redirectUrl = this.authService.getRedirectUrl();
      // Clear the redirect URL after successful login
      this.authService.setRedirectUrl('');
    } else {
      alert('Invalid credentials');
    }
  }

  handleOnClickRedirect(e: MouseEvent){
    this._router.navigate(['/register']);
  }
}
