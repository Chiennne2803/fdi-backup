import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LenderRefundComponent } from './lender-refund.component';
import {WaitPayTransComponent} from './wait-pay-trans/wait-pay-trans.component';
import {WaitPayTransResolver} from './wait-pay-trans/wait-pay-trans.resolver';
import {ROUTER_CONST} from '../../../shared/constants';
import {WaitProcessTransComponent} from './wait-process-trans/wait-process-trans.component';
import {WaitProcessTransResolver} from './wait-process-trans/wait-process-trans.resolver';
import {WaitApproveTransComponent} from './wait-approve-trans/wait-approve-trans.component';
import {WaitApproveTransResolver} from './wait-approve-trans/wait-approve-trans.resolver';
import {ProcessedTransComponent} from './processed-trans/processed-trans.component';
import {ProcessedTransResolver} from './processed-trans/processed-trans.resolver';
import {ErrorTransComponent} from './error-trans/error-trans.component';
import {ErrorTransResolver} from './error-trans/error-trans.resolver';
import {TimeoutTransComponent} from './timeout-trans/timeout-trans.component';
import {TimeoutTransResolver} from './timeout-trans/timeout-trans.resolver';

const router: Route[] = [
    {
        path: '',
        component: LenderRefundComponent,
        children: [
            {
                path: '',
                component: WaitPayTransComponent,
                resolve: {
                    waitPayTransResolver: WaitPayTransResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.waitProcessTransaction.root,
                component: WaitProcessTransComponent,
                resolve: {
                    waitPayTransResolver: WaitProcessTransResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.waitApproveTrans.root,
                component: WaitApproveTransComponent,
                resolve: {
                    waitPayTransResolver: WaitApproveTransResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.processedTrans.root,
                component: ProcessedTransComponent,
                resolve: {
                    waitPayTransResolver: ProcessedTransResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.errorTrans.root,
                component: ErrorTransComponent,
                resolve: {
                    waitPayTransResolver: ErrorTransResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.timeoutTrans.root,
                component: TimeoutTransComponent,
                resolve: {
                    waitPayTransResolver: TimeoutTransResolver
                }
            }
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class LenderRefundRoutingModule { }
