import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
declare var IntegrateMicroSites: any;

@Injectable({
	providedIn: 'root', // or specify a module
  })
export class ToastTranslateService {

	constructor(
		private _toast: ToastrService,
		private _translate: TranslateService) {
	}

	show(type: 'success' | 'warning' | 'error' | 'info', message: string, interpolateParams?: Object, title?: string) {
		let messageTranslate = this._translate.instant(`${message || ' '}`);
		if (interpolateParams) {
			messageTranslate = this._translate.instant(message, interpolateParams);
		}
		switch (type) {
			case 'success':
				this._toast.success(messageTranslate, title);
				break;
			case 'error':
				this._toast.error(messageTranslate, title);
				break;
			case 'warning':
				this._toast.warning(messageTranslate, title);
				break;
			case 'info':
				this._toast.info(messageTranslate, title);
				break;
			default:
				break;
		}
		
	}

	get ToastService() {
		return this._toast;
	}

	get TranslateService() {
		return this._translate;
	}

}
