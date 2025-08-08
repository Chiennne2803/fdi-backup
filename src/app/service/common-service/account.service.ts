import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO, AdmAccountDTO, FsDocuments} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, Subject, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {AccountModel} from '../../models/service/FsAccountBankDTO.model';
import {FormGroup} from '@angular/forms';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class AccountService extends BaseService {

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'account');
    }

    updateDeviceId(payload): Observable<BaseResponse> {
        return this.doPost('updateDeviceId', payload);
    }

}
