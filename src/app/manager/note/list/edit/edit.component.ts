import { Component, Output, ViewChild, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MoWbInputComponent } from 'src/app/components/input/input.component';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { MoWbV4ModalComponent } from 'src/app/components/modal/v4/modal/modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ManagerNoteApiService } from 'src/app/api/note/noteApi';


@Component({
  selector: 'mo-wb-manager-note-list-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbManagerNoteListEditComponent extends MoWbV4ModalComponent{
  
  override isPending: boolean = false;

  @Input() noteInfo: any;
  @Input() override width: string;
  @Input() override title: string;
  @Input() override isHideMenu: boolean = true;
  
  @Output() override onClose = new EventEmitter<any>();
  @Output() onNameChange = new EventEmitter<any>()

  @ViewChild('input') inputName: MoWbInputComponent;
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
    return result;
  }

  /**
   * update site info
   * @returns 
   */
  async updateSite() {
    const params = {
      title: this.inputName.getValue(),
      description: this.inputDescription.getValue()
    }
    this.isPending = true;
    this.detectChanges();
    const response = await this._noteApiService.editNote(this.noteInfo.note_id, params);
    this.isPending = false;
    this.detectChanges();

    if(!response || response.code !== 200){
      this._toast.show('error', response.message);
      return;
    }
    this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
    this.onNameChange.emit(params);
  }

  /**
   * handle on edit button click
   * @param input 
   */
  handleOnClickEditName(event: MouseEvent) {
    if(!this.validate()){
      return;
    }
    this.updateSite();
  }
}
