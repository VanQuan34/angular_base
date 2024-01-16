import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef, HostListener
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../detection.component';

@Component({
  selector: 'mo-wb-components-v4-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class  MoWbV4ModalComponent extends MoWbDetectionComponent {
  
  isShow: boolean = false;
  fixMaxHeight: number;
  emitted = false;

  @Input() hasHeader: boolean = true;
  @Input() hasFooter: boolean = true;
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() maxWidth: string = '';
  @Input() minWidth: string = '';
  @Input() maxHeight: number;
  @Input() classInclude: string = '';
  @Input() zIndex: number = 5000;
  @Input() title: string = '';
  @Input() label: string = 'Đồng ý';
  @Input() isPending: boolean = false;
  @Input() disable: boolean = false;
  @Input() classIconRight: string = '';
  @Input() classIconLeft: string = '';
  @Input() type: string = 'pri';
  @Input() isButtonCancel: boolean = true;
  @Input() content: string = '';
  @Input() isHideMenu: boolean = false;
  @Input() defaultMaxHeight: number;
  @Input() level: number = 0;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onScrollEnd = new EventEmitter<any>();

  @ViewChild('container') containerEl: ElementRef;

  override ngOnInit(): void {
    this.zIndex = 2500 + this.level;
    // console.log('zIndex=', this.zIndex, ' level=', this.level);
    if (this.isHideMenu) {
      // $(document.body).css('background-color', 'transparent');
    }

    this.getDefaultMaxHeight();
    this.fixMaxHeight = this.defaultMaxHeight > this.maxHeight && this.maxHeight ? this.maxHeight : this.defaultMaxHeight;

    window.addEventListener('resize', this.handleOnWindowResize);
  }

  /**
   * handle on after view init
   */
  override ngAfterViewInit(): void {
    this.show();
  }

  override ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleOnWindowResize);
  }

  /**
   * show modal
   */
  show() {
    this.isShow = true;
    this.detectChanges();
  }

  /**
   * close popup
   */
  close(isNotShowMenu: boolean = false) {
    this.isShow = false;
    this.detectChanges();
    this.onClose.emit({});

    if (this.isHideMenu && !isNotShowMenu) {
      setTimeout(() => {
        // $(document.body).css('background-color', '');
      }, 150);
    }
  }

  /**
   * get default max height
   */
  getDefaultMaxHeight() {
    this.defaultMaxHeight =  window.innerHeight - 102 - 80;
  }

  /**
   * handle on close click
   * @param event 
   */
  handleOnCloseClick(event: MouseEvent) {
    this.close();
  }

  /**
   * handle on cancel click
   * @param event 
   */
  handleOnCancelClick(event: MouseEvent) {
    this.close();
  }

  /**
   * handle on ok button click
   * @param event 
   */
  handleOnOkClick(event: MouseEvent) {
    this.onOk.emit({});
  }

  /**
   * handle on close modal
   */
  handleOnCloseModal() {
    this.close();
  }

  /**
   * handle on window resize
   * @param e 
   */
  handleOnWindowResize = (e: any) => {
    this.getDefaultMaxHeight();
    this.fixMaxHeight = this.defaultMaxHeight >  this.maxHeight && this.maxHeight ? this.maxHeight : this.defaultMaxHeight;
    this.detectChanges();
  }

  // /**
  //  * handle on header mousedown
  //  * @param event 
  //  */
  // handleOnHeaderMousedown(event: any) {
  //   if (event.which === 3) {
  //     return;
  //   }
  //   this.startMovePos = {
  //     clientX: event.clientX,
  //     clientY: event.clientY,
  //     top: this.top,
  //     left: this.left
  //   } 

  //   $(document).on('mousemove', this.handleOnMousemove);
  //   $(document).on('mouseup', this.handleOnMouseup);
  // }

  // /**
  //  * handle on mousedown
  //  * @param e 
  //  */
  // handleOnMousemove = (e: any) => {
  //   const top = e.clientY - this.startMovePos.clientY + this.startMovePos.top;
  //   const left = e.clientX - this.startMovePos.clientX + this.startMovePos.left;

  //   this.top = top;
  //   this.left = left;
  //   this.detectChanges();
  // }

  // /**
  //  * handle on mouseup
  //  * @param e 
  //  */
  // handleOnMouseup = (e: any) => {
  //   $(document).off('mousemove', this.handleOnMousemove);
  //   $(document).off('mouseup', this.handleOnMouseup);
  // }

  handleOnScroll(event: any){
    if(this.emitted){
      return
    }
    if (!this.checkScrollToBottom()) {
      return;
    }
    this.onScrollEnd.emit();
    this.emitted = true;
    console.log('scroll end')
  }

  /*
   * check scroll to bottom
   */
  checkScrollToBottom() {
    const containerEl = this.containerEl.nativeElement;
    // console.log('containerEl).scrollTop()=', $(containerEl).scrollTop(), $(containerEl).innerHeight(), containerEl.scrollHeight)
    if($(containerEl).scrollTop() + $(containerEl).innerHeight() > containerEl.scrollHeight - 5) {
      // console.log('scroll reach to bottom');
      return true;
    }
    return false;
  }
}
