import { AuditModel } from '../base';

export class FsDocuments extends AuditModel {
    contentBase64: string;
    docName: string;
    fileSize: string;
    fileType: string;
    finDocumentsId: number;
    info: string;
    path: string;
    status: number;
    type: string;
    colume?: string;
}
