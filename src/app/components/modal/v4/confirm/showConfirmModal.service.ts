import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from "@angular/core";
import { MoWbModalV4ConfirmComponent } from "./confirm.component";

interface IConfirmModalParam {
  zIndex: number;
  type: 'SUCCESS' | 'SUCCESS1' | 'ERROR' | 'WARNING1' | 'WARNING2';
  title?: string;
  desc?: string;
  content: string;
  width?: string;
  label?: string;
  label1?: string;
  needHideMenu?: boolean;
  needClose?: 'TRUE' | 'FALSE';
  
  okButton1Callback?: () => void,
  okButton2Callback?: () => void,
  okButtonCallback?: () => void
}

@Injectable()

export class MoWbConfirmModalService {

  constructor(
    private _componentResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _appRef: ApplicationRef,
  ) {
  }

  /**
   * show confirm modal
   * @param params 
   */
  showModal(params: IConfirmModalParam) : ComponentRef<MoWbModalV4ConfirmComponent> {
    const notifyModalRef =  this._componentResolver.resolveComponentFactory(MoWbModalV4ConfirmComponent).create(this._injector);
    notifyModalRef.instance.type = params.type;
    notifyModalRef.instance.needClose
    if (params.title) {
      notifyModalRef.instance.title = params.title;
    }
    if (params.desc) {
      notifyModalRef.instance.desc = params.desc;
    }
    notifyModalRef.instance.content = params.content;
    notifyModalRef.instance.zIndex = params.zIndex + 100;
    notifyModalRef.instance.label = params.label;
    notifyModalRef.instance.label1 = params.label1;
    notifyModalRef.instance.width = params.width;
    notifyModalRef.instance.isHideMenu = params.needHideMenu;
    if (params.needClose) {
      notifyModalRef.instance.needClose = params.needClose === 'TRUE' ? true :false;
    }
   
    notifyModalRef.instance.onClose.subscribe((event: any) => { 
      this.removeComponentFromBody(notifyModalRef);
    });

    notifyModalRef.instance.onOkButton1.subscribe((event: any) => {
      if (params.okButton1Callback) {
        params.okButton1Callback();
      }
    });

    notifyModalRef.instance.onOkButton2.subscribe((event: any) => {
      if (params.okButton2Callback) {
        params.okButton2Callback();
      }
    });

    notifyModalRef.instance.onOk.subscribe((event: any) => {
      if (params.okButtonCallback) {
        params.okButtonCallback();
      }
    });
    
    this.addDomToBody(notifyModalRef);

    return notifyModalRef;
  }
  /**
   * add dom to body
   * @param componentRef 
   * @returns 
   */
  public addDomToBody(componentRef: any) {
		if (!componentRef || !componentRef.hostView) {
			return;
		}
		this._appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);
  }

  /**
   * remove comp from body
   * @param componentRef 
   * @returns 
   */
  public removeComponentFromBody(componentRef: any) {
		if (!componentRef) {
			return;
		}
		if (componentRef.hostView) {
			this._appRef.detachView(componentRef.hostView);
		}

		if (componentRef.destroy) {
			componentRef.destroy();
		}
	}
}