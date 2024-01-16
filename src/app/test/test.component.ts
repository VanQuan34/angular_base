import { Component, OnInit, ChangeDetectorRef, ViewRef, ViewChild, Injector, ComponentFactoryResolver } from '@angular/core';
// import { extend } from 'lodash';
import { MoWbDetectionComponent } from '../components/detection.component';
import { IMenuSelectItem } from '../components/select/menu/menu.component';
import { MoWbSelectToggleComponent } from '../components/select/toggle/toggle.component';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbV4ModalComponent } from '../components/modal/v4/modal/modal.component';
import { MoWbTestModalTest1Component } from '../components/test/modal/test1/test1.component';
import { IValidRequired } from '../components/upload/file-upload-v4/file-upload.component';
import { MoWbModalV4ConfirmComponent } from '../components/modal/v4/confirm/confirm.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent extends MoWbDetectionComponent{
  menuItems: IMenuSelectItem[] = [];
  menu2Items: IMenuSelectItem[] = [];
  testEls: any[] = [1,2];
  toggleContentItems: any[] = [];
  dueDate: any;
  // dateRange: IDateRange;

  validRequired: IValidRequired;

  @ViewChild('selectToggle') selectToggle: MoWbSelectToggleComponent;

  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(_changeDetection);
  }

  override ngOnInit() { 
    // this.dueDate = moment().format('DD/MM/YYYY') + ' 23:59:59';
    // this.dueDate = '';

    this.menuItems = [
      {
        id: 'edit-site',
        name: 'Chỉnh sửa trang',
        divider: true,
        icon: 'mo-icn-edit'
      },
      {
        id: 'report',
        name: 'Báo cáo',
        divider: true,
        icon: 'mo-icn-report'
      },
      {
        id: 'edit-name',
        name: 'Sửa tên trang',
        divider: true,
        icon: 'mo-icn-editor-color-text'
      },
      {
        id: 'preview',
        name: 'Xem trước trang',
        divider: true,
        icon: 'mo-icn-eye-outline'
      },
      {
        id: 'copy',
        name: 'Sao chép trang',
        divider: true,
        icon: 'mo-icn-copy'
      },
      {
        id: 'export',
        name: 'Xuất trang .mopage',
        divider: true,
        icon: 'mo-icn-download-outline'
      },
      {
        id: 'pending',
        name: 'Ngừng xuất bản',
        divider: true,
        icon: 'mo-icn-alert-triangle-outline'
      },
      {
        id: 'move',
        name: 'Chuyển folder',
        divider: true,
        icon: 'mo-icn-move-to-folder'
      },
      {
        id: 'remove',
        name: 'Xoá trang',
        divider: false,
        icon: 'mo-icn-remove'
      },
    ];

    this.menu2Items = [
      {
        id: 'edit-name',
        name: 'Sửa tên folder',
        divider: true,
        icon: 'mo-icn-editor-color-text'
      },
      {
        id: 'remove',
        name: 'Xoá folder',
        divider: false,
        icon: 'mo-icn-remove'
      }
    ];

    this.toggleContentItems = [
      {
        icon: 'mo-icn-report',
        title: 'Sử dụng trang trắng',
        sub: 'Tự thiết kế Landing Page theo ý tưởng của bạn'
      },
      {
        icon: 'mo-icn-dashboard-outline',
        title: 'Sử dụng giao diện mẫu',
        sub: 'Sử dụng các giao diện đã có trong thư viện của chúng tôi'
      },
      {
        icon: 'mo-icn-dashboard-outline',
        title: 'Tải file lên',
        sub: 'Sử dụng file thiết kế sẵn có đuôi “.html” “.mopage” từ máy tính của bạn'
      },
    ]

    this.validRequired = {
      message: "Valid Text",
      isRequired: true
    }

  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() {

  }

  selectedDate(event: any) {
    console.log('event multiple date:', event);
  }

  handleOnSelectMenuItem(menuItem: IMenuSelectItem) {
    console.log('menuItem=', menuItem);
  }

  handleOnToggleItemClick(item: any) {
    console.log('handleOnToggleItemClick item=',item);
    this.selectToggle.close();
  }

  /**
   * open modal 1
   * @param event 
   */
  handleOnOpenModal1Click(event: MouseEvent) {
    const zIndex = 2500;
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbTestModalTest1Component).create(this._injector);
    modalRef.instance.zIndex = zIndex + 50;
    modalRef.instance.width = '450px';
    modalRef.instance.title = 'Test modal tý thôi 123'

    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });
    
    this._domService.addDomToBody(modalRef);
  }


  handleShowModal(event: any, type: any){
    const zIndex = 2500;
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbModalV4ConfirmComponent).create(this._injector);
    modalRef.instance.type = type;
    modalRef.instance.title = 'Custom title';
    modalRef.instance.desc = 'Custom description';
    modalRef.instance.zIndex = zIndex;

    modalRef.instance.label = 'Custom label';
    modalRef.instance.label1 = 'Custom label 1';

    modalRef.instance.content = 'Custom content custom content custom contentcustom content <br> custom contentcustom contentcustom contentcustom content'
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
      this.detectChanges();
    });
    
    this._domService.addDomToBody(modalRef);
  }

  handleOnTimePick(event: any) {
    console.log('date picker event:', event);
  }
}
