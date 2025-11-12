import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseResponse } from 'app/models/base';
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpService } from '../shared/services/common/http.service';
import { FuseAlertService } from "../../@fuse/components/alert";
import moment from 'moment';

export class BaseService extends HttpService {
    protected key;
    private _lazyLoad: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private serviceName: string;
    private path: string;
    private _fuseAlertService: FuseAlertService;
    private _notAuthen: boolean;

    constructor(
        private httpClient: HttpClient, _fuseAlertService: FuseAlertService, serviceName: string,
        path: string, notAuthen?: boolean) {
        super(httpClient);
        this.serviceName = serviceName;
        this.path = path;
        this.key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
        this._fuseAlertService = _fuseAlertService;
        this._notAuthen = notAuthen;
    }

    get lazyLoad(): Observable<BaseResponse> {
        return this._lazyLoad.asObservable();
    }

    setLazyLoad(data: BaseResponse): void {
        this._lazyLoad.next(data);
    }

    protected get url(): string {
        let url = environment.serverUrl;
        if (this._notAuthen) {
            url = environment.serverUrlnotVsa;
        }
        if (this.serviceName != null && this.serviceName !== '') {
            return url + '/' + this.serviceName + '/' + this.path;
        } else {
            return url + '/' + this.path;
        }
    }

    public lockAll(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/lockAll', payload);
    }

    public unlockAll(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/unlockAll', payload);
    }

    protected searchDataLazyLoad(path: string, condition: any, notShowMsg?: boolean): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        // console.log(payload)
        return this.post(this.url + '/' + path, payload).pipe(
            tap((res) => {
                if (res == undefined || res.content == undefined || res.content.length <= 0) {
                    if (!notShowMsg) {
                        this._fuseAlertService.showMessageWarning("Không có dữ liệu");
                    }
                }
                this._lazyLoad.next(res);
            })
        );
    }

    protected searchNotLazy(path: string, condition: any, notShowMsg?: boolean): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/' + path, payload);
    }

    protected doGet(path: string): Observable<BaseResponse> {
        return this.get(this.url + '/' + path);
    }

    protected doPost(path: string, condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/' + path, payload);
    }

    protected doPostOverlay(path: string, condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/' + path, payload, { params: { overlay: 'load' } });
    }

    protected doCreate(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url, payload);
    }

    protected doUpdate(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.put(this.url, payload);
    }

    protected doDelete(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + '/delete', payload);
    }

    protected resendOtp(payload: any): Observable<BaseResponse> {
        return this.post(environment.serverUrl + '/otp/resend', payload);
    }

    protected doGetDetail(condition: any, path?: string): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.post(this.url + `/${path || 'getDetail'}`, payload);
    }

    protected prepareLoadingPage(): Observable<any> {
        return this.get(this.url + '/prepareLoadingPage',);
    }

    protected buildBodyParams(input: any): any {

        const condition = { payload: {}, signature: 'usb_key' };
        if (input) {
            if (input.payload !== undefined) {
                condition.payload = input.payload;
            } else {
                Object.keys(input).forEach((k) => {
                    if (input[k] || typeof input[k] === 'number') {
                        condition.payload[k] = input[k];
                    }

                    if ((k === 'createdDate' || k === 'lastUpdatedDate') && input[k]) {
                        const dateValue = input[k];

                        // Nếu là moment object
                        if (moment.isMoment(dateValue)) {
                            const year = dateValue.year();
                            const month = String(dateValue.month() + 1).padStart(2, '0');
                            const day = String(dateValue.date()).padStart(2, '0');

                            condition.payload[k] = `${year}-${month}-${day}T00:00:00+07:00`;
                            // console.log('Moment parsed:', condition.payload[k]);
                        }
                        // Nếu là Date object
                        else if (dateValue instanceof Date) {
                            const year = dateValue.getFullYear();
                            const month = String(dateValue.getMonth() + 1).padStart(2, '0');
                            const day = String(dateValue.getDate()).padStart(2, '0');

                            condition.payload[k] = `${year}-${month}-${day}T00:00:00+07:00`;
                            // console.log('Date parsed:', condition.payload[k]);
                        }
                        // Nếu là string
                        else if (typeof dateValue === 'string') {
                            condition.payload[k] = undefined;
                        }
                    }

                });

            }
        }
        //todo luongnk: change to rsa when deploy production
        const enc = CryptoJS.AES.encrypt(JSON.stringify(condition.payload), this.key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        condition.signature = enc;
        return condition;
    }

    protected buildParams(
        condition: any,
        pageable?: {
            sorts: string[];
            page: number;
            size: number;
        }
    ): HttpParams {
        let params = new HttpParams();
        Object.keys(condition).forEach((k) => {
            if (condition[k] || condition[k] === 0) {
                if ('lastUpdatedDateFrom' === k
                    || 'lastUpdatedDateTo' === k
                    || 'createDatetimeFrom' === k
                    || 'createDatetimeTo' === k
                    || 'updateDatetimeFrom' === k
                    || 'updateDatetimeTo' === k
                ) {
                    params = params.set(k, (condition[k].getTime() + '').trim());
                } else {
                    params = params.set(k, (condition[k] + '').trim());
                }
            } else {
                delete condition[k];
            }
        });

        if (!pageable) {
            return params;
        }

        // page
        params = params.set('page', pageable.page + '');

        // size
        params = params.set('size', pageable.size + '');

        // sort
        if (!pageable.sorts || pageable.sorts.length === 0) {
            pageable.sorts = [];
            pageable.sorts.push('lastUpdatedDate,desc');
        }
        pageable.sorts.map((val) => {
            params = params.append('sort', val);
        });

        return params;
    }
}
