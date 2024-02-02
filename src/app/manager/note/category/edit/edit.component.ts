import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { ICategoryItem } from '../category.component';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { TranslateService } from '@ngx-translate/core';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';

declare var IntegrateMicroSites: any;
@Component({
  selector: 'mo-wb-manager-note-category-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbManagerNoteCategoryEditComponent extends MoWbV4ModalComponent {
  
  newName: string = '';
  loading: boolean;
  
  @Input() categoryInfo: ICategoryItem;
  @Input() override isHideMenu: boolean = true;

  @Output() onEditFolder = new EventEmitter< ICategoryItem>;
  @ViewChild('input') inputName: MoWbInputComponent;
  constructor(
    private _toast: ToastTranslateService,
    private noteApiService: ManagerNoteApiService,
    public override _changeDetection: ChangeDetectorRef,
    private _translate: TranslateService,
  ) {
    super(_changeDetection)
  }
  
  /**
   * handle on after view init
   */
  override ngAfterViewInit(): void {
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
    return result;
  }

  /**
   * api create new folder
   * @returns 
   */
  async editCategory(){
    const response = await this.noteApiService.updateCategory(this.inputName.value, this.categoryInfo.category_id);
    this.loading = false;
    this.detectChanges();
    if (response && response.code === 200) {
      // this._toast.show('success', 'i18n_notification_manipulation_success');
     this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
      return response;
    }
    // this._toast.show('error', response.message);
    this._toast.show('error', response.message);

    return null;
  }

  /**
   * handle change site name
   * @param value 
   */
  handleOnValueChange(value: string){
    this.newName = value;
  }

  /**
   * handle input error
   * @param e 
   */
  handleErrorInput(e: boolean){
    this.newName = '';
  }



  /**
   * handle quick add folder
   * @param $event 
   */
  async handleOnClickOnChangeName(e: MouseEvent){
    if (!this.validate()){
      return;
    }
    this.loading = true;
    const dataResponse = await this.editCategory();
    if(dataResponse === null){
      return;
    }
    const data = {
      cate_name: this.inputName.value,
      category_id: this.categoryInfo.category_id,
      cate_description: this.categoryInfo.cate_description,
      note_amount: this.categoryInfo.note_amount
    }
    this.onEditFolder.emit(data);
  }

}
