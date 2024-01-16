import { TemplateRef } from '@angular/core';

export interface IButton {
    class?: string;
    key?: string;
    type?: string;
    label?: string;
    listWidth?: string; // sử dụng cho button dropdown trong table
    disable?: boolean;
    classInclude?: string;
    classIconLeft?: string;
    classIconRight?: string;
    classLabel?: string;
    tooltipContent?: string;
    maxWidthTooltip?: number;
    maxHeightTooltip?: number;
    templateOutlet?: TemplateRef<any>;
    timeHideTooltipOnMouseout?: number;
    getDataButtonDropdown?: Function; // sử dụng cho button dropdown trong table
    isPending?: boolean;
    noContentTooltipPadding?: boolean;
    ignoreCaculatorMaxHeightTooltipContent?: boolean;
}
