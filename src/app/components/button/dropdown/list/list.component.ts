import { Component, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { MoWbButtonBaseDropdownComponent } from '../base-dropdown.component';
import { DomHandlerService } from '../../../../api/common/dom-handler.service';

@Component({
  selector: 'mo-wb-components-button-dropdown-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MoWbButtonDropdownListComponent extends MoWbButtonBaseDropdownComponent implements AfterViewInit, OnDestroy {
  rectTarget: any;

  @Input() listWidth: number;

  @Output() onLeaveContentElEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() onMoveContentElEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('content') content: ElementRef;

  constructor(private _domHandlerService: DomHandlerService) {
    super();
  }

  ngAfterViewInit() {
    this.setPosition();
  }


  setPosition() {
    const viewPort = this._domHandlerService.getViewport();
    const contentNativeEl = this.content.nativeElement;
    const rectContent = contentNativeEl.getBoundingClientRect();
    let topContent = this.rectTarget.top + 28;
    const grandHeightViewPort = topContent + rectContent.height - viewPort.height;
    if (this.listPosition === 'above' || grandHeightViewPort > 0) {
      topContent = this.rectTarget.top - rectContent.height;
    }

    let widthContent: number = parseInt(`${this.listWidth}`, 10);
    if (widthContent <= this.rectTarget.width) {
      widthContent = this.rectTarget.width;
    }
    contentNativeEl.style.width = `${widthContent}px`;
    contentNativeEl.style.top = `${topContent}px`;
    if ((widthContent + this.rectTarget.left) < viewPort.width || !widthContent) {
      return contentNativeEl.style.left = `${this.rectTarget.left}px`;
    }
    contentNativeEl.style.left = `${this.rectTarget.left - (widthContent - this.rectTarget.width)}px`;
  }

  selectItem(e: Event, item: any) {
    e.stopPropagation();
    this.onSelectItem.emit(item);
  }

  clickIconRight(e: Event, item: any) {
    e.stopPropagation();
    if (typeof item.handleClickIconRight === 'function') {
      item.handleClickIconRight();
      this.onLeaveContentElEvent.emit(true);
    }
  }

  handlerMouseenter(e: Event) {
    e.stopPropagation();
    this.onMoveContentElEvent.emit(true);
  }

  handlerMouseleave(e: Event) {
    e.stopPropagation();
    this.onLeaveContentElEvent.emit(true);
  }

  ngOnDestroy() {
    this.onSelectItem.unsubscribe();
    this.onLeaveContentElEvent.unsubscribe();
  }

}
