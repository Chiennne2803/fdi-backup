export interface IOption {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

export interface IDisplayColumn {
    id: string;
    type: string;
    name: string;
    viewDetail?: boolean;
    weight?: number;
    statusObject?: any;
    alignCenter?: boolean;
    alignRight?: boolean;
    showTooltip?: boolean;
    tooltipAlign?: string;
    className?: string;
    options?: Array<IOption>;
    orderable?: boolean; // this can be either boolean or string id (for backward compatiable), to fix nested object compatibility;
    clickable?: boolean;
    disabled?: boolean;
    sticky?: boolean;
    stickyEnd?: boolean;
    localizedTextList?: string;
    format?: string | number;
    showSelectAll?: boolean;
    isShow?: boolean;
    textButton?: string;
    mapId?: string;
}

export class TextColumn implements IDisplayColumn {
    public type = 'text';
    public constructor(
        public id: string,
        public name: string,
        public weight?: number,
        public viewDetail: boolean = false,
        public format?: string | number,
        public showTooltip: boolean = false,
        public alignRight: boolean = false,
        public tooltipAlign?: string,
        public sticky?: boolean,
        public alignCenter: boolean = false,
        public className?: string,
        public stickyEnd?: boolean,
        public orderable: boolean = true,
        public isShow: boolean = true,
    ) { }
}

export class TransactionAmountColumn implements IDisplayColumn {
    public type = 'transaction-amount';
    public constructor(
        public id: string,
        public name: string,
        public weight?: number,
        public viewDetail: boolean = false,
        public format?: string | number,
        public showTooltip: boolean = false,
        public alignRight: boolean = false,
        public tooltipAlign?: string,
        public sticky?: boolean,
        public alignCenter: boolean = false,
        public className?: string,
        public stickyEnd?: boolean,
        public orderable: boolean = true,
        public isShow: boolean = true,
    ) { }
}

export class TextToolTipColumn implements IDisplayColumn {
    public type = 'text-tool-tip';
    public constructor(
        public id: string,
        public name: string,
        public weight?: number,
        public viewDetail: boolean = false,
        public format?: string | number,
        public showTooltip: boolean = false,
        public alignRight: boolean = false,
        public tooltipAlign?: string,
        public sticky?: boolean,
        public alignCenter: boolean = false,
        public className?: string,
        public stickyEnd?: boolean,
        public orderable: boolean = true,
        public isShow: boolean = true,
    ) { }
}

export class CheckedColumn implements IDisplayColumn {
    public type = 'checked';
    public constructor(
        public id: string,
        public name: string,
        public weight?: number,
        public viewDetail: boolean = false,
        public format?: string | number,
        public showTooltip: boolean = false,
        public alignRight: boolean = false,
        public tooltipAlign?: string,
        public sticky?: boolean,
        public alignCenter: boolean = false,
        public className?: string,
        public stickyEnd?: boolean,
        public orderable: boolean = true,
        public isShow: boolean = true,
    ) { }
}

export class SelectColumn implements IDisplayColumn {
    public type = 'select';
    public constructor(
        public id: string,
        public name: string,
        public weight?: number,
        public orderable: boolean = true,
        public showSelectAll: boolean = false,

        public alignCenter?: boolean,
        public alignRight?: boolean,
        public className?: string,

        public clickable?: boolean,
        public disabled?: boolean,
        public sticky?: boolean,
        public stickyEnd?: boolean,
        public isShow: boolean = true,
    ) { }
}

export class NumberColumn implements IDisplayColumn {
    public type = 'number';
    public constructor(
        public id: string,
        public name: string,
        public weight: number,
        public orderable: boolean = true,
        public alignCenter?: boolean,
        public alignRight?: boolean,
        public clickable?: boolean,
        public format?: number, // ex: 1, 2 will formatted 0.1, 0.11
        public sticky?: boolean,
        public stickyEnd?: boolean,
        public isShow: boolean = true,
    ) { }
}

export class StatusColumn implements IDisplayColumn {
    public type = 'status';
    public constructor(
        public id: string,
        public name: string,
        public weight: number,
        public statusObject: any,
        public orderable: boolean = true,
        public alignCenter?: boolean,
        public alignRight?: boolean,
        public clickable?: boolean,
        public sticky?: boolean,
        public stickyEnd?: boolean,
        public localizedTextList?: string,
        public isHtml?: boolean,
        public isShow: boolean = true,
    ) { }
}

export class OptionColumn implements IDisplayColumn {
    public type = 'options';
    public id = 'options';
    public name = 'Options';
    public alignRight = false;
    public showSelectAll = false;

    public constructor(
        public options: Array<IOption>,
        public weight: number,
        public sticky?: boolean,
        public stickyEnd?: boolean
    ) { }
}

export class OptionMenuColumn implements IDisplayColumn {
    public type = 'menu';
    public id = 'menu';
    public name = 'Options';
    public alignRight = false;
    public showSelectAll = false;

    public constructor(
        public options: Array<IOption>,
        public weight: number,
        public sticky?: boolean,
        public stickyEnd?: boolean
    ) { }
}

export class OptionButtonColumn implements IDisplayColumn {
    public type = 'button';
    public id = 'button';
    public name = 'Options';
    public alignRight = false;
    public showSelectAll = false;

    public constructor(
        public options: Array<IOption>,
        public weight: number,
        public sticky?: boolean,
        public stickyEnd?: boolean
    ) { }
}

export class CheckboxColumn implements IDisplayColumn {
    public type = 'selection';
    public id = 'selection';
    public name = 'common-names.select';

    public constructor(
        public showSelectAll: boolean = true,
        public sticky: boolean = false,
        public alignCenter: boolean = true,
        public isShow: boolean = true,

    ) { }
}

export class IndexColumn implements IDisplayColumn {
    public type = 'index';

    public constructor(
        public id: string,
        public name: string,
        public weight: number,
        public orderable?: boolean,
        public alignCenter?: boolean,
        public sticky?: boolean,
        public isShow: boolean = true,
    ) { }
}

export class DateTimeColumn implements IDisplayColumn {
    public type = 'date';

    public constructor(
        public id: string,
        public name: string,
        public weight: number,
        public orderable: boolean = true,
        public alignRight?: boolean,
        public clickable?: boolean,
        public format: string = 'YYYY/MM/DD',
        public sticky?: boolean,
        public stickyEnd?: boolean
    ) { }
}

export class ButtonActionColumn implements IDisplayColumn{
    public type = 'button-action';

    public constructor(
        public id: string,
        public name: string,
        public format: string,
        public textButton: string,
) { }
}

export class TextColorColumn implements IDisplayColumn {
    public type = 'text-color';
    public constructor(
        public id: string,
        public name: string,
        public weight: number,
        public mapId: string,
        public statusObject: any,
        public orderable: boolean = true,
        public alignCenter?: boolean,
        public alignRight?: boolean,
    ) { }
}

export class ExpandColumn implements IDisplayColumn {
    public type = 'expand-column';
    public constructor(
        public id: string,
        public name: string,
        public weight: number,
    ) { }
}
