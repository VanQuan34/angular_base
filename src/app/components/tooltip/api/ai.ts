export interface IAI {
    title?: string;
    undo?: boolean;
    body?: IAIBody;
    ignoreTooltip?: boolean;
}

export interface IAIBody {
    title: string;
    content: string;
    interpolateParams: any;
}
