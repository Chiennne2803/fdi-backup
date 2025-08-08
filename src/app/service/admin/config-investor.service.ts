import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';

import {BaseService} from '../base-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FsConfigInvestorDTO} from "../../models/service/FsConfigInvestorDTO.model";
import {WControlEuDTO} from "../../models/wallet/WControlEuDTO.model";
import {FuseAlertService} from "../../../@fuse/components/alert";


/**
 * cau hinh dau tu tu dong
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigInvestorService extends BaseService {
    private drawer: MatDrawer;
    public _dataPrepare: BehaviorSubject<{wControlEuDTO: WControlEuDTO; listInvestmentTime: number[]}> = new BehaviorSubject(null);
    // public _lenders: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _detail: BehaviorSubject<FsConfigInvestorDTO> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'investorAuto');
    }

    public prepare(request?: any): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res) => {
                this._dataPrepare.next(res.payload);
            })
        );
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }

    get detail$(): Observable<AdmAccountDetailDTO> {
        return this._detail.asObservable();
    }

    /**
     * doSeach
     *
     * @param payload
     */
    doSearch(payload: AdmAccountDetailDTO = new AdmAccountDetailDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: any):
        Observable<BaseResponse> {
        return super.doGetDetail(payload).pipe(
            tap((res) => {
                this._detail.next(res.payload as FsConfigInvestorDTO);
            })
        );
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: any):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * topupAutoInvest
     *
     * @param payload
     */
    topupAutoInvest(payload: any):
        Observable<BaseResponse> {
        return this.doPost('topupAutoInvest', payload);
    }
}
