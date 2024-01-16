import { NgModule, Directive, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: 'MoWbClickOutside, [MoWbClickOutside], [clickOutside]'
})
export class MoWbClickOutsideDirective implements OnDestroy {
  @Output() clickOutside = new EventEmitter();
  @Output() clickInside = new EventEmitter();

  constructor(private _elementRef: ElementRef) {
    document.addEventListener('click', this.handlerClick, true);
  }

  private handlerClick = (e: Event) => {
    const clickedInside = this._elementRef.nativeElement.contains(e.target);
    if (clickedInside) {
      this.clickInside.emit({ stopPropagation: () => { } });
      return;
    }
    this.clickOutside.emit({ stopPropagation: () => { }, preventDefault: () => { }});
    

  }


  ngOnDestroy() {
    document.removeEventListener('click', this.handlerClick, true);
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MoWbClickOutsideDirective
  ],
  declarations: [
    MoWbClickOutsideDirective
  ]
})
export class MoWbClickOutsideModule { }
