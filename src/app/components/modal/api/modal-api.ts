export interface IModalButton {
    label?: string;
    type?: string;
    classLabel?: string;
    classInclude?: string;
    classIconLeft?: string;
    classIconRight?: string;
    action?: any;
    disable?: boolean;
    params?: IModalActionParam;
}

export interface IContentLine {
    text: string;
    class?: string;
}

export interface IModalActionParam {
    tabIndex?: number;
    keys?: Array<string>;
    items?: Array<any>;
    single?: boolean;
    tab?: any;
    finishCallback?: Function;
    cancelCallback?: Function;
    otherCallback?: Function;
}

export interface IModalConfig {
    content: Array<IContentLine>;
    buttons: Array<IModalButton>;
    headerConfig?: IModalHeaderConfig;
    cancelFunc?: Function;
    closeFunc?: Function;
    backFunc?: Function;
    title?: string;
    zIndex?: number;
    params?: any;
    hasBackButton?: boolean;
}

export interface IModalHeaderConfig {
    ngStyle?: Object;
    ngClass?: Object;
}
