import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {CreateLoanComponent} from './create-loan.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {CreateLoanResolvers} from './create-loan.resolvers';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const createLoanRoutes: Route[] = [
    {
        path     : '',
        component: CreateLoanComponent,
        resolve: {
            createLoan: CreateLoanResolvers,
        }
    }
];

@NgModule({
    declarations: [
        CreateLoanComponent
    ],
  imports: [
    RouterModule.forChild(createLoanRoutes),
    SharedModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    NgxDropzoneModule,
    CurrencyMaskModule,
    TranslocoModule,
  ]
})
export class CreateLoanModule
{
}
