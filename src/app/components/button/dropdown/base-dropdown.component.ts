import { Input, EventEmitter, Output, Component, Injectable } from '@angular/core';

// @Injectable()
export abstract class MoWbButtonBaseDropdownComponent {

    @Input() label: string;
    @Input() fieldClass: string; // change color label item of items
    @Input() fieldClassIconLeft: string; // iconclass item of items
    @Input() items: Array<any>; // requried
    @Input() fieldDisplay: any; // requried
    @Input() keyField: any;
    @Input() keySelected: string;
    @Input() applyNow: boolean; // if not applyNow: keyField is requried
    @Input() listPosition: string; // above or below

    @Output() onSelectItem: EventEmitter<any> = new EventEmitter();

    constructor() {

    }
}
