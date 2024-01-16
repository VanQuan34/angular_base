import {
  Component, SimpleChanges, Input, ChangeDetectionStrategy, Output, EventEmitter
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../components/detection.component';

@Component({
  selector: 'mo-wb-components-toggle_panel-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbTogglePanelSectionComponent extends MoWbDetectionComponent {
  
  @Input() isOpen: boolean = true;
  @Input() classInclude: string = '';
  @Input() title: string = '';
  @Input() hasContentPadding: boolean = true;
  @Input() hasHeader: boolean = true;
  
  @Output() onToggleOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  override ngOnInit() {
  }

  override ngAfterViewInit() {
  }

  override ngOnDestroy() { 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      this.detectChanges();
    }
  }

  handleOnToggleClick(event: any) {
    this.isOpen = !this.isOpen;
    this.detectChanges();

    this.onToggleOpen.emit(this.isOpen);
  }

  
}
