import { Component, OnInit, Input, EventEmitter, Output, ComponentRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MoWbButtonBaseDropdownComponent } from './base-dropdown.component';
import { MoWbButtonDropdownListComponent } from './list/list.component';
import { AddComponentToBodyService } from '../../../api/common/add-component-to-body.service';

@Component({
  selector: 'mo-wb-components-button-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends MoWbButtonBaseDropdownComponent implements OnInit, OnDestroy {

  private contentDropdownComponent: ComponentRef<MoWbButtonDropdownListComponent>;
  private isShow: boolean;
  private timeoutLeaveContent: any;
  private timeoutLeaveButton: any;

  @Input() disable: boolean;
  @Input() classIconRight: string;
  @Input() classIconLeft: string;
  @Input() typeButton: string;
  @Input() listWidth: number;
  @Input() demoMode: string;

  @Output() onHover: EventEmitter<boolean> = new EventEmitter();
  @Output() onApply: EventEmitter<any> = new EventEmitter(); // sử dụng cho bấm button left chế độ applyNow = false;

  @ViewChild('buttonDropdown') buttonDropdown: ElementRef;

  constructor(private _addComponentDynamic: AddComponentToBodyService) {
    super();
    this.typeButton = 'blue-solid';
    this.classIconRight = 'mo-icn-Sort-descend';
    this.classIconLeft = '';
    this.listWidth = 200;
    this.fieldClass = 'class';
    this.fieldClassIconLeft = 'classIconLeft';
  }

  ngOnInit() {

    if (this.demoMode === 'unApplyNow') {
      this.keyField = 'id';
      this.keySelected = '1';
      this.fieldDisplay = 'label';
      this.applyNow = false;
      this.items = [{
        label: 'lựa chọn 1',
        id: '1',
        class: 'mo-wb-color-pri'
      },
      {
        label: 'lựa chọn 2',
        id: '2',
        class: 'mo-wb-color-29c7cc'
      },
      {
        label: 'lựa chọn 3',
        id: '3',
        class: 'mo-wb-color-6fd100'
      }];
      return;
    }

    if (this.demoMode === 'applyNow') {
      this.label = 'Lựa chọn';
      this.fieldDisplay = 'label';
      this.applyNow = true;
      this.fieldClass = 'class';

      this.items = [{
        label: 'lựa chọn 1',
        id: '1',
        class: 'mo-wb-color-pri'
      },
      {
        label: 'lựa chọn 2',
        id: '2',
        class: 'mo-wb-color-29c7cc'
      },
      {
        label: 'lựa chọn 3',
        id: '3',
        class: 'mo-wb-color-6fd100'
      }];
      return;
    }
  }

  onClickButton(e: MouseEvent, buttonLeft: boolean) {
    const rect = this.buttonDropdown.nativeElement.getBoundingClientRect();
    if (buttonLeft && !this.applyNow) {
      this.removeContent();
      const data = this.items.find(item => item[this.keyField] === this.keySelected);
      this.onApply.emit(data);
      return;
    }

    if (!this.isShow) {
      this.isShow = true;
      this.contentDropdownComponent = this._addComponentDynamic.resolveComponentFactory(MoWbButtonDropdownListComponent);
      const instance = this.contentDropdownComponent.instance;
      this.setValueContentComponent(instance, rect);
      this._addComponentDynamic.addDomToBody(this.contentDropdownComponent);
      instance.onSelectItem.subscribe(data => {
        if (!this.applyNow) {
          this.keySelected = data[this.keyField];
        }
        this.removeContent();
        this.onSelectItem.emit(data);
        this.onHover.emit(false);
      });

      instance.onLeaveContentElEvent.subscribe(_ => {
        this.timeoutLeaveContent = setTimeout(() => {
          this.removeContent();
          this.onHover.emit(false);
        }, 0);
      });

      instance.onMoveContentElEvent.subscribe(_ => {
        clearTimeout(this.timeoutLeaveButton);
        this.onHover.emit(true);
      });
      return;
    }
    this.removeContent();
  }

  private setValueContentComponent(instance: MoWbButtonDropdownListComponent, rect: any) {
    instance.label = this.label;
    instance.items = this.items;
    instance.applyNow = this.applyNow;
    instance.fieldDisplay = this.fieldDisplay;
    instance.fieldClassIconLeft = this.fieldClassIconLeft;
    instance.keyField = this.keyField;
    instance.keySelected = this.keySelected;
    instance.fieldClass = this.fieldClass;
    instance.rectTarget = rect;
    instance.listWidth = this.listWidth;
    instance.listPosition = this.listPosition;
  }

  private removeContent() {
    clearTimeout(this.timeoutLeaveContent);
    clearTimeout(this.timeoutLeaveButton);
    this.isShow = false;
    this._addComponentDynamic.removeComponentFromBody(this.contentDropdownComponent);
  }

  handlerMouseenter(e: Event) {
    e.stopPropagation();
    clearTimeout(this.timeoutLeaveContent);
    this.onHover.emit(true);
  }

  handlerMouseleave(e: Event) {
    e.stopPropagation();
    this.timeoutLeaveButton = setTimeout(() => {
      this.removeContent();
      this.onHover.emit(false);
    }, 0);
  }

  ngOnDestroy() {
    this.removeContent();
  }

}
