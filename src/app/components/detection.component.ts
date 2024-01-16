
import { Component, OnInit, ChangeDetectorRef, ViewRef, Input } from '@angular/core';
@Component({
  template: "<div></div>",
})
export class MoWbDetectionComponent implements OnInit {

  @Input() top: number = 0;
  @Input() left: number = 0;

  constructor(
    public _changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  detectChanges() {
    if (this._changeDetection && !(this._changeDetection as ViewRef).destroyed) {
      this._changeDetection.detectChanges();
    }
  }

  ngOnDestroy() {

  }

  /**
   * handle on header mousedown
   * @param event 
   */
  handleOnActionMousedown(event: any) {
    // if (event.which === 3) {
    //   return;
    // }
    // this.startMovePos = {
    //   clientX: event.clientX,
    //   clientY: event.clientY,
    //   top: this.top,
    //   left: this.left
    // } 

    // $(document).on('mousemove', this.handleOnActionMousemove);
    // $(document).on('mouseup', this.handleOnActionMouseup);

    // $(this.frameDoc).on('mouseup', this.handleOnActionMouseup);
    // $(this.frameDoc).on('mousemove', this.handleOnActionFrameMousemove);

  }

  /**
   * handle on action iframe mousemove
   * @param e 
   */
  handleOnActionFrameMousemove = (e: any) => {
    // const event: any = {};
    // event.clientX = frameRect.left + e.clientX;
    // event.clientY = frameRect.top + e.clientY;
    // // console.log('handleOnFrameMousemove clientX=', event.clientX, ' left=', frameRect.left);
    // this.handleOnActionMousemove(event);
  }

  /**
   * handle on mousedown
   * @param e 
   */
  handleOnActionMousemove = (e: any) => {
    // const top = e.clientY - this.startMovePos.clientY + this.startMovePos.top;
    // const left = e.clientX - this.startMovePos.clientX + this.startMovePos.left;

    // this.top = top;
    // this.left = left;
    this.detectChanges();
  }

  /**
   * handle on mouseup
   * @param e 
   */
  handleOnActionMouseup = (e: any) => {
    // $(document).off('mousemove', this.handleOnActionMousemove);
    // $(document).off('mouseup', this.handleOnActionMouseup);

    // $(this.frameDoc).off('mouseup', this.handleOnActionMouseup);
    // $(this.frameDoc).off('mousemove', this.handleOnActionFrameMousemove);
  }


}
