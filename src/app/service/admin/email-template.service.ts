import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base-service';
import { BaseRequest, BaseResponse } from '../../models/base';
import { EmailTemplateDTO } from '../../models/admin/EmailTemplateDTO.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FuseAlertService } from '../../../@fuse/components/alert';

@Injectable({
    providedIn: 'root'
})
export class EmailTemplateService extends BaseService {
    private _drawer: any;
    private _currentTemplateId: number;

    constructor(
        private _httpClient: HttpClient,
        _fuseAlertService: FuseAlertService
    ) {
        super(_httpClient, _fuseAlertService, 'staff', 'emailTemplate');
    }

    setDrawer(drawer: any): void {
        this._drawer = drawer;
    }

    openDetailDrawer(): void {
        this._drawer.open();
    }

    closeDetailDrawer(): void {
        this._drawer.close();
    }

    // Get danh sách email templates
    doSearch(request: BaseRequest = new BaseRequest()): Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', request);
    }

    // Get detail email template
    getDetail(request: { admEmailTemplateId: number }): Observable<BaseResponse> {
        this._currentTemplateId = request.admEmailTemplateId;
        return this.doGetDetail({admEmailTemplateId: request.admEmailTemplateId}, 'getDetail');
    }

    // Get current template ID
    getCurrentTemplateId(): number {
        return this._currentTemplateId;
    }

    // Update email template (fake API)
    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate(payload);
    }
}
