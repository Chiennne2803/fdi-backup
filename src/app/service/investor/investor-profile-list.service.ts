import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {FsLoanProfilesDTO, FsTransInvestorDTO} from 'app/models/service';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class InvestorListService extends BaseService {
    private _dataDetail: BehaviorSubject<{
        fsLoanProfiles: FsLoanProfilesDTO;
        investors: FsTransInvestorDTO;
    }> = new BehaviorSubject(null);
    private _profileDetails: BehaviorSubject<FsLoanProfilesDTO> = new BehaviorSubject(null);
    private _investors: BehaviorSubject<FsTransInvestorDTO> = new BehaviorSubject(null);
    private drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'investorProfileList');
    }

    get profileDetail$(): Observable<FsLoanProfilesDTO> {
        return this._profileDetails.asObservable();
    }

    get investors$(): Observable<FsTransInvestorDTO> {
        return this._investors.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggleDetailDrawer(): void {
        this.drawer.toggle();
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }


    /**
     * waitingApproval
     *
     * @param payload
     */
    waitingApproval(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('waitingApproval', payload);
    }

    /**
     * investing
     *
     * @param payload
     */
    investing(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('investing', payload);
    }

    /**
     * invested
     *
     * @param payload
     */
    invested(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('invested', payload);
    }

    /**
     * reject
     *
     * @param payload
     */
    reject(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('reject', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsTransInvestorDTO = new FsTransInvestorDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._profileDetails.next(res.payload.fsLoanProfiles);
                this._investors.next(res.payload.investors);
            })
        );
    }
}
