import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base-service';
import { FuseAlertService } from '@fuse/components/alert';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateConfigService extends BaseService {

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'vsa/service', true);
    }

    getTemplateConfig(): Observable<any> {
        return this.doGet('staff/emailTemplate');
    }


}


