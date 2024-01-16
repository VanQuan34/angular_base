import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef } from '@angular/core';
import { MoWbModalComponent } from '../../components/modal/modal.component';
// import { IModalConfig } from '../../components/modal/api/modal-api';
//import { ISubscription } from 'rxjs/Subscription';

@Injectable({
	providedIn: 'root'
  })
export class AddComponentToBodyService {
	private notificationModalRef!: ComponentRef<MoWbModalComponent>;
	private notificationSubscribe: Array<any>;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) {
		this.notificationSubscribe = [];
	}

	public resolveComponentFactory(component: any): ComponentRef<any> {
		return this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
	}

	public addDomToBody(componentRef: any) {
		if (!componentRef || !componentRef.hostView) {
			return;
		}
		this.appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);
	}

	public addDomToElement(componentRef: any, elementAdd: any) {
		if (!componentRef || !componentRef.hostView || !elementAdd) {
			return;
		}
		this.appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		return elementAdd.appendChild(domElem);
	}

	public addDomToContentLayout(componentRef: any) {
		const elementAdd = document.getElementById('mo-layout-content');
		if (!componentRef || !componentRef.hostView || !elementAdd) {
			return null;
		}
		this.appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		return elementAdd.appendChild(domElem);
	}

	public removeComponentFromBody(componentRef: any) {
		if (!componentRef) {
			return;
		}
		if (componentRef.hostView) {
			this.appRef.detachView(componentRef.hostView);
		}

		if (componentRef.destroy) {
			componentRef.destroy();
		}
	}


	public appendModalComponentToBody() {
		const componentRef = this.resolveComponentFactory(MoWbModalComponent);
		this.addDomToBody(componentRef);
		return componentRef;
	}

	public hideNotificationModal() {
		if (this.notificationModalRef) {
			this.notificationModalRef.instance.hide();
		}
	}

	public cancelNotificationModal() {
		if (this.notificationSubscribe && this.notificationSubscribe.length) {
			this.notificationSubscribe.forEach(item => item.unsubscribe());
			this.notificationSubscribe = [];
		}
		if (this.notificationModalRef) {
			this.notificationModalRef.instance.onHandleCancelButtonClick();
		}
	}

}
