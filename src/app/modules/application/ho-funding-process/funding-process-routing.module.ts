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
            { path: 'success',data: { title: 'Danh sách đã phê duyệt yêu cầu tiền quỹ' }, component: SuccessListComponent },
            { path: 'error',data: { title: 'Danh sách lỗi yêu cầu tiền quỹ' }, component: ErrorListComponent },
            { path: 'waiting',data: { title: 'Danh sách chờ phê duyệt yêu cầu tiền quỹ' }, component: WaitingListComponent },
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
