import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { BaseResponse } from 'app/models/base';
import { Observable } from 'rxjs';
import {DocumentConfigService} from '../../../service/admin/document-config.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentConfigResolver implements Resolve<BaseResponse> {

    constructor(private _documentConfigService: DocumentConfigService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BaseResponse> {
        return this._documentConfigService.doSearch();
    }
}
