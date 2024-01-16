import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISort } from '../api/sort';
@Component({
  selector: 'mo-wb-components-button-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class MoWbButtonSortComponent implements OnInit {

  @Input() mode: string;
  @Input() fieldSort: string;

  @Output() onChange: EventEmitter<ISort>;
  constructor() {
    this.onChange = new EventEmitter();
  }

  ngOnInit() {
  }

  handlerClickSort(event: Event, mode: any) {
    event.stopPropagation();
    this.mode = mode;
    this.onChange.emit(this.getMode());
  }

  private getMode(): ISort {
    return {
      mode: this.mode,
      modeNumber: this.mode === 'asc' ? 1 : 2,
      fieldSort: this.fieldSort,
      reset: this.reset.bind(this)
    };
  }

  private reset() {
    this.mode = '';
  }
}
