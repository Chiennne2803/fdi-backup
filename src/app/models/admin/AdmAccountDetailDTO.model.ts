import {AuditModel} from '../base';
import {AdmDeputyContactDTO} from './AdmDeputyContactDTO.model';
import {FsLoanProfilesDTO, FsTransactionHistoryDTO, FsTransInvestorDTO} from '../service';
import {AdmCollateralDTO} from './AdmCollateralDTO.model';
import {AdmCreditLimitDTO} from './AdmCreditLimitDTO.model';
import {AdmCustomerRankDTO} from "./AdmCustomerRankDTO.model";

export class AdmAccountDetailDTO extends AuditModel {
    admAccountDetailId?: number;
    accountType?: number;
    accountName?: string;
    manageStaff?: number;
    manageStaffName?: string;
    fullName?: string;
    mobile?: string;
    dateOfBirth?: number;
    gender?: string;
    type?: number;
    channel?: number;
    idType?: number;
    email?: string;
    address1?: string;
    address2?: string;
    avatar?: string;
    startDate?: Date;
    endDate?: Date;
    admAccountId?: number;
    admDepartmentsId?: number;
    admCategoriesId?: number;
    admGroupRoleId?: number;
    role?: number;
    roleName?: string;
    frontPhotoIdentication?: string;
    backsitePhotoIdentication?: string;
    businessCode?: string;
    address3?: string;
    website?: string;
    facebook?: string;
    job?: number;
    jobName?: string;
    jobAddress?: string;
    marital?: number;
    maritalName?: string;
    rentalContract?: string;
    laborContract?: string;
    fileValues1?: string;
    fileValues2?: string;
    businessLicense?: string;
    collateral?: string;
    dateOfIdnumber?: number;
    placeOfIdnumber?: string;
    businessLicenseDate?: Date;
    placeOfBusinessLicense?: string;
    landline?: string;
    photoOfBusiness?: string;
    companyName?: string;
    reasonContent?: string;
    note?: string;
    accountStatus?: number;
    accountStatusName?: string;
    expirationDate?: number;
    efectiveDate?: number;
    identification?: string;
    taxCode?: string;
    denyIps?: string;
    allowIps?: string;
    deputyContact?: AdmDeputyContactDTO;
    presenter?: string;
    guide?: string;
    reviewer?: string;

    fsLoanProfilesDTOS?: FsLoanProfilesDTO[];//danh sach ho so huy dong von
    fsTransInvestorDTOS?: FsTransInvestorDTO[];//danh sach ho so dau tu
    admCollateralDTOS?: AdmCollateralDTO[];//Danh sach tai san dam bao
    admCreditLimitDTOS?: AdmCreditLimitDTO[];//danh sach tin dung
    fsTransactionHistoryDTOS?: FsTransactionHistoryDTO[];//sao ke
    fsTransactionHistoryAutoDTOS?: FsTransactionHistoryDTO[];//sao ke tk dau tu tu dong

    representative?: AdmDeputyContactDTO;//nguoi dai dien
    contact?: AdmDeputyContactDTO[];//danh sach nguoi lien he
    capitalContributors?: AdmDeputyContactDTO[];//danh sach nguoi gop von
    admCustomerRankDTOS?: AdmCustomerRankDTO[];//danh sach nguoi gop von

    creditCode?: number;

    financeCheck?: number;
    financeCheckName?: string;
    moneyTranferReportCheck?: number;
    moneyTranferReportCheckName?: string;
    financeTime?: string;
    financeLastTime?: string;
    fsConfCreditId?: number;
    economicInfoDocuments?: string;
    legalDocuments?: string;
    legalDocuments1?: string;
    legalDocuments2?: string;
    legalDocuments3?: string;
    legalDocuments4?: string;
    legalDocuments5?: string;
    legalDocuments6?: string;
    legalDocuments7?: string;
    legalDocuments8?: string;
    legalDocuments9?: string;
    financialDocuments?: string;
    financialDocuments1?: string;
    financialDocuments2?: string;
    financialDocuments3?: string;
    businessDocumentation?: string;
    businessDocumentation1?: string;
    businessDocumentation2?: string;

    admGroupRoleName?: string;
    admCategoriesName?: string;
    admDepartmentsName?: string;
    genderName?: string;
    changeInfoType?: string;//MOBILE/EMAIL

    passwd?: string;
    newPasswd?: string;
    tabIndex?: string;

    amount?: number;
    amountFrom?: number;
    amountTo?: number;

    maxLoan?: number;//tong han muc

    pnTopup?: number;
    pnWithdraw?: number;
    pnWeu?: number;
    pnAmount?: number;
}
