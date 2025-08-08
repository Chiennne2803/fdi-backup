export class ButtonAction {
    constructor(
        public action: 'new' | 'edit' | 'lock' | 'unlock' | 'export' | 'deleted',
        public dataItem?: any
    ) { }
};
