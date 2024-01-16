import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter } from "@angular/core";
import { MoWbV4ModalComponent } from "../../v4/modal/modal.component";
import { ToastTranslateService } from "src/app/api/common/toast-translate.service";

@Component({
  selector: 'mo-wb-components-modal-v4-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['../modal/modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbModalV4ConfirmComponent extends MoWbV4ModalComponent {
  
  @Input() loading: boolean = false;
  @Input() override type: 'SUCCESS' | 'SUCCESS1' | 'ERROR' | 'WARNING1' | 'WARNING2' = 'SUCCESS';
  @Input() override title: string = '';
  @Input() desc: string = '';
  @Input() label1: string = '';
  @Input() needClose: boolean = true;
  @Input() override isHideMenu: boolean = false;

  
  @Output() onOkButton1 = new EventEmitter<any>();
  @Output() onOkButton2 = new EventEmitter<any>();

  constructor(
    private _toast: ToastTranslateService,
    public override _changeDetection: ChangeDetectorRef,
  ) {
    super(_changeDetection)
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.zIndex = 2500;
    this.detectChanges();
  }

  /**
   * set loading
   * @param loading 
   */
  setLoading(loading: boolean) {
    this.loading = loading;
    this.detectChanges();
  }

  /**
   * handle on ok button click
   * @param event 
   */
  handleOnOk(event: MouseEvent) {
    this.onOk.emit();

    if (this.needClose) {
      this.close();
    } 
  }

  /**
   * handle on cancel button click
   * @param event 
   */
  handleOnCancel(event: MouseEvent) {
    this.close();
  }

  /**
   * handle on ok button1 click
   * @param event 
   */
  handleOnOkButton1(event: MouseEvent) {
    this.onOkButton1.emit({});
    if (this.needClose) {
      this.close();
    } 
  }
  
  /**
   * handle on ok button2 click
   * @param event 
   */
  handleOnOkButton2(event: MouseEvent) {
    this.onOkButton2.emit({});
    if (this.needClose) {
      this.close();
    } 
  }



}
