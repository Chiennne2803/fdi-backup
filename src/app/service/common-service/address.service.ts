import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'app/models/base';
import { IAddressData, IAddressForm } from 'app/shared/models/address.model';

import { HttpService } from 'app/shared/services/common/http.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AddressService extends HttpService {
    private urlPath = `${environment.contextPathUrl}area/`;

    constructor(_httpClient: HttpClient) {
        super(_httpClient);
    }

    getProvince(): Observable<BaseResponse> {
        return this.post(`${this.urlPath}getProvince`, {});
    }

    getDistrict(id: string): Observable<BaseResponse> {
        return this.post(`${this.urlPath}getDistrict`, { payload: { areaCode: id } });
    }

    getCommune(id: string): Observable<BaseResponse> {
        return this.post(`${this.urlPath}getCommune`, { payload: { areaCode: id } });
    }

    getAddressSelectionData(value: IAddressForm): IAddressData {
        const province = value?.province?.categoriesName || '';
        const district = value?.district?.categoriesName || '';
        const commune = value?.commune?.categoriesName || '';
        const street = value?.street || '';

        const payload = [street, commune, district, province].filter(Boolean).join(', ');

        return {
            province,
            district,
            commune,
            street,
            payload,
        };
    }

}
