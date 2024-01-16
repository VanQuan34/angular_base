# exampple of use

## html template ###
* <span m-daterangepicker [options]="datePickerOptions" (selected)="selectedDate($event)">
*  <span>
*    {{ daterange.start | date:'dd/M/y' }} - {{ daterange.end| date:'dd/M/y' }}
*  </span>
* </span>

## component ##

* private datePickerConf = {
    fullMonthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Last 7 Days": [moment().subtract(6, "days"), moment()],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "Last Month": [
        moment()
          .subtract(1, "month")
          .startOf("month"),
        moment()
          .subtract(1, "month")
          .endOf("month")
      ]
    }
  }
  public datePickerOptions: any = {
    ranges: this.datePickerConf.ranges,
    locale: {
      formatDisplay: "DD/MM/YYYY",
      separator: " - ",
      applyLabel: "Apply",
      cancelLabel: "Cancel",
      fromLabel: "From",
      toLabel: "to",
      customRangeLabel: "Custom Range",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthNames: this.datePickerConf.fullMonthNames,
      firstDay: 1
    },
    linkedCalendars: false,
    startDate: moment().subtract(29, "days"),
    endDate: moment(),
  }

  public daterange: any = {
    start: moment().subtract(29, "days"),
    end: moment(),
    label: ''
  };

  public selectedDate(value: any) {
    this.daterange.start = value.start;
    this.daterange.end = value.end;
  }

## see more option at
www.daterangepicker.com
