import {AuditModel} from '../base';

export class FsConfigLoanOfdDTO extends AuditModel {
    fsConfigLoanOfdId?: number;
    fsLoanProfilesId?: number;
    admAccountId?: number;
    payType?: number;
    outstandInterestOfOrigin?: number;
    outstandInterestOfInterest?: number;
    taxDeclarationType?: number;
    fee?: number;
}
