import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { SuccessListComponent } from './components/success-list/success-list.component';
import { WaitingListComponent } from './components/waiting-list/waiting-list.component';
import { FundingProcessComponent } from './funding-process.component';
import { FundingProcessResolver } from './funding-process.resolver';

const route: Route[] = [
    {
        path: '', component: FundingProcessComponent, resolve: {
            fundingProcess: FundingProcessResolver,
        }, children: [
            { path: '', pathMatch: 'full', redirectTo: 'waiting' },
            { path: 'success', component: SuccessListComponent },
            { path: 'error', component: ErrorListComponent },
            { path: 'waiting', component: WaitingListComponent },
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class FundingProcessRoutingModule { }
