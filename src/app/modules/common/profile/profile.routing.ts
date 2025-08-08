import {Route} from '@angular/router';
import {AccountManagerComponent} from './components/account-manager/account-manager.component';
import {ProfileDetailComponent} from './components/profile-detail/profile-detail.component';
import {EnterpriseComponent} from './profile.component';
import {CloseAccountComponent} from './components/close-account/close-account.component';
import {ROUTER_CONST} from '../../../shared/constants';
import {ContactInfoComponent} from './components/contact-info/contact-info.component';
import {ProfileResolvers} from './profile.resolvers';
import {LaborContractComponent} from './components/file-labor-contract/labor-contract.component';
import {RentalContractComponent} from './components/file-rental-contract/rental-contract.component';
import {OtherIncomeComponent} from './components/file-other-income/other-income.component';
import {OtherValuablePapersComponent} from './components/file-other-valuable-papers/other-valuable-papers.component';
import {BiggestCapitalContributorComponent} from './components/biggest-capital-contributor/biggest-capital-contributor.component';
import {EconomicInfoComponent} from './components/file-economic-info/economic-info.component';
import {LegalDocumentsComponent} from './components/file-legal-documents/legal-documents.component';
import {FinancialDocumentsComponent} from './components/file-financial-documents/financial-documents.component';
import {BusinessActivityComponent} from './components/file-business-activity/business-activity.component';
import {ProfileDetailCompanyComponent} from './components/profile-detail-company/profile-detail-company.component';
import {RepresentativeComponent} from './components/representative/representative.component';
import {MainScreenComponent} from "./components/main-screen/main-screen.component";

export const enterpriseRoutes: Route[] = [
    {
        path: '',
        component: EnterpriseComponent,
        children: [
            {
                path: '',
                component: MainScreenComponent
            }, {
                path: ':key',
                component: MainScreenComponent
            },
            /*{
                path: '',
                component: AccountManagerComponent
            },*/
            /*{
                path: ROUTER_CONST.config.common.profile.detail.root,
                component: ProfileDetailComponent
            },
            {
                path: ROUTER_CONST.config.common.profile.closeAccount.root,
                component: CloseAccountComponent
            },
            {
                path: ROUTER_CONST.config.common.profile.contactInfo.root,
                component: ContactInfoComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.laborContract.root,
                component: LaborContractComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.rentalContract.root,
                component: RentalContractComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.otherIncome.root,
                component: OtherIncomeComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.otherValuablePaper.root,
                component: OtherValuablePapersComponent,
            },
            // Route for company
            {
                path: ROUTER_CONST.config.common.profile.detailCompany.root,
                component: ProfileDetailCompanyComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.representative.root,
                component: RepresentativeComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.economicInfo.root,
                component: EconomicInfoComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.biggestCapitalContributor.root,
                component: BiggestCapitalContributorComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.legalDocuments.root,
                component: LegalDocumentsComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.financialDocuments.root,
                component: FinancialDocumentsComponent,
            },
            {
                path: ROUTER_CONST.config.common.profile.businessActivity.root,
                component: BusinessActivityComponent,
            },*/
        ],
        resolve: { profilePrepare: ProfileResolvers }
    },
];
