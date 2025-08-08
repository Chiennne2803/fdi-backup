import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})

export class OtpService extends BaseService {

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService,
                private _snackbar: MatSnackBar,
    ) {
        super(httpClient, _fuseAlertService, '', 'otp');
    }

    public verifyOtp(payload: any): Observable<BaseResponse> {
        return this.doPost('verify', payload);
    }

    public resendOtp(payload: any): Observable<BaseResponse> {
        return this.doPost('resend', {...payload, smsOtp: "resend"});
    }
}
