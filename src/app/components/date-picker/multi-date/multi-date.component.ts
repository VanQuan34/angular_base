import { IDateLimit } from '../api/date-range';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';
// import { DefineFunction } from '../../../common/define/function.define';
import { IDateRange } from '../api/date-range';
import { IMoWbLabel } from '../../label/api/ILabel';
import { dateRangeDefault, MultiDateWidthDefine } from './define/multi-date.define';
// import { CURRENT_LANG } from '../../../common/define/language.define';
// import { DefineConstants } from '../../../common/define/constants.define';
@Component({
  selector: 'mo-wb-components-date_picker-multi_date',
  styleUrls: ['./multi-date.component.scss'],
  templateUrl: './multi-date.component.html'
})
export class MoWbMultiDatePickerComponent implements OnInit, OnDestroy, AfterViewInit {
  public datePickerOptions: any;
  public dateRange: IDateRange;
  public displayFake: boolean;
  public singleError: {
    error: string;
    interpolateParams: any;
  };

  protected dateRangeObj: any;
  public format: string;
  public defaultHolder: string;
  public isLifetime: boolean;
  public lang: string;
  // private subscribeDOption: ISubscription;
  // private subscribeDOptionLangChange: ISubscription;
  private handelLangChange: any;
  private resetActiveRangeDirective: Function;
  private timer: any;

  @Input() readOnly: boolean;
  @Input() hasResetDate: boolean;
  @Input() minDate: any;
  @Input('limitDate') set DateLimitObj(data: IDateLimit) { //minDate, maxDate có dạng yyyy/mm/dd
    if (data) {
      this.configMinMaxDate(data);
    }
  }
  @Input('dateRange') set DateRange(dateRange: IDateRange) {
    this.dateRange = dateRange;
    if (this.dateRange) {
      this.datePickerOptions.startDate = this.dateRange.start;
      this.datePickerOptions.endDate = this.dateRange.end;
      // this.subscribeDOption = this._translate.get('dOptions').subscribe((opt) => { // support cho trường hợp ở dashboard phải set giá trinh sau khi gọi api
      //   if (opt && opt.ranges) {
      //     if (this.lifetime) {
      //       opt.ranges.lifetime = this._translate.instant(this.labelOptionLifeTime);
      //     }
      //     this.buildDatePicker(opt);
      //   }
      //   this.subscribeDOption && this.subscribeDOption.unsubscribe();
      // });
    }
  }

  @Input() ignoreRangeDefault: boolean;
  @Input() autoSelect: boolean;
  @Input() label: IMoWbLabel;
  @Input() enable: boolean;
  @Input() lifetime: boolean;
  @Input() labelOptionLifeTime: string;
  @Input() zIndex: number;
  @Input() validRequired: boolean = true;
  @Input() showDate: boolean; // = true show date by format 'dd/mm/yyyy - dd/mm/yyyy';
  @Input() timePicker: boolean;
  @Input() timePicker24Hour: boolean;
  @Input() timePickerSeconds: boolean;
  @Input() width: string;
  @Input() isStaticWidth: boolean; // cố định width
  @Input() maxWidth: string;
  @Input() isDisableHideScroll: boolean;
  @Output() onHover = new EventEmitter<any>();
  @Output() onSelectTime: EventEmitter<IDateRange> = new EventEmitter();
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('daterangepck') dateRangePicker: ElementRef;

  constructor(
    private _translate: TranslateService
  ) {
    this.format = 'dd/MM/yyyy';
    this.defaultHolder = 'dd/mm/yyyy - dd/mm/yyyy';
    this.autoSelect = false;
    this.datePickerOptions = {
      linkedCalendars: false,
      startDate: undefined,
      endDate: undefined,
      ranges: [],
      locale: {
        formatDisplay: 'DD/MM/YYYY',
        separator: ' - ',
        firstDay: 0
      },
      timePicker: false,
      timePicker24Hour: false,
      timePickerSeconds: false,
    };
    this.enable = true;
    this.singleError = {
      error: undefined,
      interpolateParams: undefined
    };
    this.lang = 'vi';//CURRENT_LANG();
    this.handelLangChange = this._translate.onLangChange.subscribe(event => {
      this.lang = event.lang;
    });
    this.showDate = false;
    this.labelOptionLifeTime = 'i18n_lifetime';
    this.timePicker24Hour = true;
    this.displayFake = true;
  }

  ngOnInit() {
    if (!this.dateRange) {
      // this.dateRange = DefineFunction.DefaultRangeDatePicker;
    }
    if (this.minDate) {
      this.datePickerOptions.minDate = this.minDate;
    }
    this.datePickerOptions.startDate = this.dateRange.start;
    this.datePickerOptions.endDate = this.dateRange.end;
    // this.subscribeDOption = this._translate.get('dOptions').subscribe((opt) => { // support cho trường hợp không truyền giá trị daterage
    //   if (opt && opt.ranges) {
    //     if (this.lifetime) {
    //       opt.ranges.lifetime = this._translate.instant(this.labelOptionLifeTime);
    //     }
    //     this.buildDatePicker(opt);
    //   }
    //   this.subscribeDOption && this.subscribeDOption.unsubscribe();
    // });
    // this.subscribeDOptionLangChange = this._translate.onLangChange.subscribe((evt: LangChangeEvent) => {
    //   const dOptions = evt.translations.dOptions;
    //   if (dOptions && dOptions.ranges) {
    //     if (this.lifetime) {
    //       dOptions.ranges.lifetime = this._translate.instant(this.labelOptionLifeTime);
    //     }
    //     this.buildDatePicker(dOptions);
    //   }
    // });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.isStaticWidth) {
        this.setWidthInput();
        return;
      }
      this.setMaxWidthInput();
    }, 0);
  }

  public showDateRange(e: Event) {
    e.stopPropagation();
    this.onOpen.next(true);
    if (!this.enable) {
      return;
    }
    this.displayFake = false;
    if (this.dateRange) {
      this.datePickerOptions.startDate = this.dateRange.start;
      this.datePickerOptions.endDate = this.dateRange.end;
    }
    this.timer = setTimeout(() => {
      if (this.dateRangePicker) {
        this.datePickerOptions = { ...this.datePickerOptions };
        this.dateRangePicker.nativeElement.click();
      }
    });
  }

  configMinMaxDate(date: any) {
    if (date.minDate) {
      this.datePickerOptions.minDate = moment(date.minDate);
    }

    if (date.maxDate) {
      this.datePickerOptions.maxDate = moment(date.maxDate);
    }

  }


  handleResetActiveRangeset(e: any) {
    this.resetActiveRangeDirective = e;
  }

  get ResetActiveRangeDirective() {
    return this.resetActiveRangeDirective;
  }

  removeDatePicker() {
    this.displayFake = true;
    this.onOpen.next(false);
  }

  buildDatePicker(opt: any) {
    try {
      if (this.datePickerOptions.ranges) {
        this.datePickerOptions.ranges = {};
      }
      if (!this.ignoreRangeDefault) {
        if (this.lifetime) {
          this.datePickerOptions.ranges[opt.ranges.lifetime] = dateRangeDefault.lifetime;
          this.isLifetime = true;
        }
        this.datePickerOptions.ranges[opt.ranges.today] = dateRangeDefault.today;
        this.datePickerOptions.ranges[opt.ranges.yesterday] = dateRangeDefault.yesterday;
        this.datePickerOptions.ranges[opt.ranges._7days_ago] = dateRangeDefault._7days_ago;
        this.datePickerOptions.ranges[opt.ranges._30days_ago] = dateRangeDefault._30days_ago;
        this.datePickerOptions.ranges[opt.ranges.this_month] = dateRangeDefault.this_month;
        this.datePickerOptions.ranges[opt.ranges.last_month] = dateRangeDefault.last_month;
        this.datePickerOptions.ranges[opt.ranges._3months_ago] = dateRangeDefault._3months_ago;
      }
      if (this.datePickerOptions.locale) {
        this.datePickerOptions.locale = {};
      }
      this.datePickerOptions.locale.applyLabel = opt.applyLabel;
      this.datePickerOptions.locale.cancelLabel = opt.cancelLabel;
      this.datePickerOptions.locale.fromLabel = opt.fromLabel;
      this.datePickerOptions.locale.toLabel = opt.toLabel;
      this.datePickerOptions.locale.customRangeLabel = opt.customRangeLabel;
      this.datePickerOptions.locale.daysOfWeek = opt.daysOfWeek;
      this.datePickerOptions.locale.monthNames = opt.monthNames;
      this.datePickerOptions.locale.firstDay = 1;
      this.datePickerOptions.locale.formatDisplay = 'DD/MM/YYYY';
      this.datePickerOptions.autoSelect = this.autoSelect;

      this.datePickerOptions.timePicker = this.timePicker;
      this.datePickerOptions.timePicker24Hour = this.timePicker24Hour;
      this.datePickerOptions.timePickerSeconds = this.timePickerSeconds;
      this.timePickerFormat();

      this.datePickerOptions = { ...this.datePickerOptions };
      this.getDateTimeType(this.dateRange);
    } catch (error) {

    }
    // this.subscribeDOption && this.subscribeDOption.unsubscribe();
  }

  public handleSelectedDate(value: any) {
    this.isLifetime = false;
    if (value.label === this._translate.instant(this.labelOptionLifeTime)) {
      this.isLifetime = true;
    }

    if (!this.dateRange) {
      this.dateRange = { start: undefined, end: undefined };
    }

    if (!this.timePicker) {
      // DefineFunction.setPointStartAndEndTime(value.start, value.end);
    }
    this.dateRange.start = value.start;
    this.dateRange.end = value.end;
    this.valid();
    this.getDateTimeType(this.dateRange);
    this.onSelectTime.emit(this.dateRange);
    this.displayFake = true;
  }

  private getDateTimeType(dateRange: any): string {
    if (!dateRange) {
      return '';
    }
    dateRange.dateTimeType = '';
    for (const key in dateRangeDefault) {
      const range = dateRangeDefault[key];
      if (moment(range[0]).isSame(moment(dateRange.start), 'day') && moment(range[1]).isSame(moment(dateRange.end), 'day')) {
        dateRange.dateTimeType = key;
        return dateRange.dateTimeType;
      }
    }
    return '';
  }

  public setEnable(enable: boolean = true) {
    this.enable = enable;
  }

  valid() {
    this.singleError.error = undefined;
    if (this.validRequired && (!this.dateRange || !this.dateRange.start || !this.dateRange.end)) {
      // this.singleError.error =  DefineConstants.ERROR_MESSAGE_EMPTY_VALID;
      this.singleError.interpolateParams = {};
      return false;
    }
    return true;
  }

  handleOnResetClick($event: any) {
    $event.stopPropagation();
    this.dateRange = { start: undefined, end: undefined };
    this.onSelectTime.emit(this.dateRange);
    this.displayFake = true;
  }

  handleHover(event: any) {
    this.onHover.emit(event);
  }

  private timePickerFormat() {
    if (!this.timePicker) {
      return;
    }

    const hh = this.timePicker24Hour ? 'HH' : 'hh';

    if (this.timePickerSeconds) {
      this.format = `dd/MM/yyyy ${hh}:mm:ss`;
      this.defaultHolder = 'dd/mm/yyyy hh:mm:ss - dd/mm/yyyy hh:mm:ss';
      return;
    }

    this.format = `dd/MM/yyyy ${hh}:mm`;
    this.defaultHolder = 'dd/mm/yyyy hh:mm - dd/mm/yyyy hh:mm';
  }

  private setWidthInput(): void {
    if (this.width) {
      return;
    }
    if (!this.hasResetDate) { // bắt buộc
      if (!this.timePicker) { // dd/mm/yyyy - dd/mm/yyyyy
        this.width = MultiDateWidthDefine.DEFAULT_REQUIRE;
        return;
      }
      if (this.timePickerSeconds) {
        this.width = MultiDateWidthDefine.DEFAULT_TIME_PICKER_SECONDS_REQUIRE;
        return;
      }
      this.width = MultiDateWidthDefine.DEFAULT_TIME_PICKER_REQUIRE; // dd/mm/yyyy hh:mm - dd/mm/yyyy hh:mm
      return;
    }

    if (!this.timePicker) {
      this.width = MultiDateWidthDefine.DEFAULT_NO_REQUIRE;
      return;
    }
    if (this.timePickerSeconds) {
      this.width = MultiDateWidthDefine.DEFAULT_TIME_PICKER_SECONDS_NO_REQUIRE;
      return;
    }
    this.width = MultiDateWidthDefine.DEFAULT_TIME_PICKER_NO_REQUIRE;
  }

  private setMaxWidthInput() {
    if (this.maxWidth) {
      return false;
    }
    if (!this.hasResetDate) { // bắt buộc
      if (!this.timePicker) { // dd/mm/yyyy - dd/mm/yyyyy
        this.maxWidth = MultiDateWidthDefine.DEFAULT_REQUIRE;
        return false;
      }
      if (this.timePickerSeconds) {
        this.maxWidth = MultiDateWidthDefine.DEFAULT_TIME_PICKER_SECONDS_REQUIRE;
        return false;
      }
      this.maxWidth = MultiDateWidthDefine.DEFAULT_TIME_PICKER_REQUIRE; // dd/mm/yyyy hh:mm - dd/mm/yyyy hh:mm
      return false;
    }

    if (!this.timePicker) {
      return this.maxWidth = MultiDateWidthDefine.DEFAULT_NO_REQUIRE;
    }
    if (this.timePickerSeconds) {
      this.maxWidth = MultiDateWidthDefine.DEFAULT_TIME_PICKER_SECONDS_NO_REQUIRE;
      return false; 
    }
    this.maxWidth = MultiDateWidthDefine.DEFAULT_TIME_PICKER_NO_REQUIRE;
    return true;
  }

  ngOnDestroy() {
    this.removeDatePicker();
    clearTimeout(this.timer);
    // this.subscribeDOption && this.subscribeDOption.unsubscribe();
    // this.subscribeDOptionLangChange && this.subscribeDOptionLangChange.unsubscribe();
    // this.handelLangChange && this.handelLangChange.unsubscribe();
  }
}
