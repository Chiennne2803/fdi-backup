import {AuditModel} from '../base';
import {FsTransInvestorDTO} from './FsTransInvestorDTO.model';
import {FsLoanProfilesDTO} from './FsLoanProfilesDTO.model';
import {FsInvestorTransP2PDTO} from './FsInvestorTransP2PDTO.model';
import {AdmAccountDetailDTO, AdmDeputyContactDTO} from "../admin";

export class FsReqTransP2PDTO extends AuditModel {
    fsReqTransP2PId?: number;
    fsLoanProfilesId?: number;      //Hố sơ chuyển nhượng
    companyName?: string;
    tranferAmount?: number;             //Số tiền đầu tư muốn chuyển nhượng
    saleAmount?: number;            //Số tiền chào bán
    loanTimeCycle?: number;                    //Kỳ hạn(ngày)
    investorTimeExpried?: Date;               //Ngày đáo hạn
    status?: number;                //"1 	Đang chào bán:2 	Hoàn thành,    3 	Huỷ chủ động,    4	 Giao dịch chuyển nhượng P2P quá hạn niêm yết"
    processResult?: number;         //kết quả p2p
    remainTranferAmount?: number;   //Số tiền đầu tư muốn chuyển nhượng còn lại
    remainSalAmount?: number;       //gía niêm yết còn lại
    tranferedAmount?: number;       //Số tiền đầu tư chuyển nhượng thành công
    type?: number;                  //Kết quả chuyển nhượng 1: chuyển nhượng 1 phần, 2 chuyển nhượng toàn phần
    turnoverAmount?: number;        //Tổng doanh thu p2p
    fsTransInvestorId?: number;      //mã đầu tư gốc
    transCode?: string;
    feeP2P?: number; // phi chuyen nhuong
    rate?: number; //rate
    admAccountId?: number; //admAccountId
    isChargedP2P?: number; //isChargedP2P

    //detail
    fsInvestorTransP2PDTOS?: FsInvestorTransP2PDTO[];//lich su chuyen nhuong
    fsTransInvestorDTO?: FsTransInvestorDTO;//chi tiet dau tu goc
    fsLoanProfilesDTO?: FsLoanProfilesDTO;//chi tiet ho so
    creditHistory?: FsLoanProfilesDTO[];//lich su tin dung
    admAccountDetailDTO?: AdmAccountDetailDTO;
    admDeputyContactDTO?: AdmDeputyContactDTO;
}
