import * as moment from 'moment';
import { DefineFunction
 } from 'src/app/api/common/function.define';
export const dateRangeDefault: any = {
  lifetime: DefineFunction.setPointStartAndEndTime(moment('19690131'), moment('29991231')),
  today: DefineFunction.setPointStartAndEndTime(moment(), moment()),
  yesterday: DefineFunction.setPointStartAndEndTime(moment().subtract(1, 'days'), moment().subtract(1, 'days')),
  _7days_ago: DefineFunction.setPointStartAndEndTime(moment().subtract(6, 'days'), moment()),
  _30days_ago: DefineFunction.setPointStartAndEndTime(moment().subtract(29, 'days'), moment()),
  this_month: DefineFunction.setPointStartAndEndTime(moment().startOf('month'), moment().endOf('month')),
  last_month: DefineFunction.setPointStartAndEndTime(moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')),
  _3months_ago: DefineFunction.setPointStartAndEndTime(moment().subtract(92, 'days'), moment())
};

export const setPointStartAndEndTime = (start: any, end: any, isResponseObject: any) => { // mặc định trả về  kiểu Array
  if (start) {
    start.set('hour', 0);
    start.set('minute', 0);
    start.set('millisecond', 0);
  }

  if (end) {
    end.set('hour', 23);
    end.set('minute', 59);
    end.set('millisecond', 0);
  }

  if (isResponseObject) {
    return { start, end };
  }

  return [start, end];
};

export const MultiDateWidthDefine = {
  DEFAULT_REQUIRE: '199px',
  DEFAULT_NO_REQUIRE: '212px',
  DEFAULT_TIME_PICKER_REQUIRE: '284px',
  DEFAULT_TIME_PICKER_NO_REQUIRE: '295px',
  DEFAULT_TIME_PICKER_SECONDS_REQUIRE: '295px',
  DEFAULT_TIME_PICKER_SECONDS_NO_REQUIRE: '310px',
};
