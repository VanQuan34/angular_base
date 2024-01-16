import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IButton } from '../api/button';

@Component({
    selector: 'mo-wb-components-button-group',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.scss']
})
export class MoWbButtonGroupComponent implements OnInit {
    @Input() buttons: Array<IButton>;
    @Input() demoMode: boolean;
    @Input() indexActive: number;
    @Input() disable: boolean;

    @Output() onClick: EventEmitter<{ index: number, button: IButton }> = new EventEmitter();

    constructor() {
        this.indexActive = 0;
    }

    ngOnInit() {
        if (this.demoMode) {
            this.buttons = [{ label: 'button 1' }, { label: 'button 2' }, { label: 'button 3' }];
        }
    }

    clickButton(index: number, button: IButton) {
        this.indexActive = index;
        this.onClick.emit({ index: this.indexActive, button: button });
    }
}
