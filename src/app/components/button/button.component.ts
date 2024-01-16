import {
  Component, OnInit, Input, TemplateRef, EventEmitter, ViewChild,
  Output, ElementRef, OnDestroy, OnChanges, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'mo-wb-components-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges, OnDestroy {
  public class: string = '';
  spinnerWidth: number = 0;

  @Input() type: 'pri' | 'sed' | 'third' | 'outline' | 'link' | 'link-red' | 'red' | 'yellow' | 'green' 
    | 'icon' | 'icon-pri' | 'icon-sed' | 'icon-third' | 'icon-red' | 'icon-outline' 
    | 'icon-link' | 'icon-sed' | 'icon-yellow'| 'text-pri' | any = 'pri';
  @Input() size: 'l' | 'm' | 's' = 's';
  @Input() spinnerSize: 'l' | 'm' | 's' | 't' = 's';
  @Input() spinnerPri: boolean = true;
  @Input() label: string = '';
  @Input() disable: boolean = false;
  @Input() isPending: boolean = false;
  @Input() classInclude: string;
  @Input() classIconLeft: string;
  @Input() classIconRight: string;
  @Input() classIcon: string | undefined;
  @Input() classLabel: string;
  @Input() tooltipContent: string = '';
  @Input() timeHideTooltipOnMouseout: number;
  @Input() maxWidthTooltip: number = 0;
  @Input() maxHeightTooltip: number = 0;
  @Input() templateOutlet!: TemplateRef<any>;
  @Input() direction: string = '';
  @Input() noContentTooltipPadding: boolean = false;
  @Input() ignoreCaculatorMaxHeightTooltipContent: boolean = false;

  @Output() onPropsEle: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('buttonEl') buttonEl!: ElementRef;

  constructor(
  ) {
    this.classLabel = '';
    this.classInclude = '';
    this.classIconLeft = '';
    this.classIconRight = '';
    this.timeHideTooltipOnMouseout = 50;
  }

  ngOnInit() {
    this.setClassButton();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && (change['type'] || change['size'])) {
      this.setClassButton();
    }
  }

  private setClassButton() {
    let btnSizeIconClass = '';
    let btnSizeClass = '';
    let fontClass = 'mo-wb-f-b1';
    switch (this.size) {
      case 'l':
        btnSizeIconClass = 'mo-wb-btn-i-sl'
        btnSizeClass = 'mo-wb-btn-sl';
        fontClass = 'mo-wb-f-h2';
        this.spinnerSize = 'm';
        this.spinnerWidth = 64;
        break;
      case 'm':
        btnSizeIconClass = 'mo-wb-btn-i-sm';
        btnSizeClass = 'mo-wb-btn-sm';
        fontClass = 'mo-wb-f-h2';
        this.spinnerSize = 's';
        this.spinnerWidth = 20;
        break;
      case 's':
        btnSizeIconClass = 'mo-wb-btn-i-ss';
        btnSizeClass = 'mo-wb-btn-ss';
        fontClass = 'mo-wb-f-b1';
        this.spinnerSize = 's';
        this.spinnerWidth = 16;
        break;
      default:
        break;
    }
    this.class = `mo-wb-button ${fontClass} ${btnSizeClass}`;
    switch (this.type) {
      case 'pri':
        this.class = `${this.class} mo-wb-btn-pri`;
        this.spinnerPri = false;
        break;
      case 'sed':
        this.class = `${this.class} mo-wb-btn-sed`;
        this.spinnerPri = true;
        break;
      case 'third':
        this.class = `${this.class} mo-wb-btn-third`;
        this.spinnerPri = true;
        break;
      case 'outline':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-outline`;
        this.spinnerPri = true;
        break;
      case 'link':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-link`;
        this.spinnerPri = true;
        break;
      case 'link-red':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-link mo-wb-btn-link-red`;
        this.spinnerPri = true;
        break;
      case 'red':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-red`;
        this.spinnerPri = false;
        break;
      case 'yellow':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-yellow`;
        this.spinnerPri = false;
        break;
      case 'green':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-green`;
        this.spinnerPri = false;
        break;
      case 'icon-pri':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-pri`;
        break;
      case 'icon-red':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-red`;
        break;
      case 'icon-yellow':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-yellow`;
        break;
      case 'icon-sed':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-sed`;
        break;
      case 'icon-outline':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-outline`;
        break;
      case 'icon-third':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-third`;
        break;
      case 'icon-link':
        this.class = `mo-wb-button ${btnSizeIconClass} mo-wb-btn-link`;
        break;
      case 'icon':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-icon`;
        break;
      case 'icon-grey':
        this.class = `mo-wb-button ${btnSizeClass} mo-wb-btn-icon mo-wb-btn-icon-grey`;
        break;
      case 'icon-only':
        this.class = 'mo-wb-button mo-wb-button-icon-only';
        break;
      case 'text-selected':
        this.class = 'mo-wb-button mo-wb-button-selected';
        break;
      case 'text-bg-selected':
        this.class = 'mo-wb-button mo-wb-button-selected mo-wb-button-icon-selected';
        break;
      case 'icon-selected':
        this.class = 'mo-wb-button mo-wb-button-icon mo-wb-button-icon-selected';
        break;
      case 'text-pri':
        this.class = `${this.class} mo-wb-button-text-pri`;
        this.spinnerPri = false;
        break;
        break;
      default:
        this.class = 'mo-wb-button mo-wb-button-blue-solid';
        break;
    }

    this.class = `${this.class}`;
  }

  clickButton(e: any) {
    if (this.disable || this.isPending) {
      return;
    }
    // this.renderer.invokeElementMethod(this.buttonEl.nativeElement, 'blur', []);
    this.onPropsEle.emit(this.buttonEl.nativeElement);
    this.onClick.emit(e);
  }

  ngOnDestroy() {
  }

}
