export interface IDateRange {
  start: any;
  end: any;
  dateTimeType?: string; // lưu lại lựa chọn theo component mutil date: vd 30 ngày trước , tháng này ,....
  label?: string;
}
export interface IDateLimit {
  minDate?: string;
  maxDate?: string;
}
