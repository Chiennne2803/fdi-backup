import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseResponse} from 'app/models/base';
import {FsLoanProfilesDTO, FsTransInvestorDTO} from 'app/models/service';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BaseService} from '../base-service';
import {FsDocuments} from '../../models/admin';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsConfCreditDTO} from "../../models/service/FsConfCreditDTO.model";

@Injectable({
    providedIn: 'root'
})
export class InvestorService extends BaseService {
    public _prepare: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private _profileDetails: BehaviorSubject<FsLoanProfilesDTO> = new BehaviorSubject(null);
    private _investor: BehaviorSubject<BaseResponse> = new BehaviorSubject(null);
    private drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'investorProfiles');
    }

    get prepare$(): Observable<BaseResponse> {
        return this._prepare.asObservable();
    }

    get profileDetail$(): Observable<FsLoanProfilesDTO> {
        return this._profileDetails.asObservable();
    }

    get allLoanActiveProfile$(): Observable<BaseResponse> {
        return this._investor.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    openDetailDrawer(): void {
        this.drawer.open();
    }

    toggleDetail(): void {
        this.drawer.toggle();
    }

    /**
     * getDetailLoanProfile
     *
     * @param payload
     */
    getDetailLoanProfile(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return super.doPost('getDetailLoanProfile', payload).pipe(
            tap((res) => {
                this._profileDetails.next(res.payload);
            })
        );
    }

    resetDetailLoanProfile(): void {
        this._profileDetails.next(null);
    }

    /**
     * getAllLoanActiveProfile
     *
     * @param payload
     */
    getAllLoanActiveProfile(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('getAllLoanActiveProfile', payload).pipe(tap((res) => {
            this._investor.next(res);
        }));
    }

    /**
     * getDetailLender
     *
     * @param payload
     */
    getDetailLender(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.doPost('getDetailLender', payload);
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((res: BaseResponse) => {
                this._prepare.next(res);
            })
        );
    }


    /**
     * create
     *
     * @param payload
     */
    create(payload: FsTransInvestorDTO = new FsTransInvestorDTO()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * downloadContract
     *
     */
    downloadContract(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<{ payload: FsDocuments }> {
        return this.doPost('downloadContract', payload) as Observable<{ payload: FsDocuments }>;
    }

    /**
     * getInvestInfo
     *
     * @param payload
     */
    getInvestInfo(payload: FsTransInvestorDTO = new FsTransInvestorDTO()):
        Observable<BaseResponse> {
        return this.doPost('getInvestInfo', payload);
    }

    closeDetailDrawer(): void {
        this.drawer.close();
    }
}
