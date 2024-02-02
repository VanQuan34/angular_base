// login.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { CacheKeys } from 'src/app/common/define/cache-keys.define';
import { GLOBAL } from 'src/app/common/types/global/global';
import { IMenuListItem } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'mo-wb-manager-note-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class MoWbManagerNoteTopbarComponent implements OnInit {

  menuItems: IMenuListItem[];
  userInfo: any;
  isShow: boolean;

  constructor(
    private _router:Router,
  ){}

  ngOnInit(): void {
    this.userInfo = GLOBAL.userInfo;
    console.log('this.userInfo=', this.userInfo)
    this.menuItems = [
      {
        id: 'name',
        name: 'Tạ Văn Quân'
      },
      {
        id: 'details',
        name: 'Thông tin tài khoản'
      },
      {
        id: 'logout',
        name: 'Đăng xuất'
      },
    ]
    
  }

  handleOnSelectItem(item: IMenuListItem){
    switch (item.id){
      case 'logout':
        localStorage.removeItem(CacheKeys.KEY_TOKEN);
        setTimeout(()=>{
          // this.router.navigate(['/login']);
          window.location.href = '/login';
        })
        break;
      case 'details':
        this._router.navigate(['/settings']);
        break;  
      default:;
      break;
    }
  }

  handleOnclickInfoUser(e: MouseEvent){
    this._router.navigate(['/settings']);
  }

  handleOnclickLogout(e: MouseEvent){
    localStorage.removeItem(CacheKeys.KEY_TOKEN);
    setTimeout(()=>{
      window.location.href = '/login';
    }, 200)
  }

  handleOnClickLogin(e: MouseEvent){
    this.isShow = !this.isShow;
  }

}
