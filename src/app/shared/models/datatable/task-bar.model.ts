export class SearchBar {
    constructor(
        public placeholder: string = '',
        public isShowBtnFilter: boolean = false,
        public btnFilterRole?: string,
        public searchBarRole?: string,
    ) { }
}

export class CommonButtonConfig {
    constructor(
        public type?: string,
        public label?: string,
        public role?: string,
        public fileName?: string,
        public icon?: string,
    ) { }
}

export class ButtonConfig {
    constructor(
        public role: string,
        public isBtn: boolean = true,
        public isConfigDatatable: boolean = false,
        public label?: string,
        public icon?: string,
        public action?: 'add' | 'dialog-search' | 'cancel' | 'payment' | 'deleted' | 'update-rate' | 'approve' | 'sign-process',
        public color?: 'primary' | 'basic',
        public buttonType?: 'mat-flat-button' | 'mat-icon-button' | 'mat-stroked-button' | 'mat-raised-button',

    ) { }
}

export interface TaskBarConfig {
    searchBar?: SearchBar;
    otherBtn?: ButtonConfig[];
}

export interface DataTableButtonConfig {
    commonBtn?: CommonButtonConfig[];
    otherBtn?: ButtonConfig[];
}
