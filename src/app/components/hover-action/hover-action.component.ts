import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoWbDetectionComponent } from '../detection.component';

@Component({
  selector: 'mo-wb-components-hover_action',
  templateUrl: './hover-action.component.html',
  styleUrls: ['./hover-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbHoverActionComponent extends MoWbDetectionComponent {
  
  @Input() classInclude: string = '';
  @Input() fixedShow: boolean = false;
  @Input() isShow: boolean = false;
  @Input() parentEl: HTMLElement;

  
  override ngAfterViewInit() {
    this.parentEl.addEventListener('mouseover', this.handleOnParentMouseover);
    this.parentEl.addEventListener('mouseout', this.handleOnParentMouseout);
    
  }

  override ngOnDestroy() {
    this.parentEl.removeEventListener('mouseover', this.handleOnParentMouseover);
    this.parentEl.removeEventListener('mouseout', this.handleOnParentMouseout);
  }

  // ngOnChanges(changes: SimpleChanges) {
  // }


  /**
   * handle on parent mouseover
   * @param e 
   */
  handleOnParentMouseover = (e: MouseEvent) => {
    e.stopPropagation();
    this.isShow = true;
    this.detectChanges();
  }

  /**
   * handle on parent mouseout
   * @param event 
   * @returns 
   */
  handleOnParentMouseout = (event: any) => {
    let e = event.toElement || event.relatedTarget;
    //check for all children levels (checking from bottom up)
    while (e && e.parentNode && e.parentNode != window) {
      if (e.parentNode == this.parentEl || e == this.parentEl) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      e = e.parentNode;
    }
    // hide menu
    this.isShow = false;
    this.detectChanges();
    return true;
  }

  /**
   * handle container click
   * @param event 
   */
  handleOnContainerClick(event: MouseEvent) {
    event.stopPropagation();
  }

}
