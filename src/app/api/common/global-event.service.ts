import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalEventService {
  // ACCOUNT SETTING
  onAccountSettingChange = new Subject();
  // TENANT
  onChangeInfoTenant = new Subject();
  onChangeInfoStaff = new Subject();

  // SOCIAL
  onSocialNotification = new Subject<IEventSocketSocial>();
  getTimeReAssignBySocials = new BehaviorSubject(null);

  // notification
  onNumberNotification = new Subject<number>();
  onReadNotify = new Subject<string>();
  onNewNotify = new Subject();
  onChangeConfigNotification = new BehaviorSubject<Array<IConfigNotification>>(null);

  // call center
  popupCallSubject = new Subject<IEventPopupCall>();
  checkRoleCallSubject = new BehaviorSubject<boolean>(false);
  currentAgentSubject = new BehaviorSubject<boolean>(true);

  //cdp
  popupCRMSubject = new Subject<IPopupCRM>();
  popupCRMSubjectData = new Subject();
  popupCRMBlockProfileDataSubject = new Subject<IEventBlockProfile>();

  onFocusInput = new Subject();
  //layout
  menuExpandSubjectData = new Subject();

  // SALE
  onSalelNotification = new Subject<IEventSocketSale>();

  // Ticket
  onTicketNotification = new Subject<IEventSocketSale>();

  //Task
  onTaskNotification = new Subject<IEventSocketSale>();

  private moMenuEvent: BehaviorSubject<TYPE_MENU_EVENT> = new BehaviorSubject({ type: 'menu-collapse', value: false });
  get MoMenuEvent() {
    return this.moMenuEvent;
  }
}
export interface IEventBlockProfile {
  profile_id: string;
  contact: string;
}
export interface IEventSocketSale {
  notification: boolean;
  data: any;
}
export interface IEventSocketSocial {
  type: ETypeEventSocketSocial;
  data: any;
}

export enum ETypeEventSocketSocial {
  NOTIFICATION_NEW
}

export interface IPhoneEventStatus {
  status: string;
  data: any;
  phone: string;
}

export interface IPopupCRM {
  key: string;
  payload: any;
}
export interface IEventPopupCall {
  type: TypePopupCallSubject;
  data: any;
}
export interface IConfigNotification {
  group: string;
  config: { [key: string]: any }
}


type TypePopupCallSubject =
  | 'pbxNumberDefault'
  | 'actionCallOut'
  | 'callScreen'
  | 'searchInfoChange'
  | 'userInfo'
  | 'callStatusDisplay'
  | 'displayPopup'
  | 'forwardScreen'
  | 'hasRoleCall'
  | 'minimize'
  | 'agentStatus'
  | 'currentAgent';
export type TYPE_MENU_EVENT = { type: string, value: any };
