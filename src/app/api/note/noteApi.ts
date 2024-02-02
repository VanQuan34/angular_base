import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../base';
import { categories } from '@ctrl/ngx-emoji-mart/ngx-emoji';
// import { CacheService } from '../common/cache.service';

const PATH_NOTE = '/notes';
const PATH_CATEGORY = '/category';

export interface ICreateCategoryNote {
  cate_name: string;
  cate_description: string;
  cate_type: 'note';
}

export interface ICreateNote {
 category_id: string,
 description: string,
 title: string,
}

export interface IDuplicateNote{
  note_id: string,
  title: string,
  category_id: string
}

export interface IEditNote{
  title?: string,
  description?: string,
  content?: string
}

export interface IParamList{
  page?: number,
  search?: string
}

@Injectable()
export class ManagerNoteApiService {
  constructor(
    private _baseService: MoWbBaseApiService // private _cacheService: CacheService
  ) {}

  /**
   * fetch create
   * @returns
   */
  public async fetchCreateCategory(param: ICreateCategoryNote) {
    const response = await this._baseService.fetch({
      path: PATH_CATEGORY + '/create',
      method: 'POST',
      body: param,
    });
    return response;
  }

  /**
   * 
   * @returns get list category note
   */
  public async fetchListCategory() {
    const response = await this._baseService.fetch({
      path: PATH_CATEGORY + '/note',
      method: 'GET',
    });
    return response;
  }

  /**
   * 
   * @returns get list category note
   */
  public async updateCategory(name: string, category_id: string) {
    const response = await this._baseService.fetch({
      path: PATH_CATEGORY + `/note/${category_id}`,
      method: 'PATCH',
      body :{
        cate_name: name,
      }
    });
    return response;
  }

  /**
   * delete category
   * @param categoryId 
   * @returns 
   */
  public async deleteCategory(categoryId: string){
    const response = await this._baseService.fetch({
      path: PATH_CATEGORY + `/note/${categoryId}`,
      method: 'DELETE',
    });
    return response;
  }

  /**
   * get list all note
   * @param categoryId 
   * @returns 
   */
  public async fetchListNote(params: IParamList){
    const response = await this._baseService.fetch({
      path: PATH_NOTE,
      method: 'GET',
      query: params
    });
    return response;
  }

  /**
   * get list all note
   * @param categoryId 
   * @returns 
   */
  public async fetchListNoteByCategory(categoryId: string, search?: string){
    const query: any = {};
    if(search){
      query['search'] = search
    }
    const response = await this._baseService.fetch({
      path: PATH_NOTE + `/category/${categoryId}`,
      method: 'GET',
      query: query
    });
    return response;
  }

/**
 * create note
 * @param categoryId 
 * @returns 
 */
  public async createNote(params: ICreateNote){
    const response = await this._baseService.fetch({
      path: PATH_NOTE + '/create',
      method: 'POST',
      body: params
    });
    return response;
  }

  /**
 * detail note
 * @param categoryId 
 * @returns 
 */
  public async fetchDetailNote(noteId: string){
    const response = await this._baseService.fetch({
      path: PATH_NOTE + `/details/${noteId}`,
      method: 'GET',
    });
    return response;
  }

  /**
   * Duplicate note
   * @param params 
   * @returns 
   */
  public async duplicateNote(params: IDuplicateNote){
    const response = await this._baseService.fetch({
      path: PATH_NOTE + `/duplicate`,
      method: 'POST',
      body: params
    });
    return response;
  }

  /**
   * edit note
   * @param noteId 
   * @param params 
   * @returns 
   */
  public async editNote(noteId: string, params: IEditNote){
    const response = await this._baseService.fetch({
      path: PATH_NOTE + `/${noteId}`,
      method: 'PATCH',
      body: params
    });
    return response;
  }

  public async deleteNote(noteId: string){
    const response = await this._baseService.fetch({
      path: PATH_NOTE + `/${noteId}`,
      method: 'DELETE',
    });
    return response;
  }


}
