import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FuseNavigationModule} from '../../../../../@fuse/components/navigation';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ProfilesApproveComponent} from './approve/profiles-approve.component';
import {
    ProfilesApproveResolver, ProfilesArchiveResolver,
    ProfilesDisbursementResolver,
    ProfilesRejectResolver, ProfilesWaitPaymentResolver
} from './profiles-management.resolver';
import {ProfilesDisbursementComponent} from './disbursement/profiles-disbursement.component';
import {ProfilesWaitPaymentComponent} from './wait-payment/profiles-wait-payment.component';
import {ProfilesArchiveComponent} from './archive/profiles-archive.component';
import {ProfilesManagementComponent} from '../profiles-management.component';
import {ProfilesReviewingComponent} from '../reviewing/profiles-reviewing.component';
import {ProfilesRejectComponent} from './reject/profiles-reject.component';
import {LoanDetailComponent} from './detail/loan-detail.component';
import {SharedModule} from '../../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {ProfilesReceptionComponent} from '../reception/profiles-reception.component';
import {ProfilesReReviewingComponent} from '../re-reviewing/profiles-re-reviewing.component';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FuseCardModule} from "../../../../../@fuse/components/card";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                path: 'approve',
                component: ProfilesApproveComponent,
                resolve: {
                    reviewing: ProfilesApproveResolver,
                }
            },
            {
                path: 'reject',
                component: ProfilesRejectComponent,
                resolve: {
                    reviewing: ProfilesRejectResolver,
                }
            },
            {
                path: 'disbursement',
                component: ProfilesDisbursementComponent,
                resolve: {
                    reviewing: ProfilesDisbursementResolver,
                }
            },
            {
                path: 'wait-payment',
                component: ProfilesWaitPaymentComponent,
                resolve: {
                    reviewing: ProfilesWaitPaymentResolver,
                }
            },
            {
                path: 'archive',
                component: ProfilesArchiveComponent,
                resolve: {
                    reviewing: ProfilesArchiveResolver,
                }
            },
        ],
    }
];

@NgModule({
    declarations: [
        ProfilesReceptionComponent,
        ProfilesManagementComponent,
        ProfilesReviewingComponent,
        ProfilesReReviewingComponent,
        ProfilesApproveComponent,
        ProfilesRejectComponent,
        ProfilesDisbursementComponent,
        ProfilesWaitPaymentComponent,
        ProfilesArchiveComponent,
        LoanDetailComponent,
    ],
    exports: [
        LoanDetailComponent
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        FuseNavigationModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule,
        MatTooltipModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        TranslocoModule,
        MatPaginatorModule,
        MatTableModule,
        MatRadioModule,
        MatCheckboxModule,
        FuseCardModule
    ]
})
export class ArchiveModule
{
}
