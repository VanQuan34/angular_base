import { Component, Input, EventEmitter, Output, ChangeDetectorRef} from '@angular/core';
import { MoWbDetectionComponent } from 'src/app/components/detection.component';

@Component({
  selector: 'mo-wb-components-select-dropdown-tree_view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class MoWbSelectDropdownTreeViewComponent extends MoWbDetectionComponent {

  isOpen: boolean = true;
  
  @Input() searchValue: string = '';
  @Input() item: any;
  @Input() itemHeight: number = 28;
  @Input() isSelectMultiple: boolean = false;
  @Input() selectedIds: string[] = [];
  @Input() key: string = 'id';
  @Input() keyName: string = 'name';
  @Input() childKey: string = 'child';
  @Input() childItemKey: string = 'id';
  @Input() childItemName: string = 'name';

  @Output() onSelectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onToggleOpen: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public override _changeDetection: ChangeDetectorRef
  ) { 
    super(_changeDetection);
  }

  /**
   * handle on select parent
   * @param event 
   */
  handleOnSelectParent(event: MouseEvent) {
    if (!this.item[this.childKey].length) {
      this.isOpen = !this.isOpen;
      this.detectChanges();
      return;
    }
    this.isOpen = !this.isOpen;
    this.item.isOpen = this.isOpen;
    this.onToggleOpen.emit(this.item);
    this.detectChanges();
  }

  /**
   * handle on selected item
   * @param isSelected 
   * @param item 
   */
  handleOnSelectItem(isSelected: boolean, item: any) {
    // console.log('handleOnSelectItem isSelected=', isSelected, ' item=', item);
    this.onSelectedItem.emit({isSelected:isSelected, item: item});
  }

  /**
   * handle on child item select
   * @param event 
   */
  handleOnChildItemSelect(event: any) {
    this.onSelectedItem.emit(event);
  }

  /**
   * handle on toggle open
   * @param item 
   */
  handleOnToggleOpen(item: any) {
    this.onToggleOpen.emit(item);
  }

}
