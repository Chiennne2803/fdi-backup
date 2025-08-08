import {AuditModel} from '../base';
import {DashboardPanelDTO} from "./DashboardPanelDTO.model";
import {DashboardTabDTO} from "./DashboardTabDTO.model";

export class DashboardDTO extends AuditModel {
    topHeader?: DashboardPanelDTO;
    tab1?: DashboardTabDTO;
    tab2?: DashboardTabDTO;
    tab3?: DashboardTabDTO;
}
