import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ChangeDetectorRef,
  ElementRef, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'mo-wb-components-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MoWbSliderComponent implements OnInit{

  @Input() classInclude: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() value: number = 20;

  @Output() onValueChanged = new EventEmitter<number>();
  @Output() onInputValueChanged = new EventEmitter<number>();

  @ViewChild('input') input: ElementRef;

  constructor(public _changeDetection: ChangeDetectorRef,) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.setBackgroundSlider(changes['value'].currentValue);
    }
  }

  ngAfterViewInit() {
    this.setBackgroundSlider(this.value);
    this.initEvents();
  }

  initEvents() {
    this.input.nativeElement.addEventListener('input', this.handleOnInputValueChanged);
    this.input.nativeElement.addEventListener('click', this.handleOnValueChanged);
    this.input.nativeElement.addEventListener('change', this.handleOnValueChanged);
  }

  setBackgroundSlider(inputVal: number) {
    if (!this.input) {
      return;
    }
    const value = (inputVal - this.min)/(this.max-this.min)*100;
    this.input.nativeElement.style.background = 'linear-gradient(to right, var(--pri) 0%, var(--pri) ' + value + '%, #e6e8ed ' + value + '%, #e6e8ed 100%)'
    this._changeDetection.detectChanges();
  }

  handleOnInputValueChanged = (e: any) => {
    this.value = parseFloat(this.input.nativeElement.value);
    this.setBackgroundSlider(this.value);
    this.onInputValueChanged.emit(this.value);
  }

  handleOnValueChanged = (e: any) => {
    this.onValueChanged.emit(this.value);
  }
}
