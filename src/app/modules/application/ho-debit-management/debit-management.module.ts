import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { DebitManagementComponent } from './debit-management.component';
import {DetailDebitManagementComponent} from './detail-debit-management/detail-debit-management.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatTableModule} from '@angular/material/table';
import {ConfirmDebtComponent} from './confirm-debt/confirm-debt.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslocoModule} from "@ngneat/transloco";
import {MatExpansionModule} from "@angular/material/expansion";
import {CreateDebtHistoryDialogComponent} from "./create-history/create-debt-history-dialog.component";
import {DateTimeformatPipe} from "../../../shared/components/pipe/date-time-format.pipe";

const debtManagementRoutes: Route[] = [
    {
        path: '',
        component: DebitManagementComponent,
        children: [
            {
                path: ':id',
                component: DetailDebitManagementComponent,
            }
        ]
    }
];

const ANGULAR_MATERIAL = [
    MatSnackBarModule,
];

@NgModule({
    declarations: [
        DebitManagementComponent,
        DetailDebitManagementComponent,
        ConfirmDebtComponent,
        CreateDebtHistoryDialogComponent
    ],
    imports: [
        RouterModule.forChild(debtManagementRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        MatSidenavModule,
        MatTabsModule,
        MatDividerModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatDialogModule,
        FuseNavigationModule,
        MatTableModule,
        ...ANGULAR_MATERIAL,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        TranslocoModule,
        MatExpansionModule,
    ],
    providers: [DateTimeformatPipe]
})
export class DebitManagementModule {
}
