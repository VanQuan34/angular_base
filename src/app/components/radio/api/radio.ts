import { ITooltip } from '../../tooltip/api/tooltip';

export interface IRadioItem {
    key?: any;
    active?: boolean;
    text?: string;
    label?: string;
    tooltip?: ITooltip;
    disable?: boolean;
}
