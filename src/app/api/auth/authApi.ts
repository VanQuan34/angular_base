import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../base';
// import { CacheService } from '../common/cache.service';

const PATH_AUTH = '/users';
export interface ICreateUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: string;
  department: string;
  status: boolean;
}

@Injectable()
export class FileManagerAuthApiService {
  constructor(
    private _baseService: MoWbBaseApiService
  ) // private _cacheService: CacheService
  {}

  /**
   * fetch list
   * @returns
   */
  public async fetchCreateUser(param: ICreateUser) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH + '/register',
      method: 'POST',
      body: param,
    });
    return response;
  }

  /**
   * login authenticate
   * @param username
   * @param password
   */
  public async authenticateUser(username: string, password: string) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH + '/authenticate',
      method: 'POST',
      body: {
        username: username,
        password: password,
      },
    });
    return response;
  }

  /**
   * get list users
   * @returns
   */
  public async fetchListUsers() {
    const response = await this._baseService.fetch({
      path: PATH_AUTH,
      method: 'GET',
    });
    return response;
  }

  public async fetchUserInfo(id: string) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH + `/${id}`,
      method: 'GET',
    });
    return response;
  }

  public async resetPassword(email: string) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH+'/reset-password',
      method: 'POST',
      body: {
        email: email
      }
    });
    return response;
  }
  
}
