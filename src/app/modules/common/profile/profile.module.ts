import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuseAlertModule } from '../../../../@fuse/components/alert';
import { FuseNavigationModule } from '../../../../@fuse/components/navigation';
import { AccountManagerComponent } from './components/account-manager/account-manager.component';
import {
    BiggestCapitalContributorComponent
} from './components/biggest-capital-contributor/biggest-capital-contributor.component';
import { BusinessActivityComponent } from './components/file-business-activity/business-activity.component';
import { ChangeGpkdDialogComponent } from './components/change-gpkd-dialog/change-gpkd-dialog.component';
import { ChangeIdentificationComponent } from './components/change-identification-dialog/change-identification.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { CloseAccountComponent } from './components/close-account/close-account.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { ProfileDetailCompanyComponent } from './components/profile-detail-company/profile-detail-company.component';
import { EconomicInfoComponent } from './components/file-economic-info/economic-info.component';
import { FinancialDocumentsComponent } from './components/file-financial-documents/financial-documents.component';
import { LaborContractComponent } from './components/file-labor-contract/labor-contract.component';
import { LegalDocumentsComponent } from './components/file-legal-documents/legal-documents.component';
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component';
import { OtherIncomeComponent } from './components/file-other-income/other-income.component';
import { OtherValuablePapersComponent } from './components/file-other-valuable-papers/other-valuable-papers.component';
import { RentalContractComponent } from './components/file-rental-contract/rental-contract.component';
import { RepresentativeComponent } from './components/representative/representative.component';
import { EnterpriseComponent } from './profile.component';
import { enterpriseRoutes } from './profile.routing';
import {TranslocoModule} from "@ngneat/transloco";
import {ChangeMobileDialogComponent} from "./components/change-mobile-dialog/change-mobile-dialog.component";
import {ChangeEmailDialogComponent} from "./components/change-email-dialog/change-email-dialog.component";
import {MainScreenComponent} from "./components/main-screen/main-screen.component";
import {ChangeIdGpkdComponent} from "./components/main-screen/change-id-gpkd.component";
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
    declarations: [
        EnterpriseComponent,
        AccountManagerComponent,
        ChangePasswordDialogComponent,
        ChangeMobileDialogComponent,
        ChangeEmailDialogComponent,
        ProfileDetailComponent,
        ChangeIdentificationComponent,
        CloseAccountComponent,
        ContactInfoComponent,
        LaborContractComponent,
        RentalContractComponent,
        OtherIncomeComponent,
        OtherValuablePapersComponent,
        ChangeGpkdDialogComponent,
        BiggestCapitalContributorComponent,
        EconomicInfoComponent,
        FinancialDocumentsComponent,
        LegalDocumentsComponent,
        ProfileDetailCompanyComponent,
        BusinessActivityComponent,
        RepresentativeComponent,
        MainScreenComponent,
        ChangeIdGpkdComponent
    ],
    imports: [
        RouterModule.forChild(enterpriseRoutes),
        SharedModule,
        TranslocoCoreModule,
        FuseCardModule,
        UserModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FuseAlertModule,
        MatIconModule,
        MatDialogModule,
        MatSelectModule,
        FuseNavigationModule,
        MatDatepickerModule,
        MatChipsModule,
        TranslocoModule,
        MatTabsModule,
    ]
})
export class ProfileModule { }
