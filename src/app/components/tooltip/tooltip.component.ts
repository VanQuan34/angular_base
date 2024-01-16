import {
  Component, Input, ViewChild, ElementRef, ComponentFactoryResolver, Injector, ChangeDetectorRef,
  OnInit, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, TemplateRef, Output, EventEmitter
} from '@angular/core';
import { AddComponentToBodyService } from '../../api/common/add-component-to-body.service';
import { MoWbTooltipContentComponent } from './content/content.component';
import { IAI } from './api/ai';

export const TOOLTIP_TYPE = {
  ICON: 'icon',
  TEXT: 'text',
  IMAGE: 'image',
  AI: 'ai',
  OTHER: 'other'
};

@Component({
  selector: 'mo-wb-components-tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class MoWbTooltipComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private isShow: boolean = false;
  private tooltipRef: any;
  private hasEvent: boolean = false;
  private isTooltipOver: boolean = false;
  private isElementOver: boolean = false;
  private timeOutTooltip: number;
  private timeOutLeave: any;
  private observableFromEvent: any;

  @Input() ignoreCaculatorMaxHeightContent: boolean = false;
  @Input() content: string;
  @Input() width: number;
  @Input() minWidth: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  @Input() classInclude: string;
  @Input() direction: string; // top, bottom, right, left
  @Input() iconClass: string;
  @Input() hasTooltip: boolean = false;
  @Input() imageSrc: string;
  @Input() clickAction: boolean = false;
  @Input() type: string;
  @Input() template: TemplateRef<any>;
  @Input() classIncludeTemplate!: string;
  @Input() contentAI: IAI;
  @Input() allowHover: boolean = false;
  @Input() maxContentWidth: number;
  @Input() whiteTheme: boolean;
  @Input() typeTextMouseenterOnlyShowTooltip: boolean = false;
  @Input() acceptDynamicDirection: boolean = false; // Tự động đẩy khối sang trái hoặc phải khi tooltip bị che.
  @Input() templateWithScroll: boolean = false; // Trường hợp truyền template ngoài có thanh scroll.
  @Input() delayTimeShow: number;
  @Input() noContentPadding: boolean = false;
  @Input() ignoreShowTooltip: boolean = false;
  @Input() ignoreArrow: string;
  @Input() zIndex: number;
  @Input() iconOverContent: boolean = false;
  @Input() isContentTooltipOver: boolean = false;
  @Input() isCheckWidthShowTooltipOnlyEllipsis: boolean = false; //check nếu có ellipse thì show tooltip theo width
  @Input() isCheckHeightShowTooltipOnlyEllipsis: boolean = false; //check nếu có ellipse thì show tooltip theo height

  @Output() onActions: EventEmitter<string> = new EventEmitter<string>();
  @Output() onRemoveTooltip: EventEmitter<string> = new EventEmitter<string>();
  @Output() onHoverMouse: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onHoverContentTooltipOver: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('icon') iconRef!: ElementRef;
  @ViewChild('image') imageRef!: ElementRef;

  constructor(
    public cdr: ChangeDetectorRef,
    private _bodyService: AddComponentToBodyService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private elementRef: ElementRef) {
    this.setDefaultValues();
    this.timeOutTooltip = 50;
    this.delayTimeShow = 0;
  }

  ngOnInit() {
    if (this.allowHover) {
      this.timeOutTooltip = 50;
    }
    this.init();
  }

  ngAfterViewInit() {
    const el = this.getElement();
    // if (el) {
    //   this.observableFromEvent = fromEvent(this.getElement(), 'mouseenter').subscribe((e: Event) => {
    //     if (this.type !== TOOLTIP_TYPE.TEXT || this.clickAction || !el) {
    //       this.observableFromEvent && this.observableFromEvent.unsubscribe();
    //       return;
    //     }

    //     const contentWidth = this.maxContentWidth || el.clientWidth;
    //     if (this.hasEvent) {
    //       if ((el.scrollWidth <= contentWidth) && !this.typeTextMouseenterOnlyShowTooltip) {
    //         this.handleOnMouseLeave(e);
    //         this.removeEvent();
    //         return;
    //       }
    //       return;
    //     }

    //     if ((el.scrollWidth <= contentWidth) && !this.typeTextMouseenterOnlyShowTooltip) {
    //       this.removeEvent();
    //       return;
    //     }

    //     el.addEventListener('mouseenter', this.handleOnMouseEnter, true);
    //     el.addEventListener('mouseleave', this.handleOnMouseLeave, true);
    //     this.hasEvent = true;
    //     this.handleOnMouseEnter();

    //     if (!this.content && this.content === '') {
    //       this.removeEvent();
    //     }
    //   });
    // }

    if (this.type === TOOLTIP_TYPE.TEXT || this.type === TOOLTIP_TYPE.OTHER) {
      setTimeout(() => {
        this.initEvent();
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      this.removeEvent();
    }
    if (changes['content'] || changes['contentAI'] || changes['template'] || changes['maxContentWidth'] || changes['type']) {
      setTimeout(() => {
        this.initEvent();
      }, 50);
    }
    if (!changes['classInclude']) {
      return;
    }
    const el = this.getElement();
    if (!el || !changes['classInclude'].currentValue) {
      return;
    }
    const previousValue = changes['classInclude'].previousValue;
    let className = el.className ? el.className : '';
    if (previousValue && previousValue.trim() && className) {
      while (className.includes(previousValue)) {
        className = className.replace(previousValue, '');
      }
    }
    el.className = `${className} ${changes['classInclude'].currentValue}`;
  }

  private setDefaultValues() {
    this.isShow = false;
    this.hasEvent = false;
    this.isTooltipOver = false;
    this.isContentTooltipOver = false;
    this.minWidth = 200;
    this.maxHeight = 10000;
    this.classInclude = '';
    this.iconClass = 'mo-icn-tooltips';
    this.hasTooltip = true;
    this.imageSrc = '';
    this.type = TOOLTIP_TYPE.ICON;
    this.typeTextMouseenterOnlyShowTooltip = false;
  }

  private init() {
    const el = this.getElement();
    switch (this.type) {
      case TOOLTIP_TYPE.TEXT:
        el.className = `${el.className} ${this.classInclude}`;
        if (this.hasTooltip) {
          el.className = `${el.className} mo-wb-ellipsis`;
          window.addEventListener('resize', this.handleOnResize, true);
        }
        return;
      case TOOLTIP_TYPE.OTHER:
        el.className = `${el.className} ${this.classInclude}`;
        return;
      case TOOLTIP_TYPE.AI:
        this.iconClass = 'mo-icn-AI';
        return;
      default:
        this.iconClass = this.iconClass ? this.iconClass : 'mo-icn-tooltips';
        return;
    }
  }

  private getElement() {
    switch (this.type) {
      case TOOLTIP_TYPE.TEXT:
        return this.elementRef && this.elementRef.nativeElement;
      case TOOLTIP_TYPE.OTHER:
        const component = this.elementRef.nativeElement.firstElementChild;
        return component || (this.elementRef && this.elementRef.nativeElement);
      case TOOLTIP_TYPE.ICON:
      case TOOLTIP_TYPE.AI:
        return this.iconRef && this.iconRef.nativeElement;
      case TOOLTIP_TYPE.IMAGE:
        return this.imageRef && this.imageRef.nativeElement;
      default:
        return this.elementRef && this.elementRef.nativeElement;
    }
  }

  initEvent() {
    const el = this.getElement();
    if (!el || !this.hasTooltip) {
      return;
    }
    if (this.type === TOOLTIP_TYPE.OTHER && !this.template && (!this.content || this.content === '')) {
      return;
    }
    if (this.type === TOOLTIP_TYPE.AI && (!this.contentAI || !this.contentAI.body)) {
      return;
    }
    const contentWidth = this.maxContentWidth || el.clientWidth;
    if (this.type === TOOLTIP_TYPE.TEXT && (el.scrollWidth <= contentWidth) && !this.typeTextMouseenterOnlyShowTooltip) {
      this.removeEvent();
      return;
    }
    if (el && !this.hasEvent) {
      if (this.clickAction) {
        el.addEventListener('click', this.handleOnClick);
        el.addEventListener('mouseenter', (e: any) => {
          this.isElementOver = true;
        });
        el.addEventListener('mouseleave', (e: any) => {
          this.isElementOver = false;
        });
      } else {
        el.addEventListener('mouseenter', this.handleOnMouseEnter, true);
        el.addEventListener('mouseleave', this.handleOnMouseLeave, true);
      }
      this.hasEvent = true;
    }

    if (!this.content && this.content === '') {
      this.removeEvent();
    }
  }

  handleDocumentClick = (e: any) => {
    if (!this.isTooltipOver && !this.isContentTooltipOver && !this.isElementOver) {
      this.removeTooltip();
    }
  }

  handleWindowScroll = (e: any) => {
    if (!this.isTooltipOver && !this.isContentTooltipOver) {
      this.removeTooltip();
    }
  }

  handleOnResize = (e: any) => {
    this.initEvent();
  }

  removeEvent() {
    if (!this.elementRef) {
      return;
    }
    const el = this.elementRef.nativeElement;
    el.removeEventListener('mouseenter', this.handleOnMouseEnter, true);
    el.removeEventListener('mouseleave', this.handleOnMouseLeave, true);
    el.removeEventListener('click', this.handleOnClick, true);
    window.removeEventListener('click', this.handleDocumentClick, true);
    window.removeEventListener('scroll', this.handleWindowScroll, true);
    this.hasEvent = false;
  }

  public setContent(content: string) {
    this.content = content;
    this.initEvent();
  }

  private handleOnClick = (e: any) => {
    if (this.clickAction) {
      this.onActions.emit('click');
    }
    this.handleOnMouseEnter(e);
  }

  private handleOnMouseEnter = (e?: any) => {
    const domEl = this.getElement();
    if((domEl.offsetWidth >= domEl.scrollWidth) && this.isCheckWidthShowTooltipOnlyEllipsis) {
      return;
    }
    if((domEl.offsetHeight >= domEl.scrollHeight) && this.isCheckHeightShowTooltipOnlyEllipsis) {
      return;
    }
    if (this.ignoreShowTooltip) {
      return;
    }
    this.onHoverMouse.emit(true);
    if (this.isShow) {
      if (this.clickAction) {
        setTimeout(() => {
          this.removeTooltip();
        }, 50);
      }
      return;
    }

    if (!domEl) {
      return;
    }
    const content = this.content ? this.content : domEl.innerHTML;
    this.isShow = true;
    const rect = domEl.getBoundingClientRect();

    const rect_copy = {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    };
    this.tooltipRef = this.componentFactoryResolver.resolveComponentFactory(MoWbTooltipContentComponent).create(this.injector);
    const instance = this.tooltipRef.instance;
    const { width, minWidth, maxWidth } = this;
    const contentWidth = width ? width : rect.width;
    if (contentWidth < minWidth && !width) {
      instance.autoWidth = true;
    }
    instance.width = contentWidth;
    instance.maxHeight = this.maxHeight;
    if (maxWidth) {
      instance.maxWidth = maxWidth;
      instance.autoWidth = true;
    }
    instance.type = this.type;
    instance.content = content;
    instance.template = this.template;
    instance.contentAI = this.contentAI;
    instance.allowHover = this.allowHover;
    instance.whiteTheme = this.whiteTheme;
    instance.direction = this.direction;
    instance.iconOverContent = this.iconOverContent;
    instance.acceptDynamicDirection = this.acceptDynamicDirection;
    instance.templateWithScroll = this.templateWithScroll;
    instance.ignoreCaculatorMaxHeightContent = this.ignoreCaculatorMaxHeightContent;
    instance.classIncludeTemplate = this.classIncludeTemplate || '';
    instance.noContentPadding = this.noContentPadding || '';
    instance.ignoreArrow = this.ignoreArrow;
    instance.zIndex = this.zIndex;
    instance.setPosition(rect_copy);
    instance.onMouseOver.subscribe((isOver: any) => {
      this.isTooltipOver = isOver;
      this.onHoverContentTooltipOver.emit(isOver);
      if (!this.isTooltipOver && !this.isContentTooltipOver && !this.clickAction) {
        this.removeTooltip();
      }
    });
    setTimeout(() => {
      this._bodyService.addDomToBody(this.tooltipRef);
      window.addEventListener('scroll', this.handleWindowScroll, true);
      window.addEventListener('click', this.handleDocumentClick, true);
    }, this.delayTimeShow);
  }

  handleOnMouseLeave = (event: any) => {
    this.onHoverMouse.emit(false);
    if (!this.elementRef) {
      return;
    }
    const domEl = this.getElement();
    if (!domEl) {
      return;
    }
    const e = event.toElement || event.relatedTarget;
    if (!event.target.contains(domEl) && domEl.contains(event.target)) {
      return;
    }
    setTimeout(() => {
      if (!this.isTooltipOver && !this.isContentTooltipOver) {
        this.removeTooltip();
      }
    }, this.timeOutTooltip);
  }

  removeTooltip = () => {
    if (this.tooltipRef) {
      this._bodyService.removeComponentFromBody(this.tooltipRef);
      this.tooltipRef = null;
      this.isShow = false;
      this.onRemoveTooltip.emit();
    }
  }

  removeTimeOut() {
    clearTimeout(this.timeOutLeave);
  }

  handlerShowTooltip() {
    if (this.tooltipRef) {
      return;
    }
    this.handleOnMouseEnter();
  }

  ngOnDestroy() {
    this.removeEvent();
    this.removeTooltip();
    this.observableFromEvent && this.observableFromEvent.unsubscribe();
    window.removeEventListener('resize', this.handleOnResize, true);
  }
}
