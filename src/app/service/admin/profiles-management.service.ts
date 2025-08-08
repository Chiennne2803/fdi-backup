import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AdmAccountDetailDTO} from '../../models/admin';
import {
    FsCardDownDTO,
    FsLoanProfilesDTO,
    FsTransInvestorDTO,
    FsTranspayInvestorDTO,
    FsTranspayReqDTO
} from '../../models/service';
import {BaseService} from '../base-service';
import {FsReviewResultsDTO} from '../../models/service/FsReviewResultsDTO.model';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsConfigLoanOfdDTO} from "../../models/service/FsConfigLoanOfdDTO.model";
import {AdmCollateralDTO} from "../../models/admin/AdmCollateralDTO.model";
import {AdmCreditLimitDTO} from "../../models/admin/AdmCreditLimitDTO.model";

/**
 * Quan ly ho so
 */
@Injectable({
    providedIn: 'root'
})
export class ProfilesManagementService extends BaseService {
    private drawer: MatDrawer;
    private _selectedProfile: BehaviorSubject<{
        fsLoanProfiles: FsLoanProfilesDTO;
        fsConfigLoanOfd: FsConfigLoanOfdDTO;
        admAccountDetail: AdmAccountDetailDTO;
        lstApprovedByProcess1: AdmAccountDetailDTO[];
        lstApprovedByProcess3: AdmAccountDetailDTO[];
        investors: FsTransInvestorDTO[];
        fsCardDowns: FsCardDownDTO[];
        transpayReqs: FsTranspayReqDTO[];
        transpayInvestors: FsTranspayInvestorDTO[];
        admCollaterals: AdmCollateralDTO[];
        creditHistories: FsLoanProfilesDTO[];
        creditLimitDTOS: AdmCreditLimitDTO[];
    }> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'staff', 'loanProfilesManagerment');
    }

    get selectedProfile$(): Observable<{
        fsLoanProfiles: FsLoanProfilesDTO;
        fsConfigLoanOfd: FsConfigLoanOfdDTO;
        admAccountDetail: AdmAccountDetailDTO;
        lstApprovedByProcess1: AdmAccountDetailDTO[];
        lstApprovedByProcess3: AdmAccountDetailDTO[];
        investors: FsTransInvestorDTO[];
        fsCardDowns: FsCardDownDTO[];
        transpayReqs: FsTranspayReqDTO[];
        transpayInvestors: FsTranspayInvestorDTO[];
        admCollaterals: AdmCollateralDTO[];
        creditHistories: FsLoanProfilesDTO[];
        creditLimitDTOS: AdmCreditLimitDTO[];

    }> {
        return this._selectedProfile.asObservable();
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

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }

    /**
     * doSearchLoanProfileReception
     *
     * @param payload
     */
    doSearchLoanProfileReception(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileReception', payload);
    }

    /**
     * doSearchLoanProfileReview
     *
     * @param payload
     */
    doSearchLoanProfileReview(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileReview', payload);
    }

    /**
     * doSearchLoanProfileReview
     *
     * @param payload
     */
    doSearchLoanProfileReReview(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileReReview', payload);
    }

    /**
     * doSearchLoanProfileApprove
     *
     * @param payload
     */
    doSearchLoanProfileApprove(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileApprove', payload);
    }

    /**
     * doSearchLoanProfileReject
     *
     * @param payload
     */
    doSearchLoanProfileReject(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileReject', payload);
    }

    /**
     * doSearchLoanProfileDisbursement
     *
     * @param payload
     */
    doSearchLoanProfileDisbursement(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileDisbursement', payload);
    }

    /**
     * doSearchLoanProfileWaitingDisbursement
     *
     * @param payload
     */
    doSearchLoanProfileWaitingDisbursement(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileWaitingDisbursement', payload);
    }

    /**
     * doSearchLoanProfileClose
     *
     * @param payload
     */
    doSearchLoanProfileClose(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('loanProfileClose', payload);
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: FsLoanProfilesDTO = new FsLoanProfilesDTO()):
        Observable<BaseResponse> {
        return super.doGetDetail(payload || {
            fsLoanProfilesId: this._selectedProfile.value.fsLoanProfiles.fsLoanProfilesId
        }).pipe(
            tap((res) => {
                this._selectedProfile.next(res.payload);
            })
        );
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
     * update
     *
     * @param payload
     */
    update(payload: BaseRequest = new BaseRequest()):
        Observable<BaseResponse> {
        return this.doUpdate({
            ...payload,
        });
    }
    /**
     * updateConfigLoanOfd
     *
     * @param payload
     */
    updateConfigLoanOfd(payload: FsConfigLoanOfdDTO): Observable<BaseResponse> {
        return this.doPost( 'updateConfigLoanOfd', payload);
    }

    /**
     * doProcess1
     *
     * @param payload
     */
    doProcess1(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess1', {
            ...payload,
        });
    }

    /**
     * doProcess2
     *
     * @param payload
     */
    doProcess2(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess2', {
            ...payload,
        });
    }

    /**
     * doProcess3
     *
     * @param payload
     */
    doProcess3(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess3', {
            ...payload,
        });
    }

    /**
     * doProcess4
     *
     * @param payload
     */
    doProcess4(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess4', {
            ...payload,
        });
    }

    /**
     * doProcess5
     *
     * @param payload
     */
    doProcess5(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess5', {
            ...payload,
        });
    }

    /**
     * doProcess6
     *
     * @param payload
     */
    doProcess6(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess6', {
            ...payload,
        });
    }

    /**
     * doProcess7
     *
     * @param payload
     */
    doProcess7(payload: FsReviewResultsDTO = new FsReviewResultsDTO()):
        Observable<BaseResponse> {
        return this.doPostOverlay('doProcess7', {
            ...payload,
        });
    }

    /**
     * approvalInvestor
     *
     * @param payload
     */
    approvalInvestor(payload: any):
        Observable<BaseResponse> {
        return this.doPostOverlay('approvalInvestor', payload);
    }

}
