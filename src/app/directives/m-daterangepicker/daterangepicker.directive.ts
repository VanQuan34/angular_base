import { Directive, AfterViewInit, Input, Output, EventEmitter, KeyValueDiffers, ElementRef, OnDestroy } from '@angular/core';
import { DaterangepickerConfig } from './config.service';
import * as $ from 'jquery';
// import * as moment from 'moment';
import './lib/_daterangepicker/daterangepicker';

@Directive({
  selector: '[m-daterangepicker]'
})
export class DaterangepickerDirective implements AfterViewInit, OnDestroy {
  private activeRange: any;
  private targetOptions: any = {};
  private _differ: any = {};

  public datePicker: any;
  options: any;

  @Input('options') set Options(options: any) {
    this.options = options;
    const optionsChanged = this._differ.options.diff(this.options);
    this.onResetActiveRangeset.emit(() => { this.activeRange = undefined});
    if (optionsChanged) {
      this.render();
      this.attachEvents();
      if (this.activeRange && this.datePicker) {
        this.datePicker.setStartDate(this.activeRange.start);
        this.datePicker.setEndDate(this.activeRange.end);
      }
    }
  }
  @Input() zIndex: number;
  @Input() isDisableHideScroll: boolean; // disabled scroll with mobile <=768px
  @Output() onResetActiveRangeset = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() cancelDaterangepicker = new EventEmitter();
  @Output() applyDaterangepicker = new EventEmitter();
  @Output() hideCalendarDaterangepicker = new EventEmitter();
  @Output() showCalendarDaterangepicker = new EventEmitter();
  @Output() hideDaterangepicker = new EventEmitter();
  @Output() showDaterangepicker = new EventEmitter();
  @Output() onHover = new EventEmitter();
  
  constructor(
    private targElement: ElementRef,
    private config: DaterangepickerConfig,
    private differs: KeyValueDiffers
  ) {
    this.options = {};
    this._differ['options'] = this.differs.find(this.options).create();
    this.zIndex = 99999;
  }

  private callback(start?: any, end?: any, label?: any): void {
    this.activeRange = {
      start: start,
      end: end,
      label: label
    };
    this.selected.emit(this.activeRange);
  }

  private render() {
    this.targetOptions = Object.assign({}, this.options);
    var ele: any = $(this.targElement.nativeElement);
    ele.daterangepicker(this.targetOptions, this.callback.bind(this));
    this.datePicker = (<any>$(this.targElement.nativeElement)).data('daterangepicker');
  }

  private attachEvents() {
    $(this.targElement.nativeElement).on('cancel.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.cancelDaterangepicker.emit(event);
      }
    );

    $(this.targElement.nativeElement).on('apply.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.applyDaterangepicker.emit(event);
        if (this.options.autoSelect) return;
        this.activeRange = {
          start: picker.startDate,
          end: picker.endDate,
          label: picker.chosenLabel
        };
        this.selected.emit(this.activeRange);
      }
    );

    $(this.targElement.nativeElement).on('hideCalendar.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.hideCalendarDaterangepicker.emit(event);
      });

    $(this.targElement.nativeElement).on('showCalendar.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.showCalendarDaterangepicker.emit(event);
      }
    );

    $(this.targElement.nativeElement).on('insideClick.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.onHover.emit(true);
      }
    );

    $(this.targElement.nativeElement).on('hide.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.onHover.emit(false);
        this.hideDaterangepicker.emit(event);
        window.removeEventListener('scroll', this.handleOnWindowScroll, true);
      }
    );

    $(this.targElement.nativeElement).on('show.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.showDaterangepicker.emit(event);
        setTimeout(() => {
          window.addEventListener('scroll', this.handleOnWindowScroll, true);
        }, 250);
      }
    );
  }

  handleOnWindowScroll = (e: any) => {
    try {
      const className = e.target.className;
      // in case class custom select month, year
      if(className.includes('select-items')){
        return;
      }
      const tagName = e.target.tagName;
      if (className === 'yearselect' && tagName === 'SELECT') {
        // Fix error not show date range picker in FireFox
        return;
      }
      if (!this.isDisableHideScroll) {
        (<any>$(this.targElement.nativeElement)).data('daterangepicker').hide();
        this.hideDaterangepicker.emit(e);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewInit() {
    this.config.setZindex(this.zIndex);
    this.config.embedCSS();
    this.render();
    this.attachEvents();
  }

  private destroyPicker() {
    try {
      (<any>$(this.targElement.nativeElement)).data('daterangepicker').remove();
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    this.destroyPicker();
  }
}

