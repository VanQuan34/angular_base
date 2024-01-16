import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IModalButton, IContentLine, IModalHeaderConfig } from './api/modal-api';

@Component({
	selector: 'mo-wb-components-modal',
	templateUrl: 'modal.component.html',
	styleUrls: ['modal.component.scss']
})
export class MoWbModalComponent implements OnInit, AfterViewInit {
	isOpen: boolean;
	fixZIndex: number = 0;

	@Input() title: string;
	@Input() width!: string;
	@Input() height!: string;
	@Input() maxWidth: string;
	@Input() maxHeight: string;
	@Input() isHeightAutoSize: boolean;
	@Input() classIconClose: string;
	@Input() content!: Array<IContentLine>;
	@Input() buttons: Array<IModalButton> = new Array<IModalButton>();
	@Input() ignoreFooter: boolean = false;
	@Input() zIndex: number = 0;
	@Input() headerConfig: IModalHeaderConfig;
	@Input() defaultFooter: boolean;
	@Input() disableButtonClose: boolean = false;
	@Input() ignoreButtonClose: boolean = false;
	@Input() hasBackButton: boolean = false;
	@Input() ignoreBorderRadius: boolean = false;
	@Input() classTitleInclude!: string;
	@Input() hasCollapseBtn: boolean = false;
	@Input() isCollapse: boolean = false;

	@Output() onClose = new EventEmitter<any>();
	@Output() onCancel = new EventEmitter<any>();
	@Output() onHandleButton = new EventEmitter<any>();
	@Output() onBack = new EventEmitter<any>();
	@Output() onCollapseChange = new EventEmitter<boolean>();


	@ViewChild('viewContainerRef') _containerRef!: ElementRef;
	@ViewChild('elContent') _elContent!: ElementRef;

	constructor(private elementRef: ElementRef, private domSanitizer: DomSanitizer, private _changeDetection: ChangeDetectorRef) {
		this.maxWidth = '1098px';
		this.maxHeight = '801px';
		this.isOpen = false;
		this.title = '';
		this.isHeightAutoSize = false;
		this.headerConfig = {
			ngClass: {},
			ngStyle: {}
		};
		this.defaultFooter = false;
	}

	ngOnInit() {
		this.fixZIndex = 2500 //ZIndex.modal;
	}

	ngAfterViewInit() {
		this.setNotificationContent();
		this._changeDetection.detectChanges();
	}

	public open() {
		this.isOpen = true;
		this._changeDetection.detectChanges();
	}

	public hide() {
		this.isOpen = false;
		this.onClose.emit();
		this._changeDetection.detectChanges();
	}

	public onHandleCancelButtonClick() {
		this.onCancel.emit({});
		this.hide();
		this._changeDetection.detectChanges();
	}

	public setNotificationContent() {
		if (!this.content) {
			return;
		}
		this._elContent.nativeElement.style.display = 'block';
		this.content.forEach((item, index) => {
			const div = document.createElement('div');
			div.innerHTML = this.domSanitizer.sanitize(SecurityContext.HTML, item.text) || '';
			if (index !== this.content.length - 1) {
				div.className = 'mo-wb-mb-4px';
			}
			if (item.class) {
				div.className = item.class;
			}
			this._elContent.nativeElement.appendChild(div);
		});
		this._changeDetection.detectChanges();
	}

	public close(event: Event) {
		event.stopPropagation();
		this.onHandleCancelButtonClick();
		this._changeDetection.detectChanges();
	}

	public onHandleButtonClick(e: Event, item: IModalButton) {
		e.stopPropagation();
		if (item && item.disable) {
			return;
		}
		if (item && item.action) {
			item.action(item.params);
		}
		this._changeDetection.detectChanges();
	}

	public onHandleBackButtonClick(e: Event) {
		e.stopPropagation();
		this.onBack.emit(e);
		this._changeDetection.detectChanges();
	}

	public onHandleButtonAgreeClick(e: Event) {
		e.stopPropagation();
		this.onHandleButton.emit(e);
		this._changeDetection.detectChanges();
	}

	hiddenOrShowContent(event: Event) {
		event.stopPropagation();
		if (!this.hasCollapseBtn) {
			return;
		}
		this.isCollapse = !this.isCollapse;
		this.onCollapseChange.emit(this.isCollapse);
		this._changeDetection.detectChanges();
	}

	handleOnClickClosePopup(e: MouseEvent){
		// this.onClose.emit();
		// this.hide();
		this._changeDetection.detectChanges();
	}

	handleOnClickInside(e: MouseEvent){
		e.stopPropagation();
	}
}