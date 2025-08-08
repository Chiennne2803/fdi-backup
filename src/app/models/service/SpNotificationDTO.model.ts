import {AuditModel} from '../base';

export class SpNotificationDTO extends AuditModel {
    spNotificationId?: number;
    body?: string;
    title?: string;
    admAccountId?: number;
    isRead?: boolean;

    //add
    link?: string;
    image?: string;
    icon?: string;
    useRouter?: string;
    hide?: boolean;
}
