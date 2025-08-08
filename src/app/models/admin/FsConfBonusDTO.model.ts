import {AuditModel} from './../base/audit.model';

export class FsConfBonusDTO extends AuditModel {
    fsConfBonusId?: number;
    calcMethod?: number;        //hinh thuc tinh hoa hong: 1 gia tri co ding; 2: theo ti le
    amount?: number;            //so tien
    transType?: number;     //giao dich huong hoa hong: 1 giao dich dau tu; 2: giao dich hoa hong
    bonusRate?: number;     //ti le hoa hong
    conditionsBy?: number;      //dieu kien ap dung: 1: giao dich dau tien; 2: khoang thoi gian
    startDateBonus?: Date;
    endDateBonus?: Date;
    startDateActive?: Date;    //ngay hieu luc
    endDateActive?: Date;     //ngay hieu luc
    dateBonusRange?: string;     //ngay hieu luc
};

