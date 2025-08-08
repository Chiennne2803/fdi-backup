import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import {FsTopupDTO} from 'app/models/service';
import {Observable} from 'rxjs';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})
export class TopupService extends BaseService {
    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, 'investor', 'topup');
    }

    /**
     * getPrepareLoadingPage
     */
    getPrepareLoadingPage(): Observable<BaseResponse> {
        return this.prepareLoadingPage();
    }

    /**
     * doSearch
     *
     * @param payload
     */
    doSearch(payload: FsTopupDTO = new FsTopupDTO()):
        Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload);
    }

    /**
     * create
     *
     * @param payload
     */
    create(payload: FsTopupDTO = new FsTopupDTO()):
        Observable<any> {
        return this.doCreate(payload);
    }

    /**
     * prepare loading page
     *
     */
    prepareLoading():
        Observable<any> {
        return this.prepareLoadingPage();
    }
}
