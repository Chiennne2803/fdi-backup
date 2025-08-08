import {AuditModel} from '../base';
import {DashboardPanelDTO} from "./DashboardPanelDTO.model";
import {ChartDTO} from "../ChartDTO.model";

export class DashboardTabDTO extends AuditModel {

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


    tabTitle?: string;
    lstDasboad?: DashboardPanelDTO[];

    chartGrowthSales?: ChartDTO[];
    chartGrowthAccount?: ChartDTO[];
    chartGrowthPay?: ChartDTO[];
}
