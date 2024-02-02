import { Component, Output, ViewChild, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { ICategoryItem } from '../../category/category.component';
import { MoWbSelectComponent } from 'src/app/components/select/select.component';


@Component({
  selector: 'mo-wb-manager-note-list-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbManagerNoteListAddComponent extends MoWbV4ModalComponent{
  
  override isPending: boolean = false;
  categoryId: string;

  @Input() override width: string;
  @Input() override title: string;
  @Input() override isHideMenu: boolean = true;
  @Input() categoryList: ICategoryItem[];
  
  @Output() override onClose = new EventEmitter<any>();
  @Output() onCreateNote = new EventEmitter<any>()

  @ViewChild('input') inputName: MoWbInputComponent;
  @ViewChild('select') selectRef: MoWbSelectComponent;
  @ViewChild('inputDescription') inputDescription: MoWbInputComponent;
  constructor(
    private _toast : ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    private _translate: TranslateService,
    private _noteApiService: ManagerNoteApiService,
  ) { 
    super(_changeDetection);
  }

  override ngOnInit(): void {
  }

  override ngAfterViewInit() {
    this.detectChanges();
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
    if(!this.selectRef.validate()){
      result = false;
    }
    return result;
  }

  /**
   * update site info
   * @returns 
   */
  async createNote() {
    const params = {
      title: this.inputName.getValue(),
      description: this.inputDescription.getValue(),
      category_id: this.categoryId
    }
    this.isPending = true;
    this.detectChanges();
    const response = await this._noteApiService.createNote(params);

    if(!response || response.code !== 200){
      this._toast.show('error', response.message);
      return;
    }
    this.isPending = false;
    this.detectChanges();
    this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
    this.onCreateNote.emit(response.data);
  }

  /**
   * handle on edit button click
   * @param input 
   */
  handleOnClickCreateNote(event: MouseEvent) {
    if(!this.validate()){
      return;
    }
    this.createNote();
  }

   /**
   * handle on select category
   * @param category 
   */
   handleOnSelectCategory(category: ICategoryItem[]){
    console.log('category=', category);
    this.categoryId = category[0].category_id;
  }
}
