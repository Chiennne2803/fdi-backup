import {AuditModel} from '../base';
import {FsChargeCashReqDTO} from './FsChargeCashReqDTO.model';
import {FsTopupDTO} from "./FsTopupDTO.model";

export class FsTopupMailTransferDTO extends AuditModel {
    fsTopupMailTransferId?: number;
    admAccountId?: number;
    admAccountName?: string;
    transCode?: string;
    transType?: number;
    amount?: number;
    fullNameSent?: string;
    accNoSent?: string;
    bankNameSent?: string;
    branchNameSent?: string;
    currencyUnitSent?: string;
    fullNameReceiver?: string;
    accNoReceiver?: string;
    bankNameReceiver?: string;
    branchNameReceiver?: string;
    transDate?: Date;
    info?: string;
    admAccountIdManager?: number;
    admAccountIdManagerName?: string;

    lstChargeCashReq?: FsChargeCashReqDTO[];
    fsChargeCashReqId?: number;

    lstTopupWait?: FsTopupDTO[];
    fsTopupDTO?: FsTopupDTO;
}
