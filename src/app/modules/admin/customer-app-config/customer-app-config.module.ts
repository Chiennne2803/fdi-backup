import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerAppConfigComponent } from './customer-app-config.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";
import { CustomerAppConfigRoutingModule } from './customer-app-config-routing.module';
import {CustomerAppConfigListComponent} from "./components/customer-app-config-list/customer-app-config-list.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    declarations: [
        CustomerAppConfigComponent,
        CustomerAppConfigListComponent,
    ],
    imports: [
        SharedModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatDialogModule,
        FuseCardModule,
        MatDatepickerModule,
        CurrencyMaskModule,
        TranslocoModule,
        CustomerAppConfigRoutingModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule
    ],
    providers: [DateTimeformatPipe]
})
export class CustomerAppConfigModule { }
