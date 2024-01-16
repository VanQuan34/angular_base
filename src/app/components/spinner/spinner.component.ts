import {
  Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Input
} from '@angular/core';

@Component({
  selector: 'mo-wb-components-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class MoWbSpinnerComponent implements OnInit, AfterViewInit, OnDestroy {
  
  bw: string = '';

  @Input() size: 'l' | 'm' | 's' | 't' = 'l';
  @Input() isPri: boolean = true;
  @Input() width: string;
  @Input() height: string;
  @Input() left: string;

  constructor(protected _elementRef: ElementRef) {
    this.width = '100px';
    this.height = '100px';
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  /**
   * init data
   */
  initData() {
    switch(this.size) {
      case 'l':
        this.width = '64px';
        this.height = `64px`;
        this.bw = '5px';
        break;
      case 'm':
        this.width = '20px';
        this.height = `20px`;
        this.bw = '2px';
        break;
      case 's':
        this.width = '16px';
        this.height = `16px`;
        this.bw = '1.5px';
        break;
      case 't':
        this.width = '13px';
        this.height = `13px`;
        this.bw = '1.5px';
        break;
      default:
        break;
    }
  }

}
