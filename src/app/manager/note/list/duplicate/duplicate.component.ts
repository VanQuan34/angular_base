import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef, Injector, ComponentRef, ViewChild
} from '@angular/core';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { ICategoryItem } from '../../category/category.component';
import { MoWbSelectComponent } from 'src/app/components/select/select.component';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { INoteInfo } from '../list.component';

@Component({
  selector: 'mo-wb-manager-note-list-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbManagerNoteListDuplicateComponent extends MoWbV4ModalComponent {
  
  categoryId: string;
  loading: boolean = false; 
  siteName: string;

  @Input() noteInfo: INoteInfo;
  @Input() categoryList: ICategoryItem[];
  @Input() override zIndex: number;
  @Input() override isHideMenu: boolean = true;
  
  @Output() onDuplicateSite = new EventEmitter<any>;
  
  @ViewChild('input', { static: true}) inputName: MoWbInputComponent;
  @ViewChild('select') selectFolder: MoWbSelectComponent;

  constructor(
    private _toast: ToastTranslateService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public override _changeDetection: ChangeDetectorRef,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    private _noteApiService: ManagerNoteApiService,
  ) {
    super(_changeDetection)
  }

  override ngOnInit(): void {
    this.siteName = 'Copy của '+this.noteInfo.title;
    this.siteName = this.siteName.slice(0, 50);
    console.log('inputSite=', this.noteInfo);
  }
  
  /**
   * handle on after view init
   */
  override ngAfterViewInit(): void {
    this.inputName.setValue(this.siteName);
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
    if (!this.selectFolder.validate()) {
      result = false;
    }
    return result;
  }

  /**
   * duplicate site
   * @returns 
   */
  async duplicateSite(){
    const params = {
      note_id: this.noteInfo.note_id,
      title: this.inputName.value,
      category_id: this.categoryId
    }
    const response = await this._noteApiService.duplicateNote(params);
    this.loading = false;
    this.detectChanges();
    console.log('responseDuplicate===', response);
    if(response && response.code === 200){
      this._toast.show('success', 'Nhân đôi ghi chú thành công');
      return response.data;
    }
    // this._toast.show('error', response.message);
    this._toast.show('error', response.message);

    return null;
  }

  /**
   * handle on select category
   * @param category 
   */
  handleOnSelectCategory(category: ICategoryItem[]){
    console.log('category=', category);
    this.categoryId = category[0].category_id;
  }

  /**
   * handle click add new site
   * @param e 
   */
  async handleOnClickDuplicateSite(e: MouseEvent){
    if(!this.validate()){
      return;
    }
    this.loading = true;
    const newNote = await this.duplicateSite();
    if(newNote === null){
      return;
    }
    this.onDuplicateSite.emit(newNote);
  }

}
