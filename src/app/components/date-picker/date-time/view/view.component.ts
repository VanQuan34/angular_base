import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { DomHandlerService } from 'src/app/api/common/dom-handler.service';
// import { CURRENT_LANG } from '../../../../common/define/language.define';
import { IMyDpOptions, MyDatePicker } from '../calendar/my-date-picker';

@Component({
  selector: 'mo-wb-components-date_picker-date_time-view',
  styleUrls: ['./view.component.scss'],
  templateUrl: './view.component.html'
})
export class MoWbDateTimePickerViewComponent implements OnInit, OnDestroy {
  private isOver: boolean;

  public dateSelected: any;
  public time: any;
  public listYear: Array<number>;
  public thisYear: number;
  public arrowtop: boolean;
  public arrowBottom: boolean;
  public arrowRight: boolean;
  public arrowLeft: boolean;
  public top: number;
  public left: number;
  public optionsDatetimePicker: any;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };
  public model: any;
  public locale: string;

  @Input() dateUpPost: any;
  @Input() hiddenTime: boolean;
  @Input() ignoreMinDate: boolean;
  @Input() positionCalendar: string; // [top,bottom] default bottom
  @Input() haveArrow: boolean;
  @Input() maxDateIsCurrent: boolean;

  @Output() onHover: EventEmitter<any> = new EventEmitter();
  @Output() timePick: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('mydate') pickDate: MyDatePicker;
  @ViewChild('calendar') calender: ElementRef;

  constructor(private dom: DomHandlerService, private _el: ElementRef) {
    this.dateSelected = moment();
    this.listYear = new Array();
    this.top = 0;
    this.left = -500;
    this.optionsDatetimePicker = {
      format: 'DD/MM/YYYY',
      dayViewHeaderFormat: 'MMMM',
      allowInputToggle: true,
      locale: 'vi'//CURRENT_LANG()
    };
    this.locale = 'vi' ;//CURRENT_LANG();
    this.dateUpPost = moment();
    this.model = { date: { year: this.dateUpPost.year(), month: this.dateUpPost.month() + 1, day: this.dateUpPost.date() } };
    this.time = { hours: '0', minute: '0' };
    this.thisYear = this.dateUpPost.year();
    this.listYear.push(this.thisYear);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.onWindowScrollHandler, true);

    if (!this.maxDateIsCurrent) {
      for (let i = 1; i < 100; i++) {
        this.listYear.push(this.thisYear + i);
      }
    }

    if (!this.ignoreMinDate) {
      for (let i = 1; i < 100; i++) {
        this.listYear.push(this.thisYear - i);
      }
    }

    this.listYear.sort((num1, num2) => num2 - num1);
    if (!this.positionCalendar) {
      this.positionCalendar = 'bottom';
    }

    this.focusItem();
    this.model = { date: { year: this.dateSelected.year(), month: this.dateSelected.month() + 1, day: this.dateSelected.date() } };
  }

  focusItem() {
    this.getTime();
    setTimeout(() => {
      if (this.calender) {
        this.calender.nativeElement.focus();
      }
    }, 250);
  }

  getTime() {
    const dayCurrent = {
      year: this.dateSelected.year(),
      month: this.dateSelected.month() + 1,
      day: this.dateSelected.date()
    };

    if (this.ignoreMinDate) {
      this.optionsDatetimePicker.disableUntil = { ...dayCurrent, day: dayCurrent.day - 1 };
    }

    if (this.maxDateIsCurrent) {
      this.optionsDatetimePicker.disableSince = { ...dayCurrent, day: dayCurrent.day + 1 };
    }
    if (this.dateUpPost) {
      this.dateSelected = this.dateUpPost;
      this.thisYear = moment(this.dateUpPost).year();
      this.time.hours = `${moment(this.dateUpPost).hour()}`;
      this.time.minute = `${moment(this.dateUpPost).minute()}`;
      return;
    }
    this.dateSelected = moment();
    this.time.hours = `${moment().hour()}`;
    this.time.minute = `${moment().minute()}`;
  }

  selectDate(e: Event) {
    e.stopPropagation();
    if (this.dateSelected) {
      this.dateUpPost = this.dateSelected;
    } else {
      this.dateUpPost = moment();
    }
    if (!this.hiddenTime) {
      if (this.time.hours !== -1) {
        this.dateUpPost = moment(this.dateUpPost).set('hour', this.time.hours || 0).set({ second: 0, millisecond: 0 });
      }
      if (this.time.minute !== -1) {
        this.dateUpPost = moment(this.dateUpPost).set('minute', this.time.minute || 0).set({ second: 0, millisecond: 0 });
      }
    } else {
      this.dateUpPost = moment(this.dateUpPost).set('hour', 0).set('minute', 0).set('second', 0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    this.timePick.emit(this.dateUpPost);
  }

  selectYearCalender(e: any) {
    const currentYear = moment().year();
    this.thisYear = e.target.value;
    this.pickDate.selectNewYear(this.thisYear);
    this.dateSelected = moment().year(this.thisYear);
  }

  pickerSwitchMonth(event: any) {
    this.thisYear = event.viewDate.year();
  }

  hiddenCalendar(e: Event) {
    e.stopPropagation();
    this.onClose.emit();
  }

  validateHours(e: Event, hoursInput: any) {
    e.stopPropagation();
    e.preventDefault();
    let text = hoursInput.value;
    if (text && text.length > 2) {
      text = text.substring(0, 2);
    }

    text = text.replace(/[^0-9]*/g, '');

    if (+text > 23) {
      text = '23';
    }

    this.time.hours = text;
    hoursInput.value = text;
  }

  validateMinute(e: Event, minuteInput: any) {
    e.stopPropagation();
    e.preventDefault();
    let text = minuteInput.value;
    if (text && text.length > 2) {
      text = text.substring(0, 2);
    }

    text = text.replace(/[^0-9]*/g, '');

    if (+text > 59) {
      text = '59';
    }

    this.time.minute = text;
    minuteInput.value = text;
  }

  setPosition(top: number, left: number, width: number): void {
    const rectView = this.calender.nativeElement.getBoundingClientRect();
    const viewport = this.dom.getViewport();
    const heightViewport = viewport.height;
    const widhtViewPort = viewport.width;
    switch (this.positionCalendar) {
      case 'bottom':
        this.left = left - rectView.width / 2 + width / 2 + 10;
        this.left = Math.max(Math.min(widhtViewPort - 2 - rectView.width, this.left), 5);
        if (heightViewport - top - 45 > rectView.height) {
          this.top = top + 50;
          return;
        }

        if (rectView.height + top + 45 > heightViewport) {

          if (rectView.height / 2 + top + 45 > heightViewport) {
            this.positionCalendar = 'top';
            this.setPosition(top, left, width);
            return;
          }
          this.top = top - rectView.height / 2 + 25;
          const leftUpdate = left + width + 15;
          const isPositionRight = leftUpdate + rectView.width < widhtViewPort;
          this.left = isPositionRight ? leftUpdate : left - rectView.width - 15;
          if (isPositionRight) {
            this.arrowRight = true;
            return;
          }
          this.arrowLeft = true;
          return;
        }

        this.top = top - rectView.height - 20;
        this.arrowBottom = true;
        return;

      case 'top':
        this.left = left - rectView.width / 2 + width / 2 + 10;
        this.left = Math.max(Math.min(widhtViewPort - 2 - rectView.width, this.left), 5);
        if (top - rectView.height - 20 > 0) {
          this.top = top - rectView.height - 20;
          return;
        }
        this.arrowtop = true;
        this.top = top + 50;
        return;
    }
  }
  onYearChanged(year: number) {
    this.thisYear = year;
  }

  onDateChanged(date: any) {
    this.dateSelected = date && date.jsdate;
  }

  handleMouseEnter(event: any) {
    this.onHover.emit(true);
    this.isOver = true;
  }

  handleMouseLeave(event: any) {
    this.onHover.emit(false);
    this.isOver = false;
  }

  onWindowScrollHandler = (event: any) => {
    try {
      const className = event.target.className;
      const tagName = event.target.tagName;
      if (className === 'select-year' && tagName === 'SELECT') {
        // Fix error not show date range picker in FireFox
        return;
      }
      if (!this.isOver) {
        this.onClose.emit();
      }
    } catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScrollHandler, true);
  }
}
