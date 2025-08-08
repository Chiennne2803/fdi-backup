import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {BehaviorSubject, mergeMapTo} from "rxjs";
import {FuseAlertService} from "../@fuse/components/alert";
import {SpNotificationConfigDTO} from "./models/service/SpNotificationConfigDTO.model";
// import { getMessaging, getToken } from 'firebase/messaging';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    /**
     * Constructor
     */
    constructor(private afMessaging: AngularFireMessaging,
                private _fuseAlertService: FuseAlertService,
                ) {
        this.requestPermission();

    }

    requestPermission(): void {
        /*this.afMessaging.requestPermission.subscribe(res => console.log(res));
        this.afMessaging.requestToken.pipe(mergeMapTo(this.afMessaging.getToken)).subscribe((token) => {
            console.log('Token FCM:', token);
        });
        this.afMessaging.requestToken.subscribe(
            (token) => {
                console.log('Token:', token);
                // Sử dụng token ở đây hoặc gửi nó đến máy chủ của bạn để sử dụng với FCM
            },
            (error) => {
                console.error('Lỗi khi lấy token:', error);
            }
        );*/
        /*const messaging = getMessaging();

        getToken(messaging,
            { vapidKey: environment.firebaseConfig.vapidKey }).then(
                (currentToken) => {
                    if (currentToken) {
                        console.log('Ahihi. đã có token rầu');
                        console.log(currentToken);
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });*/
    }
}
