// login.component.ts
import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagerAuthApiService } from 'src/app/api/auth/authApi';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { GLOBAL } from 'src/app/common/types/global/global';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';
import { MoWbTableComponent } from 'src/app/components/table/table.component';
// import { FileManagerListDetailsPreviewComponents } from './preview/preview.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';
import { ICategoryItem } from '../category/category.component';
import { INoteInfo } from '../list/list.component';
import { MoWbManagerNoteListEditComponent } from '../list/edit/edit.component';
// import { FileManagerListEditComponents } from './edit/edit.component';
// import { FileManagerListRemoveComponents } from './remove/remove.component';

interface ITableColumnSetting {
  type: 'CHECKBOX' | 'TEXT';
  key: string;
  name?: string;
  width: number;
  widthUnit: 'px' | '%';
  textAlign: 'start' | 'center' | 'end';
}

@Component({
  selector: 'mo-wb-manager-note-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class MoWbManagerNoteEditorComponent extends MoWbDetectionComponent {

  loading: boolean;
  isLoaded: boolean;
  loadedEditor: boolean;

  @Input() noteInfo: INoteInfo;
  @Output() onClose = new EventEmitter<any>;

  @ViewChild('table') tableRef: MoWbTableComponent;

  contentEditor: string;

  constructor(
    public override _changeDetection: ChangeDetectorRef,
    private _toast: ToastTranslateService,
    private _noteApiService: ManagerNoteApiService,
    private authApiService: FileManagerAuthApiService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public _domService: AddComponentToBodyService,
    public _injector: Injector
  ) {
    super(_changeDetection);
  }

  override ngOnInit(): void {
    this.loading = true;
    this.getContent();
  }

  /**
   * change content
   * @param value 
   */
  handleOnChangeContent(value: string) {
    this.contentEditor = value;
  }

  handleOnClickBack(e: MouseEvent){
    this.onClose.emit();
  }

  /**
   * get content editor
   * @returns 
   */
  async getContent(){
    const response = await this._noteApiService.fetchDetailNote(this.noteInfo.note_id);
    if(!response || response.code !== 200){
      this.loading = false;
      this._toast.show('error', response.message);
      return;
    }
    this.loading = false;
    this.contentEditor = response.data.content;
  }

  /**
   * call api save
   * @returns 
   */
  async saveContent(){
    const param = {
      content: this.contentEditor
    }
    const response = await this._noteApiService.editNote(this.noteInfo.note_id, param);
    if(!response || response.code !== 200){
      this.isLoaded = false;
      this._toast.show('error', response.message);
      return;
    }
    this._toast.show('success', 'Lưu nội dung thành công');
    this.isLoaded = false;
  }

  /**
   * save content
   */
  handleOnClickSave(e: MouseEvent){
    this.isLoaded = true;
    this.saveContent();
  }

  /**
   * edit name, description
   */
  editNoteName(){
    const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbManagerNoteListEditComponent).create(this._injector);
    modalRef.instance.noteInfo = this.noteInfo;
    modalRef.instance.title = 'Sửa tên ghi chú';
    modalRef.instance.width = '550px';
    modalRef.instance.onNameChange.subscribe((data)=>{
      this.noteInfo.title = data.title;
      this.detectChanges();
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onClose.subscribe(() => {
      setTimeout(() => {
        this._domService.removeComponentFromBody(modalRef);
      }, 500);
    });
    this._domService.addDomToBody(modalRef);
  }

  /**
   * editor init done
   * @param event 
   */
  handleOnInitEditor(event: any){
    this.loadedEditor = true;
  }

}
