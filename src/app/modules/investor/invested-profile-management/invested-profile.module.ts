import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InvestedProfileComponent } from 'app/modules/investor/invested-profile-management/invested-profile.component';
import { InvestedProfileComponent as InvestedProfileComponentChild } from 'app/modules/investor/invested-profile-management/invested/invested-profile.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {WaitingProfileComponent} from './waiting/waiting-profile.component';
import {InvestingProfileComponent} from './investing/investing-profile.component';
import {RejectedProfileComponent} from './rejected/rejected-profile.component';
import {
    InvestedProfileInvestedResolvers,
    InvestedProfileInvestingResolvers,
    InvestedProfileRejectedResolvers,
    InvestedProfileWaitingResolvers
} from './invested-profile.resolvers';
import {DetailProfileComponent} from './detail-profile/detail-profile.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AsyncPipe, NgIf, NgStyle} from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from '../../../shared/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        component: InvestedProfileComponent,
        children: [
            {
                path: '',
                component: WaitingProfileComponent,
                resolve: {
                    waiting: InvestedProfileWaitingResolvers,
                },
            },
            {
                path: 'investing',
                component: InvestingProfileComponent,
                resolve: {
                    investing: InvestedProfileInvestingResolvers,
                },
            },
            {
                path: 'invested',
                component: InvestedProfileComponentChild,
                resolve: {
                    invested: InvestedProfileInvestedResolvers,
                },
            },
            {
                path: 'rejected',
                component: RejectedProfileComponent,
                resolve: {
                    rejected: InvestedProfileRejectedResolvers,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        InvestedProfileComponent,
        WaitingProfileComponent,
        InvestingProfileComponent,
        InvestedProfileComponentChild,
        RejectedProfileComponent,
        DetailProfileComponent,
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        FuseNavigationModule,
        MatTabsModule,
        NgIf,
        AsyncPipe,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        NgStyle,
        FuseCardModule,
        MatIconModule,
        SharedModule,
        MatPaginatorModule,
        MatTableModule,
        TranslocoModule,
    ]
})
export class InvestedProfileModule
{
}
