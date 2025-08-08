import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {environment} from "../../../environments/environment";

/**
 * quan ly danh muc
 */
@Injectable({
    providedIn: 'root'
})
export class ForgetPasswordService extends BaseService {

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'forgetPassword', true);
    }


    /**
     * update
     *
     * @param payload
     */
    sendOtpRecoverPassword(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.doPost("sendOtpRecoverPassword", payload);
    }

    verifyOtp(user: { payload: { userName: string; smsOtp?: string; mailOtp?: string } }): Observable<any> {
        return this.doPost( 'verify', user);
    }


    resendOtp(user: { payload: { userName: string; smsOtp?: 'resend'; mailOtp?: 'resend' } }): Observable<any> {
        return this.doPost( 'verify/resend', user);
    }

}
