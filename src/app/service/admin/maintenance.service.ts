import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { BaseService } from '../base-service';
import { FuseAlertService } from '@fuse/components/alert';

@Injectable({ providedIn: 'root' })
export class MaintenanceService extends BaseService {
    private maintenanceCache: any = null;

    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'vsa/service', true);
    }

    getMaintenance(isCheck: boolean): Observable<any> {
        if (this.maintenanceCache && isCheck) {
            return of(this.maintenanceCache);
        }

        return this.doGet('maintenance').pipe(
            tap((res) => this.maintenanceCache = res.payload), // lưu cache là payload
            map((res) => res.payload) // chỉ trả payload ra ngoài
        );
    }

    getMaintenanceConfig(): Observable<any> {
        return this.doGet('config');
    }

    updateMaintenance(payload: any): Observable<any> {
    return this.doPost('maintenance/update', payload).pipe(
        tap((res) => {
            if (res?.payload) {
                this.maintenanceCache = res.payload;
            }
        }),
        map((res) => res?.payload) // chỉ trả payload ra ngoài nếu bạn muốn
    );
}


}
