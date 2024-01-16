

export interface IMoWbLabel {
    text: string;
    tooltip?: IMoWbLabelTooltip;
    iconClass?: any;
    notRequired?: boolean;
    limitLength?: number;
    classInclude?: string;
    classFontInclude?: string;
    classLimitInclude?: string;
    description?: string;
    classDescInclude?: string;
    classToggleInclude?: string;
}

export interface IMoWbLabelTooltip {
    content?: string;
    width?: number;
    iconClass?: string;
    maxWidth?: number;
    maxHeight?: number;
}

export interface ILabelRight {
    content?: string;
    iconClass?: string;
    width?: number;
    classInclude?: string;
    label?: string;
}
