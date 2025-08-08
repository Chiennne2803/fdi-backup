import {AuditModel} from '../base';

export class SpNotificationConfigDTO extends AuditModel {
    spNotificationConfigId?: number;
    configName?: string;               //
    module?: number;                   //chức năng
    action?: number;                   //sự kiện
    condition?: number;                //điều kiện
    conditionValue?: number;           //giá trị
    title?: string;                    //tiêu đè
    body?: string;                     //nội dung
    sendEmail?: number;                //check box email
    sendNotify?: number;               //check box hệ thống
    sendTo?: string;                   //thông báo cho
    sendToExt?: string;                //thông báo người dùng
    //kich hoat : status =1
}
