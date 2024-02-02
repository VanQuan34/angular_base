import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../base';
// import { CacheService } from '../common/cache.service';

const PATH_AUTH = '/chats';
export interface ICreateChat {
  room_id: string,
  user_id: string,
  message: string
}

@Injectable()
export class FileManagerChatApiService {
  constructor(
    private _baseService: MoWbBaseApiService
  ) // private _cacheService: CacheService
  {}

  /**
   * fetch list
   * @returns
   */
  public async fetchCreateChat(param: ICreateChat) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH + '/create',
      method: 'POST',
      body: param,
    });
    return response;
  }

  /**
   * get list users
   * @returns
   */
  public async fetchListChat(roomId: string, page: number) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH+`/${roomId}`,
      query: {
        page: page
			},
      method: 'GET',
    });
    return response;
  }
}
