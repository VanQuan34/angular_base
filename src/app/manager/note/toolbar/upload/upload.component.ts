import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Injector, Input, EventEmitter, Output, ViewChild } from "@angular/core";
import { MoWbV4ModalComponent } from "src/app/components/modal/v4/modal/modal.component";
import { ToastTranslateService } from "src/app/api/common/toast-translate.service";
import { AddComponentToBodyService } from "src/app/api/common/add-component-to-body.service";
import { MoWbSelectComponent } from "src/app/components/select/select.component";
import { MoWbInputComponent } from "src/app/components/input/input.component";
import { MoWbFileUploadV4Component } from "src/app/components/upload/file-upload-v4/file-upload.component";
import { ICategoryItem } from "../../category/category.component";
import { ManagerNoteApiService } from "src/app/api/note/noteApi";
import { TranslateService } from "@ngx-translate/core";

declare var IntegrateMicroSites: any;

@Component({
  selector: 'mo-wb-manager-note-toolbar-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoWbManagerNoteToolbarUploadComponent extends MoWbV4ModalComponent {

  loading: boolean = false;
  siteName: string = '';
  categoryId: string;
  file: File;
  contentFileTxt: string;

  @Input() override zIndex: number;
  @Input() categoryList: ICategoryItem[];
  @Input() override isHideMenu: boolean = true;
  
  @Output() onAddFolder = new EventEmitter<ICategoryItem>;
  @Output() onAddNewSite = new EventEmitter<any>();
  @Output() onCreateNote = new EventEmitter<any>()
  
  @ViewChild('input') inputName: MoWbInputComponent;
  @ViewChild('select') selectFolder: MoWbSelectComponent;
  @ViewChild('upload') upload!: MoWbFileUploadV4Component;

  constructor(
    private _toast: ToastTranslateService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    public override _changeDetection: ChangeDetectorRef,
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    private _noteApiService: ManagerNoteApiService,
    private _translate: TranslateService,
    // private _router: Router,
  ) {
    super(_changeDetection)
  }

  handleError(event: any) {
    console.log('validation file upload fail:', event);

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
    if (!this.file || this.file.type !== 'text/plain') {
      result = false;
    }
    return result;
  }

  /**
    * handle on select category
    * @param category 
    */
  handleOnSelectCategory(category: any) {
    this.categoryId = category[0].category_id;
  }

  async handleOnClickUploadAddSite(event: any) {
    
    if (!this.validate()) {
      return;
    }
    this.loading = true;
    this.detectChanges();
    this.createNote();
  }
  
  handleOnFileChanged(event: any) {
    this.file = event[0];
    console.log('this.file==', this.file);
    this.detectChanges();
  }

  createNote() {
    let contentFile;
    // console.log('contentFile=',this.file,  typeof contentFile, contentFile);
    var reader = new FileReader();
    reader.readAsText(this.file, "UTF-8");
    reader.onload = (evt) => { 
      this.contentFileTxt = evt.target.result as string;
      this.callCreateNote();
    }
  }

  async callCreateNote(){
    const params = {
      title: this.inputName.getValue().trim(),
      description: 'Tải lên từ file',
      category_id: this.categoryId,
      content: this.contentFileTxt
    }
    this.loading = true;
    this.detectChanges();
    const response = await this._noteApiService.createNote(params);

    if(!response || response.code !== 200){
      this._toast.show('error', response.message);
      this.loading = false;
      this.detectChanges();
      return;
    }
    this.loading = false;
    this.detectChanges();
    this._toast.show('success', this._translate.instant('i18n_notification_manipulation_success'));
    this.onCreateNote.emit(response.data);
  }


  /**
 * handle input error
 * @param e 
 */
  handleErrorInputName(e: boolean) {
    // this.siteName = '';
  }


  /**
   * set value name site
   * @param value 
   */
  handleOnNameValueChange(value: string) {
    this.siteName = value;
    this.detectChanges();
  }

  /**
 * handle quick add folder
 * @param $event 
 */
  handleOnAddNewFolder(event: ICategoryItem) {
    // const modalRef = this._componentFactoryResolver.resolveComponentFactory(MoWbLandingV4SitesFolderAddComponent).create(this._injector);
    // modalRef.instance.zIndex = this.zIndex + 50;
    // modalRef.instance.width = '550px';
    // modalRef.instance.title = 'Tạo Landing Page';

    // modalRef.instance.onClose.subscribe((event: any) => {
    //   this._domService.removeComponentFromBody(modalRef);
    //   this.detectChanges();
    // });
    // modalRef.instance.onAddFolder.subscribe((folder: ICategoryItem) => {
    //   this.categoryList.unshift(folder);
    //   this.onAddFolder.emit(folder);
    //   this._domService.removeComponentFromBody(modalRef);
    // });

    // this._domService.addDomToBody(modalRef);
  }


}