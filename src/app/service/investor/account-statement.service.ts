import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {Observable} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";
import {FsTransactionHistoryDTO} from "../../models/service";

@Injectable({
    providedIn: 'root'
})
export class AccountStatementService extends BaseService {
    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'accountStatement');
    }


    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }

    /**
     * Get loan reviews
     *
     *
     * @param payload
     */
    doSearch(payload: FsTransactionHistoryDTO = new FsTransactionHistoryDTO()): Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }
}
