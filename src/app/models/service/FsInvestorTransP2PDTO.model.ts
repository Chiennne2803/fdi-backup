import { AuditModel } from '../base';
import {FsReqTransP2PDTO} from "./FsReqTransP2PDTO.model";

/**
 * lich su chuyen nhuong
 */
export class FsInvestorTransP2PDTO extends AuditModel {
    fsInvestorTransP2PId?: number;              //Bảng về giao diịch đầu tư-cho bên huy động vốn nào
    fsReqTransP2PId?: number;                   //ID yêu cầu chuyển nhượng
    fsTransInvestorId?: number;                 //mã hồ sơ đầu tư
    fsLoanProfilesId?: number;                  //ID hồ sơ chuyển nhượng
    receiveAdmAccountId?: number;               //ID nhà đầu tư nhận chuyển nhượng
    transferorAdmAccountId?: number;            //ID nhà đầu tư chuyển nhượng
    transCode?: string;                         //"mã giao dịch (P2P+Unixtime)"
    transferAmount?: number;                    //Số tiền đầu tư nhận chuyển nhượng
    payAmount?: number;                         //Số tiền phải trả
    interestEstimate?: number;                  //Lãi dự kiến
    totalAmountEstimate?: number;               //Tổng doanh thu dự kiến
    transDate?: Date;                           //ngày chuyển nhượng

    fsReqTransP2PDTO?: FsReqTransP2PDTO;
}
