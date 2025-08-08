import {AuditModel} from '../base';
export class DashboardPanelDTO extends AuditModel {

    title?: string;
    mainNumber?: number;
    mainSuffix?: string;
    mainType?: string;
    mainColor?: string;

    secondTitle?: string;
    secondNumber?: number;
    secondSuffix?: string;
    secondType?: string;
    secondColor?: string;
    position?: number;
}
