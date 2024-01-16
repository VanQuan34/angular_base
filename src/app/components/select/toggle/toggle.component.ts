import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, 
  ElementRef, Injector, Input, TemplateRef, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AddComponentToBodyService } from 'src/app/api/common/add-component-to-body.service';
import { ToastTranslateService } from 'src/app/api/common/toast-translate.service';
// import { CacheService } from 'src/app/api/common/cache.service';
import { TranslateService } from '@ngx-translate/core';
import { MoWbDetectionComponent } from '../../detection.component';
import { MoWbSelectTogglePopupComponent } from './popup/popup.component';


@Component({
  selector: 'mo-wb-components-select-toggle',
  templateUrl: 'toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbSelectToggleComponent extends MoWbDetectionComponent {

  height: number = 0;
  
  popupRef: ComponentRef<MoWbSelectTogglePopupComponent>;
  
  @Input() isShow: boolean = false;
  @Input() classInclude: string = '';
  @Input() zIndex: number = 2500;
  @Input() width: number = 184;
  @Input() pos: 'center' | 'left' | 'right' = 'center';
  @Input() templateSelect: TemplateRef<any>;
  @Input() templateContent: TemplateRef<any>;

  @ViewChild('selectEl') selectRef: ElementRef<HTMLElement>;

  constructor(
    public _domService: AddComponentToBodyService,
    public _injector: Injector,
    public _toast: ToastTranslateService,
    // public _cacheService: CacheService,
    public _translate: TranslateService,
    public _componentFactoryResolver: ComponentFactoryResolver,
    public override _changeDetection: ChangeDetectorRef
  ) {
    super(_changeDetection);
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && change['isShow']) {
      if (!this.isShow) {
        this.popupRef && this.popupRef.instance.close();
      }
    }
  }

  /**
   * open popup
   */
  openPopup() {
    this.popupRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbSelectTogglePopupComponent).create(this._injector);
    this.popupRef.instance.zIndex = this.zIndex + 50;
    this.popupRef.instance.toggleRef = this.selectRef.nativeElement;
    this.popupRef.instance.width = this.width;
    this.popupRef.instance.templateContent = this.templateContent;

    this.popupRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(this.popupRef);
      this.popupRef = null;
      this.isShow = false;
      this.detectChanges();
    });

    this._domService.addDomToBody(this.popupRef);
  }

  /**
   * close popup
   */
  close() {
    this.isShow = false;
    if (this.popupRef) {
      this.popupRef.instance.close();
    }
    this.detectChanges();
  }

  /**
   * handle on toggle select
   * @param event 
   */
  handleOnToggleSelect(event: MouseEvent) {
    event.stopPropagation();
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.openPopup();
      return;
    }

    this.popupRef && this.popupRef.instance.close();
    this.detectChanges();
  }

  /**
   * handle on mousedown
   * @param event 
   */
  handleOnMousedown(event: MouseEvent) {
    event.stopPropagation();
  }

}