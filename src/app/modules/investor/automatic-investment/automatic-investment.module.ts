import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { Route, RouterModule } from '@angular/router';
import { AutomaticInvestmentComponent } from './automatic-investment.component';
import {AutomaticInvestmentHeaderComponent} from './automatic-investment-header/automatic-investment-header.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../../../shared/shared.module';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {AutoInvestmentRechargeComponent} from './auto-investment-recharge-dialog/auto-investment-recharge.component';
import { TranslocoModule } from '@ngneat/transloco';
import {MatTableModule} from "@angular/material/table";

const route: Route[] = [
    {
        path: '',
        component: AutomaticInvestmentComponent
    }
];

@NgModule({
    declarations: [
        AutomaticInvestmentComponent,
        AutomaticInvestmentHeaderComponent,
        AutoInvestmentRechargeComponent,
    ],
    imports: [
        RouterModule.forChild(route),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        MatDialogModule,
        FuseCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        CurrencyMaskModule,
        TranslocoModule,
        TranslocoModule,
    ]
})

export class AutomaticInvestmentModule {}
