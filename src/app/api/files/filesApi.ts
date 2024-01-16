import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../base';
// import { CacheService } from '../common/cache.service';

const PATH_AUTH = '/users';
export interface IUploadFile {
}

@Injectable()
export class FileManagerFilesApiService {
  constructor(
    private _baseService: MoWbBaseApiService
  ) // private _cacheService: CacheService
  {}

  /**
   * fetch list
   * @returns
   */
  public async uploadFiles(param: IUploadFile) {
    const response = await this._baseService.fetch({
      path: PATH_AUTH + '/register',
      method: 'POST',
      body: param,
    });
    return response;
  }

}
