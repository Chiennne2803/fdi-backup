import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {AccessLogComponent} from './access-log.component';
import {ROUTER_CONST} from '../../../shared/constants';
import {StaffComponent} from './staff/staff.component';
import {InvestorComponent} from './investor/investor.component';
import {LenderComponent} from './lender/lender.component';
import {InvestorResolver} from './investor/investor.resolver';
import {StaffResolver} from './staff/staff.resolver';
import {LenderResolver} from './lender/lender.resolver';

const route: Route[] = [
    {
        path: '',
        component: AccessLogComponent,
        children: [
            {
                path: '',
                component: StaffComponent,
                resolve: {draftTrans: StaffResolver}
            },
            {
                path: ROUTER_CONST.config.admin.accessLogs.investor.root,
                component: InvestorComponent,
                resolve: {waitProcessTrans: InvestorResolver}
            },
            {
                path: ROUTER_CONST.config.admin.accessLogs.lender.root,
                component: LenderComponent,
                resolve: {processTrans: LenderResolver}
            },
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(route)]
})
export class AccessLogRoutingModule { }
