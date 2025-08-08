import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AdmAccountDetailDTO, AdmCategoriesDTO} from '../../models/admin';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTransInvestorDTO, FsTranspayReqDTO} from '../../models/service';
import {BaseService} from '../base-service';
import {FileService} from '../common-service';
import FileSaver from 'file-saver';
import {FuseAlertService} from "../../../@fuse/components/alert";

/**
 * ho so vay
 */
@Injectable({
    providedIn: 'root'
})
export class LoanProfilesService extends BaseService {
    private drawer: MatDrawer;
    private _lstCollateralType: BehaviorSubject<AdmCategoriesDTO[] | null> = new BehaviorSubject(null);
    private _profileDetails: BehaviorSubject<{
        fsLoanProfiles: FsLoanProfilesDTO,
        fsCardDown: FsCardDownDTO[],
        investors: FsTransInvestorDTO[],
        admAccountDetail: AdmAccountDetailDTO,
        transpayReq: FsTranspayReqDTO[],
        stopCapital: number,
    }> = new BehaviorSubject(null);
    private _confRates: BehaviorSubject<AdmCategoriesDTO[] | null> = new BehaviorSubject(null);
    private _lstReasons: BehaviorSubject<AdmCategoriesDTO[] | null> = new BehaviorSubject(null);
    private _lstRates: BehaviorSubject<AdmCategoriesDTO[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, private _fileService: FileService, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'lender', 'fsLoanProfiles');
    }

    /**
     * Getter for lstCollateralType
     */
    get lstCollateralType(): Observable<AdmCategoriesDTO[]> {
        return this._lstCollateralType.asObservable();
    }

    /**
     * Getter for confRates
     */
    get confRates(): Observable<AdmCategoriesDTO[]> {
        return this._confRates.asObservable();
    }

    /**
     * Getter for lstReasons
     */
    get lstReasons(): Observable<AdmCategoriesDTO[]> {
        return this._lstReasons.asObservable();
    }

    /**
     * Getter for lstReasons
     */
    get lstRates(): Observable<AdmCategoriesDTO[]> {
        return this._lstRates.asObservable();
    }

    get profileDetail$(): Observable<{
        fsLoanProfiles: FsLoanProfilesDTO,
        fsCardDown: FsCardDownDTO[],
        investors: FsTransInvestorDTO[],
        admAccountDetail: AdmAccountDetailDTO,
        transpayReq: FsTranspayReqDTO[],
        stopCapital: number,
    }> {
        return this._profileDetails.asObservable();
    }

    setDrawer(drawer: MatDrawer): void {
        this.drawer = drawer;
    }

    toggle(): void {
        this.drawer.toggle();
    }

    /**
     * Get products
     */
    getPrepareLoadingPage():
        Observable<BaseResponse> {
        return this.prepareLoadingPage().pipe(
            tap((response) => {
                this._lstCollateralType.next(response.payload.lstCollateralType);
                this._confRates.next(response.payload.confRates);
                this._lstReasons.next(response.payload.lstReasons);
            })
        );
    }

    /**
     * doSearchWaitProcessTransaction
     *
     * @param payload
     */
    doSearch(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(id: string): Observable<BaseResponse> {
        return super.doGetDetail({fsLoanProfilesId: +id}).pipe(
            tap((res) => {
                this._profileDetails.next(res.payload);
            })
        ) as Observable<BaseResponse>;
    }

    /**
     * prepareCreateLoan
     *
     * @param payload
     */
    prepareCreateLoan(payload: any):
        Observable<BaseResponse> {
        return this.doPost('prepareCreateLoan', payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doCreate(payload);
    }

    /**
     * create
     *
     * @param payload
     */
    createTranspayReq(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('createTranspayReq', payload);
    }

    /**
     * updateIsAuto
     *
     * @param payload
     */
    updateIsAuto(payload: FsLoanProfilesDTO): Observable<BaseResponse> {
        return this.doPost('updateIsAuto', payload);
    }

    /**
     * getLstRank
     *
     * @param payload
     */
    getLstRank(payload: any):
        Observable<AdmCategoriesDTO> {
        return this.doPost('getLstRank', payload).pipe(
            tap((response: any) => {
                this._lstRates.next(response.payload as AdmCategoriesDTO[]);
            })
        );
    }

    /**
     * approvalInvestor
     *
     * @param payload
     */
    approvalInvestor(payload: any):
        Observable<BaseResponse> {
        return this.doPost('approvalInvestor', payload);
    }

    /**
     * stopFunding
     *
     * @param payload
     */
    stopFunding(id: number): Observable<BaseResponse> {
        return this.doPost('stopFunding', {fsLoanProfilesId: +id});
    }

    /**
     * prepareDisbursementRequest
     *
     * @param payload
     */
    prepareDisbursementRequest(id: number): Observable<BaseResponse> {
        return this.doPost('prepareDisbursementRequest', {fsLoanProfilesId: +id});
    }

    /**
     * createDisbursementRequest
     *
     * @param payload
     */
    createDisbursementRequest(payload: any): Observable<BaseResponse> {
        return this.doPost('createDisbursementRequest', payload);
    }

    /**
     * createTranspayRequest
     *
     * @param payload
     */
    createTranspayRequest(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('createTranspayRequest', payload);
    }

    /**
     * getCardDownByLoanProfile
     *
     * @param payload
     */
    getCardDownByLoanProfile(id: number): Observable<BaseResponse> {
        return this.doPost('getCardDownByLoanProfile', {fsLoanProfilesId: +id});
    }

    /**
     * getTranspayPeriodByCardDown
     *
     * @param payload
     */
    getTranspayPeriodByCardDown(payload):
        Observable<BaseResponse> {
        return this.doPost('getTranspayPeriodByCardDown', payload);
    }

    /**
     * initTranspayReqByTranspayPeriod
     *
     * @param payload
     */
    initTranspayReqByTranspayPeriod(payload):
        Observable<BaseResponse> {
        return this.doPost('initTranspayReqByTranspayPeriod', payload);
    }

    /**
     * getDetailTranspayPeriod
     *
     * @param payload
     */
    getDetailTranspayPeriod(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doPost('getDetailTranspayPeriod', payload);
    }

    /**
     * downloadContract
     *
     * @param type
     */
    downloadContract(type: string): void {
        this.doPost(type, null).subscribe((res) => {
            FileSaver.saveAs(this._fileService.dataURItoBlob(res.payload.fileType + res.payload.contentBase64), res.payload.docName);
        });
    }


    getTransPayDetail(id: number): Observable<BaseResponse> {
        return this.doPost('getDetailTranspayPeriod', {fsTranspayPeriodId: +id}) as Observable<BaseResponse>;
    }

    /**
     * initTranspayReq
     *
     * @param payload
     */
    initTranspayReq(fsTranspayReqDTO: FsTranspayReqDTO): Observable<BaseResponse> {
        return this.doPost('initTranspayReq', fsTranspayReqDTO);
    }
}
