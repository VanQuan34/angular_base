import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef, Injector, ComponentFactoryResolver, ComponentRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { ICreateCategoryNote, ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { GLOBAL } from 'src/app/common/types/global/global';

export interface ICategoryItem{
  id: string,
  name: string,
  sites_amount?: number
}
interface IMenuCateEdit{
  id: string,
  name: string,
  divider: boolean,
  icon: string
}
@Component({
  selector: 'mo-wb-manager-note-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class MoWbManagerNoteCategoryAddComponent extends MoWbV4ModalComponent {

  category: string;
  loading: boolean= false;

  @Input() override isHideMenu: boolean = true;

  @Output() onAddFolder = new EventEmitter<any>;
  @ViewChild('input') inputName: MoWbInputComponent;
  @ViewChild('inputMulti') inputMulti: MoWbInputComponent;

  constructor(
    private _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    private noteApiService: ManagerNoteApiService,
    private _translate: TranslateService,
  ) {
    super(_changeDetection);
  }
  

  /**
   * validate
   * @returns 
   */
  validate() {
    let result: boolean = true;
    if (!this.inputName.validate()) {
      result = false;
    }
    if (!this.inputMulti.validate()) {
      result = false;
    }
    return result;
  }

  /**
   * api create new folder
   * @returns 
   */
  async createCategory(){
    const params: ICreateCategoryNote = {
      cate_name: this.inputName.getValue(),
      cate_description: this.inputMulti.getValue(),
      cate_type: 'note'
    }
    const response = await this.noteApiService.fetchCreateCategory(params);
    this.loading = false;
    this.detectChanges();
    if (response && response.code === 200) {
      this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));

      return response.data;
    }
    if (response && response.code === 409) {
      this._toast.show('error', 'Tên folder đã tồn tại. Vui lòng nhập tên khác');
      return null;
    }
    this._toast.show('error', response.message);

    return null;
  }

  /**
   * handle quick add folder
   * @param $event 
   */
  async handleOnClickAddFolder(event: ICategoryItem){
    // this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
    if(!this.validate()){
      return;
    }
    this.loading = true;
    const dataResponse = await this.createCategory();
    if(dataResponse === null){
      this.inputName.error = true;
      return;
    }
    this.onAddFolder.emit(dataResponse);
  }

}
