import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {InvestorRefundComponent} from './investor-refund.component';
import {ROUTER_CONST} from '../../../shared/constants';
import {DraftTransComponent} from './draft-trans/draft-trans.component';
import {WaitProcessTransComponent} from './wait-process-trans/wait-process-trans.component';
import {ProcessedTransComponent} from './processed-trans/processed-trans.component';
import {WaitProcessTransResolver} from './wait-process-trans/wait-process-trans.resolver';
import {DraftTransResolver} from './draft-trans/draft-trans.resolver';
import {ProcessedTransResolver} from './processed-trans/processed-trans.resolver';

const route: Route[] = [
    {
        path: '',
        component: InvestorRefundComponent,
        children: [
            {
                path: '',
                component: DraftTransComponent,
                resolve: {draftTrans: DraftTransResolver}
            },
            {
                path: ROUTER_CONST.config.application.investorRefund.waitProcessTransaction.root,
                component: WaitProcessTransComponent,
                resolve: {waitProcessTrans: WaitProcessTransResolver}
            },
            {
                path: ROUTER_CONST.config.application.investorRefund.processedTrans.root,
                component: ProcessedTransComponent,
                resolve: {processTrans: ProcessedTransResolver}
            },
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(route)]
})
export class InvestorRefundRoutingModule { }
