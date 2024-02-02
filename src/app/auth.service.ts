// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FileManagerAuthApiService } from './api/auth/authApi';
import { ToastTranslateService } from './api/common/toast-translate.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CacheKeys } from './common/define/cache-keys.define';
import { GLOBAL } from './common/types/global/global';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private redirectUrl: string | null = null;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router,
    private authService: FileManagerAuthApiService,
    private _toast: ToastTranslateService,
    ){}

  async login(username: string, password: string): Promise<boolean> {
    // if (username === 'admin' && password === 'admin123') {
    //   this.isAuthenticated = true;
    //   localStorage.setItem('isAuthenticated', 'true');
    //   this.router.navigate(['/dashboard']);
    //   return true;
    // }
    // return false;
    const response = await this.authService.authenticateUser(username, password);
    if(response.code === 500){
      this._toast.show('error', 'Có vấn đề với kết nối server')
      return false;
    }
    if(!response || response.code !== 200){
      this._toast.show('error', 'Thông tin truy cập không chính xác')
      return false;
    }
    console.log('response authenticate =', response);
    this.isAuthenticated = true;
    // localStorage.setItem('isAuthenticated', 'true');
    const token = response.data.token;
    localStorage.setItem(CacheKeys.KEY_TOKEN, token);
    this.router.navigate(['/chat']);
    return true;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  isAuthenticatedUser(): boolean {
    console.log('check authen')
    const token = localStorage.getItem(CacheKeys.KEY_TOKEN);
    const decodeToken = token && this.jwtHelper.decodeToken(token) || null;
    const expired = decodeToken && decodeToken.exp;
    const userInfo = decodeToken && decodeToken.sub;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if(expired && expired > currentTime ){
      GLOBAL.userInfo = userInfo;
      return true;
    }
    localStorage.removeItem(CacheKeys.KEY_TOKEN);
    return false;
  }
}