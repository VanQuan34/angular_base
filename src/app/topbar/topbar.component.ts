// login.component.ts
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { CacheKeys } from 'src/app/common/define/cache-keys.define';
import { GLOBAL } from 'src/app/common/types/global/global';
import { IMenuListItem } from 'src/app/components/menu/menu.component';
import { MoWbColorComponent } from '../components/color/color.component';
import { AddComponentToBodyService } from '../api/common/add-component-to-body.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class FileManagerTopbarComponents implements OnInit {

  menuItems: IMenuListItem[];
  userInfo: any;
  isShow: boolean;

  isShowColor: boolean;
  colorFont: string;

  @ViewChild('colorSelect') _colorSelect: ElementRef;

  constructor(
    private _router:Router,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _changeDetection: ChangeDetectorRef,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver
  ){}

  ngOnInit(): void {
    this.userInfo = GLOBAL.userInfo;
    this.initColor();
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
  
  initColor(){
    const theme = localStorage.getItem(CacheKeys.KEY_THEME);
    let currentTheme = theme && JSON.parse(theme);
    this.colorFont = currentTheme && currentTheme['--pri'] || '#226FF5';
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
        // this._router.navigate(['/settings']);
        break;  
      default:;
      break;
    }
  }

  handleOnclickInfoUser(e: MouseEvent){
    // this._router.navigate(['/settings']);
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

  handleOnClickToggleColor(e: MouseEvent){
    this.isShowColor = !this.isShowColor;
    const zIndex = 2500;
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbColorComponent).create(this._injector);
    modalRef.instance.width = 240;
    modalRef.instance.parentEL = this._colorSelect;

    modalRef.instance.onChangeColor.subscribe((color: any) => { 
      this.colorFont = color;
    });

    modalRef.instance.onAcceptColor.subscribe((color: any) => { 
      this.colorFont = color;
      Utils.buildRootColor(color);
    });

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this._changeDetection.detectChanges();
    });
    
    this._domService.addDomToBody(modalRef);
  }

}
