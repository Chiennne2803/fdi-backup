import {Injectable} from '@angular/core';
import {FuseUtilsService} from '@fuse/services/utils';
import {AlertDTO} from 'app/models/base/alert';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {forEach} from "lodash-es";


@Injectable({
    providedIn: 'root'
})
export class FuseAlertService {
    public _notify: BehaviorSubject<Array<AlertDTO>> = new BehaviorSubject(null);
    public arrNotify: Array<AlertDTO> = [];
    private readonly _onDismiss: ReplaySubject<string> = new ReplaySubject<string>(1);
    private readonly _onShow: ReplaySubject<string> = new ReplaySubject<string>(1);

    /**
     * Constructor
     */
    constructor(private _fuseUtilsService: FuseUtilsService) {
        this.arrNotify = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get lstNotify(): Observable<any> {
        return this._notify.asObservable();
    }

    /**
     * Getter for onDismiss
     */
    get onDismiss(): Observable<any> {
        return this._onDismiss.asObservable();
    }

    /**
     * Getter for onShow
     */
    get onShow(): Observable<any> {
        return this._onShow.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert
     *
     * @param name
     */
    dismiss(name: string): void {
        // Return if the name is not provided
        if (!name) {
            return;
        }

        // Execute the observable
        this._onDismiss.next(name);
    }

    /**
     * Show the dismissed alert
     *
     * @param name
     */
    show(name: string): void {
        // Return if the name is not provided
        if (!name) {
            return;
        }
        // Execute the observable
        this._onShow.next(name);
    }



    showMessageSuccess(message: string, timeout?: number): void {
        // Return if the name is not provided
        if (!message) {
            return;
        }
        const alertObj = new AlertDTO({
            idMessage: this._fuseUtilsService.randomId() + new Date().getTime(),
            name: 'messageSuccess',
            message: message,
            type: 'success'
        });
        this.pushAlert(alertObj, timeout);
    }

    showMessageError(message: string, timeout?: number): void {
        // Return if the name is not provided
        if (!message) {
            return;
        }
        const alertObj = new AlertDTO({
            idMessage: this._fuseUtilsService.randomId() + new Date().getTime(),
            name: 'messageSuccess',
            message: message,
            type: 'error'
        });
        this.pushAlert(alertObj, timeout);
    }

    showMessageWarning(message: string, timeout?: number): void {
        // Return if the name is not provided
        if (!message) {
            return;
        }
        const alertObj = new AlertDTO({
            idMessage: this._fuseUtilsService.randomId() + new Date().getTime(),
            name: 'messageSuccess',
            message: message,
            type: 'warning'
        });

        this.pushAlert(alertObj, timeout);
    }

    private pushAlert(alertObj: AlertDTO, timeout?: number): void {
        let checkDuplicateMsg = false;
        if (this.arrNotify != undefined && this.arrNotify.length > 0) {
            this.arrNotify.forEach((alt) => {
                if (alt.message === alertObj.message) {
                    checkDuplicateMsg = true;
                    return;
                }
            });
        }
        if (checkDuplicateMsg) {
            return;
        }
        this.arrNotify.push(alertObj);
        this._notify.next(this.arrNotify);
        // Execute the observable
        this._onShow.next(alertObj.idMessage);
        setTimeout(() => {
            this.dismiss(alertObj.idMessage);

            const index: number = this.arrNotify.indexOf(alertObj);
            if (index !== -1) {
                this.arrNotify.splice(index, 1);
            }
        }, timeout ?? 5000);
    }

}
