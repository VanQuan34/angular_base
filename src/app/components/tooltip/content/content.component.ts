import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { IAI } from '../api/ai';

@Component({
  selector: 'mo-wb-components-tooltip-content',
  templateUrl: 'content.component.html',
  styleUrls: ['./content.component.scss']
})
export class MoWbTooltipContentComponent implements OnInit, AfterViewInit {
  @Input() ignoreCaculatorMaxHeightContent: boolean = false;
  @Input() content!: string;
  @Input() width!: number;
  @Input() maxWidth!: number;
  @Input() autoWidth: boolean = false;
  @Input() maxHeight!: number;
  @Input() template!: TemplateRef<any>;
  @Input() classIncludeTemplate!: string;
  @Input() contentAI!: IAI;
  @Input() allowHover: boolean = false;
  @Input() direction!: string; // top, bottom, right, left
  @Input() clickAction: boolean = false;
  @Input() whiteTheme: boolean = false;
  @Input() acceptDynamicDirection: boolean = false;
  @Input() templateWithScroll: boolean = false;
  @Input() zIndex: number;
  @Input() noContentPadding: boolean = false;
  @Input() type!: string;
  @Input() iconOverContent: boolean = false;
  @Input() ignoreArrow!: string;

  @Output() onMouseOver: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;

  private rect: any;
  public top!: number;
  public left!: number;
  public arrowLeft!: number;
  public arrowTop!: number;
  public opacity!: number;
  public bottom!: number;
  public isAI!: boolean;
  public isTemplate!: boolean;
  private hasScroll!: boolean;

  constructor(private elementRef: ElementRef) {
    this.setDefaultValues();
    this.zIndex = 500000000;
  }

  ngOnInit() {
    if (this.contentAI) {
      this.isAI = true;
    }
    if (this.template) {
      this.isTemplate = true;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkDirection();
      this.updateLeftPos();
      this.updateTopPos();
      this.calcMaxHeight();
      this.checkScroll();
    }, 0);
  }

  private updateLeftPos() {
    let width = this.width;
    if (this.container && (this.autoWidth || this.isAI)) {
      width = this.container.nativeElement.offsetWidth;
    }
    if (width) {
      switch (this.direction) {
        case 'right':
          this.left = this.rect.left + this.rect.width + 15;
          this.arrowLeft = this.left - 10;
          if (this.whiteTheme) {
            this.left += 5;
            this.arrowLeft = this.arrowLeft + 7;
          }
          break;
        case 'left':
          this.left = this.rect.left - width - 15;
          this.arrowLeft = this.left + width;
          if (this.whiteTheme) {
            this.left -= 5;
            this.arrowLeft = this.arrowLeft - 7;
          }
          if (this.templateWithScroll) {
            this.arrowLeft = this.arrowLeft + 12;
          }
          break;
        default:
          this.left = this.rect.left + this.rect.width / 2 - width / 2;
      }
    }
    this.left = Math.min(window.innerWidth - width - 10, Math.max(10, this.left));
    this.arrowLeft = Math.min(window.innerWidth - 20 - 20, Math.max(10, this.arrowLeft));
  }

  private updateTopPos() {
    if (this.direction === 'bottom') {
      this.bottom = 0;
      this.top = this.rect.bottom + (this.type === 'icon' || this.type === 'image' ? 15 : 15);
      if (this.ignoreArrow) {
        this.top -= 15;
      }
      this.arrowTop = this.top ? (this.top - 10) : 0;
      if (this.whiteTheme) {
        this.top += 5;
        this.arrowTop = this.top ? (this.top - 7) : 0;
      }
      return;
    }
    const height = this.container && this.container.nativeElement.offsetHeight;
    if (height && (this.direction === 'right' || this.direction === 'left')) {
      this.top = this.rect.top + this.rect.height / 2 - height / 2;
      this.bottom = 0;
      this.arrowTop = this.rect.top + this.rect.height / 2 - 10;
      return;
    }
    this.arrowTop = this.top ? (this.top - 10) : 0;

    this.bottom = window.innerHeight - this.rect.top + (this.type === 'icon' || this.type === 'image' ? 15 : 15);
    if (this.whiteTheme) {
      this.bottom = window.innerHeight - this.rect.top + 18;
      if (this.ignoreArrow) {
        this.bottom -= 15;
      }
      this.arrowTop = this.top ? (this.top - 20) : 0;
    }
  }

  private calcMaxHeight() {
    if (this.ignoreCaculatorMaxHeightContent) {
      return;
    }
    const topHeight = this.direction === 'bottom' ? window.innerHeight - this.rect.bottom - 80 : this.rect.top - 80;
    this.maxHeight = Math.min(topHeight, this.maxHeight);
    this.maxHeight = Math.max(this.maxHeight, 80);
  }

  private checkDirection() {
    if (this.direction) {
      return;
    }
    const height = this.container?.nativeElement.offsetHeight;
    if (!height || !this.rect) {
      return;
    }
    if (this.calcDynamicDirection()) {
      return;
    }
    if (height + 60 > this.rect.top) {
      this.top = this.rect.bottom + 15;
      this.bottom = 0;
      this.direction = 'bottom';
      return;
    }
  }

  private checkScroll() {
    this.opacity = 1;
    if (this.template || this.allowHover) {
      this.hasScroll = true;
      return;
    }
    const scrollHeight = this.container?.nativeElement.scrollHeight;
    if (scrollHeight > this.maxHeight) {
      this.hasScroll = true;
    }
  }

  private setDefaultValues() {
    this.content = '';
    this.autoWidth = false;
    this.left = 0;
    this.maxHeight = 10000;
    this.maxWidth = 10000;
    this.hasScroll = false;
    this.opacity = 0;
  }

  public setPosition(rect: any) {
    if (this.width && !this.autoWidth) {
      this.left = rect.left - (this.width - rect.width) / 2;
    } else {
      this.left = -500;
    }
    this.rect = rect;
    this.arrowLeft = rect.left - (20 - rect.width) / 2;
    this.updateLeftPos();
    this.updateTopPos();
  }

  private calcDynamicDirection(): any {
    if (!this.acceptDynamicDirection) {
      return;
    }
    const height = this.container?.nativeElement.offsetHeight;
    const rectBlock = this.container?.nativeElement.getBoundingClientRect();
    if (rectBlock.bottom + height + 60 < window.innerHeight || height + 60 < this.rect.top) {
      return;
    }
    if (this.rect.top > height) {
      return this.direction = 'top';
    }
    if (rectBlock.width + this.rect.right + 15 > window.innerWidth) {
      return this.direction = 'left';
    }
    return this.direction = 'right';

  }

  public getArrowClass() {
    if (this.direction === 'right') {
      return 'mo-tooltip-content-arrow-right';
    }
    if (this.direction === 'left') {
      if (this.acceptDynamicDirection) {
        return `mo-tooltip-content-border-left`;
      }
      return 'mo-tooltip-content-arrow-left';
    }
    if (this.top) {
      return 'mo-tooltip-content-arrow-up';
    }
    if (this.bottom) {
      return 'mo-tooltip-content-arrow-down';
    }
    return 'mo-tooltip-content-arrow-down';
  }

  handleOnMouseEnter($event: any) {
    $event.stopPropagation();
    this.onMouseOver.emit(true);
  }

  handleOnMouseLeave($event: any) {
    $event.stopPropagation();
    this.onMouseOver.emit(false);
  }
}
