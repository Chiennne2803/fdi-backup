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
export class ProfileService extends BaseService {
    public _accountDetail: BehaviorSubject<AdmAccountDetailDTO> = new BehaviorSubject(null);
    public titlePage: Subject<string> = new Subject<string>();
    private _profilePrepare: BehaviorSubject<AccountModel> = new BehaviorSubject<AccountModel>(null);

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'accountDetail');
    }

    /**
     * Getter for title page
     */
    get titlePage$(): Observable<string> {
        return this.titlePage.asObservable();
    }

    /**
     * Getter for profile prepare
     */
    get profilePrepare$(): Observable<AccountModel> {
        return this._profilePrepare.asObservable();
    }
    /**
     * Getter for account detail
     */
    get accountDetail$(): Observable<AdmAccountDetailDTO> {
        return this._accountDetail.asObservable();
    }

    set accountDetail(account: AdmAccountDetailDTO) {
        this._accountDetail.next(account);
    }

    changeTitlePage(title: string): void {
        this.titlePage.next(title);
    }

    public getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap(res => this._profilePrepare.next(res.payload))
        );
    }

    doCreateRequestChangeId(payload: any): Observable<BaseResponse> {
        return this.doPost('createRequestChangeId', payload);
    }

    /**
     * update account bank
     *
     * @param payload
     */
    updateAccountBank(payload: AdmAccountDetailDTO):
        Observable<BaseResponse> {
        return this.put(this.url + '/updateAccountBank', payload);
    }

    /**
     * update deputy contact
     *
     * @param condition
     */
    updateDeputyContact(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.put(this.url + '/updateDeputyContact', payload);
    }
    /**
     * updateEconomicInfo
     *
     * @param condition
     */
    updateEconomicInfo(payload: any): Observable<BaseResponse> {
        return this.doPost('updateEconomicInfo', payload);
    }

    /**
     * updateDocument
     *
     * @param condition
     */
    updateDocument(payload: any): Observable<BaseResponse> {
        return this.doPost('updateDocument', payload);
    }

    changePassword(payload: AdmAccountDTO): Observable<BaseResponse> {
        return this.doPost('changePassword', payload);
    }

    verifyContactInfo(payload: AdmAccountDetailDTO): Observable<BaseResponse> {
        return this.doPost('verifyContactInfo', payload);
    }
    changeContactInfo(payload: AdmAccountDetailDTO): Observable<BaseResponse> {
        return this.doPost('changeContactInfo', payload);
    }

    /**
     * update account detail
     *
     * @param payload
     */
    updateAccountDetail(condition: any): Observable<BaseResponse> {
        const payload = this.buildBodyParams(condition);
        return this.put(this.url, payload);
    }

    chainFileCode(value: string, formGroup: FormGroup): string {
        if ( value === undefined ) {
            value = '';
        }

        Object.keys(formGroup.controls).forEach((control) => {
            if ( formGroup.get(control).value ) {
                value += `;${formGroup.get(control).value}`;
            }
        });
        return value;
    }

    replaceFile(oldFile: string, fileSelected: FsDocuments, fileToReplace: FsDocuments): string {
        const oldFileID = oldFile.split(';');
        oldFileID[oldFileID.indexOf(fileSelected.finDocumentsId.toString())] = fileToReplace.finDocumentsId.toString();
        return oldFileID.join(';');
    }
}
