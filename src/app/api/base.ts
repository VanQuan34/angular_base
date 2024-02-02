import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CacheService } from './common/cache.service';
import { ToastTranslateService } from './common/toast-translate.service';
import { CacheKeys } from '../common/define/cache-keys.define';
import { environment } from '../../environments/environment';
import { MoWbConfirmModalService } from "src/app/components/modal/v4/confirm/showConfirmModal.service";
import { GLOBAL } from '../common/types/global/global';
import { Router } from '@angular/router';

interface IFetchParam {
  path: string,
  host?: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  headerType ?: 'FILE' | 'JSON' | 'NORMAL' |'FORM-DATA',
  body?: any,
  query?: any,
  isCache?: boolean,
}

@Injectable()
export class MoWbBaseApiService {
  host: string;
  token: string;
  jsonHeader: any;
  fileHeader: any;
  formDataHeader: any;
  normalHeader: any;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private _toast: ToastTranslateService,
    // private _cacheService: CacheService,
    private router:Router,
    private _confirmModal: MoWbConfirmModalService
  ) {}
  
  /**
   * init host, token and header
   */
  init() {
    if (this.token) {  
      return;
    }
    this.host = environment.domainApiLocal //environment.domainApi;
    console.log('init host=', this.host);
    const token = this.getToken();
    this.token = token ? `Bearer ${token}` : '';
    
    console.log('MoWbBaseApiService token=', token, ' userInfo= ', this.jwtHelper.decodeToken(token));

    this.jsonHeader = {
      Authorization: this.token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    this.fileHeader = {
      Authorization: this.token,
    };

    this.normalHeader = {
      Authorization: this.token,
    };

    this.formDataHeader = {
      Authorization: this.token,
      'content-type': 'multipart/form-data',
    }
  }


  /**
   * fetch data
   * @param 
   * @returns
   */
  public async fetch(param: IFetchParam) {
    try {
      this.init();

      // get host
      let host = param.host || `${this.host}${encodeURI(param.path)}`;
      // build query
      let _query: any = param.query || {};
      if (Object.keys(_query).length !== 0) {
        host = `${host}?${new URLSearchParams(_query)}`;
      }
      const config: any = {};
      config.method = param.method || 'GET';
      config.mode = 'cors';
      // get header
      switch(param.headerType) {
        case 'FILE':
          config.headers = this.fileHeader;
          break;
        case 'JSON':
          config.headers = this.jsonHeader;
          break;
        case 'NORMAL':
          config.headers = this.normalHeader;
          break;
        case 'FORM-DATA': 
          config.headers = this.formDataHeader;
          // config.body = "blob";
          break;
        default:
          config.headers = this.jsonHeader;
      }

      // build body
      if (param.body) {
        config.body = param.headerType === 'FILE' ? param.body : JSON.stringify(param.body);
      }
      // const cacheKey = CacheKeys.KEY_CACHE_FIELD_CONFIG(`${host}${param.body ? JSON.stringify(param.body) : ''}`);
      // get from cache
      if (param.isCache) {
        // const cacheData = this._cacheService.get(cacheKey);
        // if (cacheData) {
        //   return cacheData;
        // }
      }
      // fetch data
      const rawResponse = await fetch(host, config);
      
      if (rawResponse.status === 401) {
        if (GLOBAL.isError401) {
          return;
        }
        // this._toast.show('error', 'Lỗi 401');
        GLOBAL.isError401 = true;
        // console.log('Loi 401 ', rawResponse, ' config=', config);
        let content = 'Phiên làm việc của bạn đã quá hạn. Vui lòng đang nhập lại';
        this._confirmModal.showModal({
          zIndex: 10050,
          type: 'ERROR',
          content: content,
          title: 'Thông báo',
          desc: '',
          width: '500px',
          label: 'Đăng nhập',
          needHideMenu: true,
          okButtonCallback: () => {
            // this._cacheService.clearAll();
            localStorage.removeItem(CacheKeys.KEY_TOKEN);
            // this.router.navigate(['/login']);
            window.location.href = '/login';
          }
        });
        return;
      }
      const content = await rawResponse.json();
      if (content.code && content.code === 500 && content.message) {
        this._toast.show('error', content.message);
        return content;
      }
      if (param.isCache && content && content.code === 200) {
        // this._cacheService.set(cacheKey, content, CacheService.CACHE_1_DAY);
      }
      return content;
    } catch(err) {
      console.log('fetch error=', err);
      return {code: 500, message: 'Có lỗi trong quá trình xử lý'};
    }

  }

  setCacheValue(value: any, key: string, expired?: number) {
    // this._cacheService.set(key, value);
  }

  deleteCache(key: string) {
    // this._cacheService.clear(key);
  }

  deleteCacheStartWith(key: string) {
    // console.log('deleteCacheStartWith=',key);
    // this._cacheService.deleteKeyStartWith(CacheKeys.KEY_CACHE_FIELD_CONFIG(key));
  }

  deleteHostCache(path: string, host: string = '') {
    const key = host || `${this.host}${path}`;
    // this._cacheService.deleteKeyStartWith(CacheKeys.KEY_CACHE_FIELD_CONFIG(key));
  }

  getCache(key: string) {
    // return this._cacheService.get(key);
  }

  public getToken() {
    // const token = this._cacheService.get(CacheKeys.KEY_CACHE_TOKEN) || '';
    const token = localStorage.getItem(CacheKeys.KEY_TOKEN);
    return token || undefined;
  }

  public updateToken() {
    const token = this.getToken();
    this.token = token ? `Bearer ${token}` : '';

    this.jsonHeader = {
      Authorization: this.token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    this.fileHeader = {
      Authorization: this.token,
    };

    this.normalHeader = {
      Authorization: this.token,
    };

  }

  
}
