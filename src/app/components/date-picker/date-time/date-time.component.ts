import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, HostListener, EmbeddedViewRef, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { MoWbDateTimePickerViewComponent } from './view/view.component';
// import { MoWbDropDownComponent } from '../../drop-down/drop_down.component';
import * as moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IMoWbLabel } from '../../label/api/ILabel';
import { LabelTimePipe } from './label-time.pipe';
// import { ISubscription } from 'rxjs/Subscription';
import { DefineConstants } from 'src/app/api/common/constants.define';

@Component({
  selector: 'mo-wb-components-date_picker-date_time',
  styleUrls: ['./date-time.component.scss'],
  templateUrl: './date-time.component.html'
})
export class MoWbDateTimePickerComponent implements OnInit, OnDestroy {
  public readonly DefineConstants = DefineConstants;
  public error: boolean;
  protected isOpen: boolean;
  protected viewDatepicker: ComponentRef<MoWbDateTimePickerViewComponent>;
  public monthItems: Array<any> = new Array<any>();
  public dateItems: Array<any> = new Array<any>();
  public yearItems: Array<any> = new Array<any>();
  public pldMonthInput: string;
  public pldDayInput: string;
  public dateUpPost: any;
  public hasError: boolean;
  public required: boolean;

  private monthsList: Array<string>;
  private subOnLangChange: any;
  private subOnLoadLanguage: any;

  @Input() useColorModeExist: boolean; // useColorModeExist = true => color input change from #4e4e4e to #29c7cc
  @Input() format: string;
  @Input('dateUpPost') set DateUpPost(date: any) {
    const labelTimePipe = new LabelTimePipe();
    // Change format by the standard format of monentjs
    const format = labelTimePipe.replaceFormatDateTime(this.format);
    if (!date) {
      // Reset display data in html, when  change data date equals null/ undefined
      this.reset(date);
      return;
    }

    if (this.dateUpPost) {
      return;
    }

    if (this.format === 'dd/mm') {
      this.dateUpPost = moment(date, 'DD/MM');
      // Init data month when reset data
      this.initMonthItems(this.monthsList);
      return;
    }

    if (this.format === 'yyyy/mm') {
      this.dateUpPost = moment(date, 'YYYY/MM');
      return;
    }

    this.dateUpPost = moment(date, format);
  }
  @Input() emitTimeUTC: boolean;
  @Input() keepFormat: string;
  @Input() hiddenTime: boolean;
  @Input() ignoreMinDate: boolean;
  @Input() positionCalendar: string; // [top,bottom] default bottom
  @Input() haveArrow: boolean; // default true
  @Input() widthDatePicker: string;
  @Input() maxDateIsCurrent: boolean;
  @Input() readonly: boolean;
  @Input('required') set Required(value: boolean) {
    this.required = value;
    if (!this.required) {
      this.error = false;
      this.hasError = false;
    }
  }
  @Input() requiredErrorMessage: string;
  @Input() classInclude: string;
  @Input() monthSelectedKeys: Array<any> = new Array<any>();
  @Input() daySelectedKeys: Array<any> = new Array<any>();
  @Input() yearSelectedKeys: Array<any> = new Array<any>();
  @Input() enable: boolean;
  @Input() label: IMoWbLabel;
  @Input() minYear: number;
  @Input() hasResetDate: boolean;

  @Output() onHover: EventEmitter<any> = new EventEmitter();
  @Output() onTimePick: EventEmitter<any> = new EventEmitter();
  @Output() onToggle: EventEmitter<any> = new EventEmitter();

  @ViewChild('dateTimePicker') elementRef: ElementRef;
  @ViewChild('dMonth') dMonth: any;
  @ViewChild('dDay') dDay: any;
  @ViewChild('dYear') dYear: any;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _translateService: TranslateService,
    private _injector: Injector) {
    this.positionCalendar = 'bottom';
    this.haveArrow = true;
    this.pldDayInput = 'i18n_select_day';
    this.pldMonthInput = 'i18n_select_month';
    this.classInclude = '';
    this.format = 'dd/mm/yyyy';
    this.enable = true;
    this.minYear = 1921;
    this.hasResetDate = true;
    this.monthsList = new Array<string>();
  }

  ngOnInit() {
    this.subOnLoadLanguage = this._translateService.get('dOptions').subscribe(opt => {
      if (opt && opt.monthNames) {
        this.monthsList = opt.monthNames;
        if (this.format === 'dd/mm') {
          this.initMonthItems(opt.monthNames);
          return;
        }
        if (this.format === 'yyyy/mm') {
          this.initYearItems();
          return;
        }
      }
    });
    this.subOnLangChange = this._translateService.onLangChange.subscribe((evt: LangChangeEvent) => {
      const dOptions = evt.translations.dOptions;
      if (dOptions && dOptions.monthNames) {
        this.monthsList = dOptions.monthNames;
        if (this.format === 'dd/mm') {
          this.initMonthItems(dOptions.monthNames);
          return;
        }
        if (this.format === 'yyyy/mm') {
          if (this.yearSelectedKeys && this.yearSelectedKeys.length) {
            this.setMonthItems(this.yearSelectedKeys[0]);
            return;
          }
          this.initYearItems();
        }
      }
    });
  }

  private initYearItems() {
    this.yearItems = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= this.minYear; i--) {
      this.yearItems.push({
        key: i,
        label: i
      });
    }
    if (this.dateUpPost) {
      const month = this.dateUpPost.month();
      const year = this.dateUpPost.year();

      this.yearSelectedKeys = [];
      this.yearSelectedKeys.push(year);
      this.setMonthItems(year);

      this.monthSelectedKeys.push(month);
      return;
    }
    this.monthSelectedKeys = new Array();
    this.yearSelectedKeys = new Array();
    this.monthItems = new Array();
  }

  toggleCalendar(event: Event) {
    event.stopPropagation();
    if (!this.enable || this.readonly) {
      return;
    }
    this.onToggle.emit(event);
    if (!this.isOpen) {
      this.isOpen = true;
      this.appendDatePickerPopupToBody();
      this.updateDatePickerPopupPosition();
      return;
    }
    this.closePopup();
  }

  appendDatePickerPopupToBody() {
    this.viewDatepicker = this._componentFactoryResolver.resolveComponentFactory(MoWbDateTimePickerViewComponent).create(this._injector);

    this._appRef.attachView(this.viewDatepicker.hostView);
    const instance = this.viewDatepicker.instance;
    instance.dateUpPost = this.dateUpPost;
    instance.haveArrow = this.haveArrow;
    instance.hiddenTime = this.hiddenTime;
    instance.ignoreMinDate = this.ignoreMinDate;
    instance.positionCalendar = this.positionCalendar;
    instance.maxDateIsCurrent = this.maxDateIsCurrent;
    instance.onHover.subscribe((event) => {
      this.handleHover(event);
    });
    instance.onClose.subscribe((event) => {
      this.closePopup();
    });

    instance.timePick.subscribe((event) => {
      this.selectedDateTime(event);
      this.validate();
    });

    const domElem = (this.viewDatepicker.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);
  }

  updateDatePickerPopupPosition() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    if (this.viewDatepicker && this.isOpen) {
      setTimeout(() => {
        this.viewDatepicker.instance.setPosition(rect.top, rect.left, rect.width);
      }, 0);
    }
  }

  closePopup(resetError?: boolean) {
    // this.validate();
    this.closePopupPickDate();
    if (this.dDay && this.dMonth) {
      this.closePopupMonthDate();
      if (this.hasError && resetError) {
        this.dMonth.resetError();
        this.dDay.resetError();
        this.hasError = false;
      }
    }

    if (resetError && this.error) {
      this.error = false;
    }
  }

  closePopupMonthDate() {
    if (this.dDay && this.dMonth) {
      this.dMonth.closePopup();
      this.dDay.closePopup();
    }
  }

  closePopupPickDate() {
    if (this.isOpen) {
      this._appRef.detachView(this.viewDatepicker.hostView);
      this.viewDatepicker.destroy();
      this.isOpen = false;
    }
  }

  selectedDateTime(time: any) {
    this.dateUpPost = time;
    this.closePopup();
    if (this.emitTimeUTC) {
      this.onTimePick.emit(moment(this.dateUpPost).utc());
      return;
    }
    this.onTimePick.emit(this.dateUpPost);
  }

  validate() {
    if (this.format === 'dd/mm' || this.format === 'yyyy/mm') {
      this.getValue();
      return (this.hasError) ? false : true;
    }

    if (this.required && !this.dateUpPost) {
      this.error = true;
      return false;
    }

    this.error = false;
    return true;
  }

  private setMonthItems(year: number) {
    this.monthItems = [];
    this.monthSelectedKeys = [];
    if (this.dMonth) {
      this.dMonth.reset();
    }

    let maxMonth = 12;
    if (this.maxDateIsCurrent && year === new Date().getFullYear()) {
      maxMonth = new Date().getMonth() + 1;
    }
    for (let i = 0; i <= maxMonth - 1; i++) {
      this.monthItems.push({
        key: i,
        label: this.monthsList[i],
      });
    }

    if (this.dMonth) {
      this.dMonth.setItems(this.monthItems);
      this.dMonth.setEnable(true);
    }
  }
  private initMonthItems(months: any) {
    this.monthItems = [];

    for (let i = 0; i <= months.length - 1; i++) {
      this.monthItems.push({
        key: i,
        label: months[i],
      });
    }
    if (this.dMonth) {
      this.dMonth.setItems(this.monthItems);
    }
    if (this.dateUpPost) {
      const month = this.dateUpPost.month();
      this.monthSelectedKeys = [];
      this.monthSelectedKeys.push(month);
      this.initDayData(month);
      const day = this.dateUpPost.date();
      this.daySelectedKeys.push(day);
      if (this.dDay) {
        this.dDay.setSelectedKeys([day]);
      }
      return;
    }
    this.monthSelectedKeys = new Array();
    this.daySelectedKeys = new Array();
  }

  protected validateDayMonth() {
    if (this.required) {
      this.dMonth.validate();
      this.dDay.validate();
      if ((!this.daySelectedKeys.length || !this.monthSelectedKeys.length)) {
        this.dateUpPost = undefined;
        this.hasError = true;
        return false;
      }
      this.hasError = false;
      return true;
    }

    if (!this.daySelectedKeys.length && !this.monthSelectedKeys.length) {
      this.dateUpPost = undefined;
      this.hasError = false;
      return false;
    }

    if (!this.daySelectedKeys.length && this.monthSelectedKeys.length) {
      this.dDay.validate();
      this.dateUpPost = undefined;
      this.hasError = true;
      return false;
    }
    return true;
  }

  protected validateYearMonth() {
    if (this.required) {
      this.dMonth.validate();
      this.dYear.validate();
      if ((!this.monthSelectedKeys.length || !this.yearSelectedKeys.length)) {
        this.dateUpPost = undefined;
        this.hasError = true;
        return false;
      }
      this.hasError = false;
      return true;
    }

    if (!this.monthSelectedKeys.length && !this.yearSelectedKeys.length) {
      this.dateUpPost = undefined;
      this.hasError = false;
      return false;
    }

    if (!this.monthSelectedKeys.length && this.yearSelectedKeys.length) {
      this.dateUpPost = undefined;
      this.hasError = false;
      return false;
    }
    return true;
  }

  public getValue() {
    if (this.format === 'dd/mm') {
      if (!this.validateDayMonth()) {
        return;
      }
      this.hasError = false;
      const month = this.monthSelectedKeys[0] + 1;
      const day = this.daySelectedKeys[0];

      const date = `${parseInt(day) < 10 ? `0${day}` : `${day}`}/${parseInt(month) < 10 ? `0${month}` : `${month}`}`;
      const year = new Date().getFullYear();
      this.dateUpPost = moment(`${date}/${year} 00:00:00`, 'DD/MM/YYYY HH:mm:ss').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    if (this.format === 'yyyy/mm') {
      if (!this.validateYearMonth()) {
        return;
      }
      this.hasError = false;
      const month = this.monthSelectedKeys[0] + 1;
      const year = this.yearSelectedKeys[0];

      const date = `${parseInt(month) < 10 ? `0${month}` : `${month}`}`;
      this.dateUpPost = moment(`${date}/${year} 00:00:00`, 'MM/YYYY HH:mm:ss').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    this.emitTimeUTC ? this.onTimePick.emit(moment(this.dateUpPost).utc()) : this.onTimePick.emit(this.dateUpPost);

    return this.dateUpPost;
  }

  private initDayData(month: number) {
    const year = new Date().getFullYear();
    const number = new Date(year, month + 1, 0).getDate(); // + 1 Because the month as a number between 0 and 11 (January to December).

    this.dateItems = [];
    this.daySelectedKeys = [];
    if (this.dDay) {
      this.dDay.reset();
    }
    for (let i = 1; i <= number; i++) {
      this.dateItems.push({
        key: i,
        label: `${this._translateService.instant('i18n_day_param', { day: i })}`
      });
    }

    if (this.dDay) {
      this.dDay.setItems(this.dateItems);
      this.dDay.setEnable(true);
    }
  }

  reset(date: any) {
    this.dateUpPost = date;
    this.initMonthItems(this.monthsList);
    if (this.dDay && this.dMonth) {
      this.dDay.hasError = false;
      this.dMonth.hasError = false;
    }
    this.hasError = false;
  }

  setEnable(enable: boolean = true) {
    this.enable = enable;
  }

  public handleOnMonthChange($event: any) {
    this.monthSelectedKeys = $event.keys;
    this.hasError = false;
    if (this.dDay) {
      this.dDay.closePopup();
    }
    if ($event.keys && $event.keys.length) {
      const month = $event.keys[0];
      this.initDayData(month);
      return;
    }
  }

  public handleOnYearChange(event: any) {
    this.yearSelectedKeys = event.keys;
    this.hasError = false;
    if (this.dMonth) {
      this.dMonth.closePopup();
    }
    if (event.keys && event.keys.length) {
      this.setMonthItems(event.keys[0]);
      return;
    }

  }

  public handleOnDateChange($event: any) {
    this.daySelectedKeys = $event.keys;
    this.getValue();
  }

  public handleOnDropDownClick() {
    if (!this.enable) {
      return;
    }
    this.onToggle.emit(event);
  }

  handleOnResetClick($event: any) {
    $event.stopPropagation();
    this.dateUpPost = undefined;
    this.onTimePick.emit(this.dateUpPost);
    this.closePopup();
  }

  handleHover(event: any) {
    this.onHover.emit(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.stopPropagation();
    this.closePopup();
  }

  ngOnDestroy() {
    this.closePopup();
    this.subOnLangChange && this.subOnLangChange.unsubscribe();
    this.subOnLoadLanguage && this.subOnLoadLanguage.unsubscribe();
  }
}
