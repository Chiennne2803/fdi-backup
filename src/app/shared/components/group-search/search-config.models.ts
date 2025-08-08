export interface IDropList {
  value: string | number;
  label: string;
}

export interface ISearchCommon {
  id: string;
  type: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  format?: number | string;
  defaultValue?: string | Date;
  dataFrom?: IDropList[];
  dataTo?: IDropList[];
  validtorType?: string | null;
  distanceDate?: number | 180;
  required?: boolean | false;
  requiredMsg?: string | null;
}

export class InputSearch implements ISearchCommon {
  public type = 'input';
  public constructor(
    public id: string,
    public name: string,
    public placeholder: string = '',
    public disabled: boolean = false,
    public format?: number | string,
    public validatorType: string | null = null,
    public dataDialogSeach?: any,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class DropListSearch implements ISearchCommon {
  public type = 'select';
  public constructor(
    public id: string,
    public name: string,
    public dataFrom: IDropList[],
    public defaultValue: string,
    public isMulti?: boolean,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class DateTimeSearch implements ISearchCommon {
  public type = 'date';
  public constructor(
    public id: string,
    public name: string,
    public placeholder: string = '',
    public disabled: boolean = false,
    public format?: number | string,
    public defaultValue?: Date,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class FromToSearch implements ISearchCommon {
  public type = 'input-from-to';
  public constructor(
    public id: string,
    public name: string,
    public placeholder: string = '',
    public format?: number | string,
    public defaultValue?: Date,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class DropListFromToSearch implements ISearchCommon {
  public type = 'select-from-to';
  public constructor(
    public id: string,
    public name: string,
    public dataFrom: IDropList[],
    public dataTo: IDropList[],
    public defaultValue?: string,
    public placeholder: string = '',
    public disabled: boolean = false,
    public format?: number | string,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class DateTimeFromToSearch implements ISearchCommon {
  public type = 'date-from-to';
  public constructor(
    public id: string,
    public name: string,
    public placeholder: string = '',
    public disabled: boolean = false,
    public format?: number | string,
    public defaultValue?: Date,
    public distanceDate?: number | 180,
    public required: boolean = false,
    public requiredMsg: string = '',
  ) { }
}

export class CheckBoxSearch implements ISearchCommon {
    public type = 'checkbox';
    public constructor(
        public id: string,
        public name: string,
        public value?: string,
        public checked?: boolean,
        public required: boolean = false,
        public requiredMsg: string = '',
    ) { }
}

export interface IButtonConfig {
  btnSearchIcon: boolean;
  btnSearchLabel?: boolean;
  btnExportCsv?: boolean;
  btnAddMore?: boolean;
}

export class ButtonConfig implements IButtonConfig {
  public constructor(
    public btnSearchIcon: boolean = true,
    public btnAddMore: boolean = false,
    public btnSearchLabel: boolean = false,
    public btnExportCsv: boolean = false
  ) { }
}


export interface IConfigSearch {
  title: string;
  config: Array<ISearchCommon>;
}
