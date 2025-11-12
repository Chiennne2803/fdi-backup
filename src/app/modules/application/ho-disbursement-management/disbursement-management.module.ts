import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {
    DraftTransaction,
    SuccessTransaction,
    WaitProcessTransaction
} from './disbursement-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DisbursementManagementComponent} from './disbursement-management.component';
import {AsyncPipe, NgIf, NgStyle} from '@angular/common';
import {DraftTransactionComponent} from './draft-transaction/draft-transaction.component';
import {SuccessTransactionComponent} from './success-transaction/success-transaction.component';
import {WaitingProcessTransactionComponent} from './waiting-process-transaction/waiting-process-transaction.component';
import {DetailDisbursementManagementComponent} from './detail-disbursement-management/detail-disbursement-management.component';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from 'app/shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SignProcessComponent} from './dialogs/sign-process/sign-process.component';
import {CreateRequestComponent} from './dialogs/create-request/create-request.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path: '',
        component: DisbursementManagementComponent,
        children: [
            {
                data: { title: 'Soạn thảo' },
                path: '',
                component: DraftTransactionComponent,
                resolve: {
                    error: DraftTransaction,
                },
            },
            {
                data: { title: 'Chờ xử lý' },
                path: 'waiting-process-transaction',
                component: WaitingProcessTransactionComponent,
                resolve: {
                    waiting: WaitProcessTransaction,
                },
            },
            {
                data: { title: 'Đã xử lý' },
                path: 'success-transaction',
                component: SuccessTransactionComponent,
                resolve: {
                    success: SuccessTransaction,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        DisbursementManagementComponent,
        DraftTransactionComponent,
        SuccessTransactionComponent,
        WaitingProcessTransactionComponent,
        DetailDisbursementManagementComponent,
        SignProcessComponent,
        CreateRequestComponent,
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatDividerModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatDialogModule,
        FuseNavigationModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        NgIf,
        AsyncPipe,
        NgStyle,
        NgxTrimDirectiveModule,
        TranslocoModule
    ]
})
export class DisbursementManagementModule {
}
