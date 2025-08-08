import {AuditModel} from '../base';
import {FormControl, FormGroup, Validators} from "@angular/forms";

export class FsTranspayInvestorDetailDTO extends AuditModel {
    fsTranspayInvestorDetailId?: number;
    fsTranspayInvestorId?: number;
    transCodeDetail?: string;
    admAccountIdLoan?: number;
    fsLoanProfilesId?: number;
    admAccountIdInvestor?: number;
    admAccountIdInvestorName?: string;
    amount?: number;
    interest?: number;
    amountCapital?: number;
    fee?: number;
    loanCycle?: number;
    exprieDate?: Date;
    approvalBy?: number;
    info?: string;
    transComment?: string;
    fsCardDownId?: number;
    fsCardDownCode?: string;
    perTax?: number;
    fsTransInvestorId?: number;

    static asFormGroup(fsTranspayInvestorDetailDTO: FsTranspayInvestorDetailDTO, payType?: number): FormGroup {
        const fg = new FormGroup({
        fsTranspayInvestorDetailId: new FormControl(fsTranspayInvestorDetailDTO.fsTranspayInvestorDetailId),
            fsTranspayInvestorId: new FormControl(fsTranspayInvestorDetailDTO.fsTranspayInvestorId),
            transCodeDetail: new FormControl(fsTranspayInvestorDetailDTO.transCodeDetail),
            admAccountIdLoan: new FormControl(fsTranspayInvestorDetailDTO.admAccountIdLoan),
            fsLoanProfilesId: new FormControl(fsTranspayInvestorDetailDTO.fsLoanProfilesId),
            admAccountIdInvestor: new FormControl(fsTranspayInvestorDetailDTO.admAccountIdInvestor),
            admAccountIdInvestorName: new FormControl(fsTranspayInvestorDetailDTO.admAccountIdInvestorName),
            amount: new FormControl( {
                value: fsTranspayInvestorDetailDTO.amount,
                disabled : payType == 1
            }),
            interest: new FormControl({
                value: fsTranspayInvestorDetailDTO.interest,
                disabled : payType == 1
            }),
            amountCapital: new FormControl(fsTranspayInvestorDetailDTO.amountCapital),
            fee: new FormControl(fsTranspayInvestorDetailDTO.fee),
            loanCycle: new FormControl(fsTranspayInvestorDetailDTO.loanCycle),
            exprieDate: new FormControl(fsTranspayInvestorDetailDTO.exprieDate),
            approvalBy: new FormControl(fsTranspayInvestorDetailDTO.approvalBy),
            info: new FormControl(fsTranspayInvestorDetailDTO.info),
            transComment: new FormControl(fsTranspayInvestorDetailDTO.transComment),
            fsCardDownId: new FormControl(fsTranspayInvestorDetailDTO.fsCardDownId),
            fsCardDownCode: new FormControl(fsTranspayInvestorDetailDTO.fsCardDownCode),
            perTax: new FormControl(fsTranspayInvestorDetailDTO.perTax),
            fsTransInvestorId: new FormControl(fsTranspayInvestorDetailDTO.fsTransInvestorId),
            createdDate: new FormControl(fsTranspayInvestorDetailDTO.createdDate),
        });
        return fg;
    }
}
