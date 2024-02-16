import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../base';
import { query } from '@angular/animations';
import { environment } from 'src/environments/environment';
// import { CacheService } from '../common/cache.service';

const PATH_IMAGE = '/image';
@Injectable()
export class MoWbManagerImagesApiService {
  constructor(
    private _baseService: MoWbBaseApiService
  ) // private _cacheService: CacheService
  {}

  /**
   * upload Image
   * @returns
   */
  public async uploadImages(file: any, categoryId?: string) {
    const query: any = {};
    if(categoryId){
      query['category_id'] = categoryId;
    }
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(environment.domainApiLocal+PATH_IMAGE+`/create`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    return data;
  }

  /**
   * get image all
   * @param categoryId 
   * @returns 
   */
  public async fetchListImage() {
    const response = await this._baseService.fetch({
      path: PATH_IMAGE,
      method: 'GET',
    });
    return response;
  }

  /**
   * get image by category
   * @param categoryId 
   * @returns 
   */
  public async fetchLitImageByCategory(categoryId: string) {
    const response = await this._baseService.fetch({
      path: PATH_IMAGE + `/${categoryId}`,
      method: 'GET',
    });
    return response;
  }

   /**
   * get image by category
   * @param categoryId 
   * @returns 
   */
   public async deleteImage(imageId: string) {
    const response = await this._baseService.fetch({
      path: PATH_IMAGE + `/${imageId}`,
      method: 'DELETE',
    });
    return response;
  }
}
