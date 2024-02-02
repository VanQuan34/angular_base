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

  override ngOnInit(): void {}

  handleOnChangeContent(e: any) {}
}
