import {
  Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
@Component({
  selector: 'mo-wb-components-toggle_panel',
  templateUrl: './toggle-panel.component.html',
  styleUrls: ['./toggle-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbTogglePanelComponent implements OnInit {

  isOpen: boolean = true;

  @Input() classInclude: string = '';
  @Input() label: string;
  @Input() noPadding: boolean = false;

  constructor(
    private _changeDetection: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  handleOnToggleOpenContent(event: any) {
    this.isOpen = !this.isOpen;
    this._changeDetection.detectChanges();
  }

}
