// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { CacheKeys } from '../common/define/cache-keys.define';
import { Utils } from '../file_manager/utils/utils';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.initConfig();
    if (this.authService.isAuthenticatedUser()) {
      return true;
    } else {
      // Set the redirect URL before navigating to the login page
      this.authService.setRedirectUrl(state.url);
      this.router.navigate(['/login']);
      return false;
    }
  }

  initConfig(){
    this.initTheme();
  }

  initTheme(){
    const theme = localStorage.getItem(CacheKeys.KEY_THEME);
    let currentTheme = theme && JSON.parse(theme);
    if(!theme){
      currentTheme = {
        '--pri': '#226FF5'
      }
    }
    console.log('currentTheme=', currentTheme);
    const primaryColor = currentTheme['--pri'];
    Utils.buildRootColor(primaryColor);
  }

}
