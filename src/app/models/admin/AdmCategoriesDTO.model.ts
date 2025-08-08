import { AuditModel } from '../base';

export class AdmCategoriesDTO extends AuditModel {
    admCategoriesId?: number;
    categoriesName?: string;
    categoriesCode?: string;
    info?: string;
    parentId?: number;
    parentCategoriesCode?: string;
    parentCategoriesName?: string;
    value?: string;
    businessType?: number;

    nameParent?: string;

    parentItem?: AdmCategoriesDTO;
    category?: AdmCategoriesDTO;
}
