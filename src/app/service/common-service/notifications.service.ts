import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, ReplaySubject, switchMap, take, tap} from 'rxjs';
import {BaseService} from "../base-service";
import {FuseAlertService} from "../../../@fuse/components/alert";
import {SpNotificationDTO} from "../../models/service/SpNotificationDTO.model";
import {BaseResponse} from "../../models/base";
import {AdmDepartmentsDTO} from "../../models/admin";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService extends BaseService {
    private _notifications: ReplaySubject<SpNotificationDTO[]> = new ReplaySubject<SpNotificationDTO[]>(1);

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'notification');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<SpNotificationDTO[]> {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    searchNotRead(payload?: any): Observable<BaseResponse> {
        return this.searchNotLazy('searchNotRead', payload, true).pipe(
            tap((notifications) => {
                this._notifications.next(notifications.content);
            })
        );
    }
    /**
     * Get all notifications
     */
    doSearch(payload?: any): Observable<BaseResponse> {
        return this.searchDataLazyLoad('search', payload, true)
    }

    /**
     * getDetail
     *
     * @param payload
     */
    getDetail(payload: SpNotificationDTO = new SpNotificationDTO()):
        Observable<BaseResponse> {
        return this.doGetDetail(payload);
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(notification: SpNotificationDTO): Observable<SpNotificationDTO> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this.doUpdate(notification).pipe(
                map((res) => {

                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.spNotificationId === notification.spNotificationId);

                    // Update the notification
                    notifications[index] = res.payload.entity;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return res.payload;
                })
            ))
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */

    /*delete(id: number): Observable<boolean>
    {
        return null;
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }*/

    /**
     * Mark all notifications as read
     */
    markAllAsRead(payload?) {
        return this.doPost('markAllAsRead', payload);
    }
}
