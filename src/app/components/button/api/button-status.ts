export interface IButtonStatus {
    label: string; // label of button
    type: string; // success,finished,wait,delete,draft,waiting_processing
    width?: number; // fix width
    class?: string; // class include,
    classFontLabelInclude?: string;
}
