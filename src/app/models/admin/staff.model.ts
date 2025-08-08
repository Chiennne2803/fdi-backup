import { GenderModel } from 'app/shared/models/common/gender.model';
import { AdmCategoriesDTO, FsDocuments } from '.';
import { BaseResponse } from '../base';

import { AdmGroupRoleDTO } from './role.model';

export interface PrepareStaffObject {
    bctcCode: object;
    departments: Array<FsDocuments>;
    groupRole: Array<AdmGroupRoleDTO>;
    jobCode: object;
    lvhdCode: object;
    marriageCode: object;
    positionCode: Array<AdmCategoriesDTO>;
    sex: Array<GenderModel>;
    sexCode: Array<GenderModel>;
}

export interface StaffPrepareResponse extends BaseResponse {
    payload: PrepareStaffObject;
}
