import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { DashboardService } from 'app/service/common-service/dashboard.service';
import {Observable} from 'rxjs';
import {BaseResponse} from 'app/models/base';
import {AuthService} from "../../../core/auth/auth.service";
import {User} from "../../../core/user/user.types";
import {DashboardDTO} from "../../../models/admin/DashboardDTO.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector     : 'dashboard',
    templateUrl  : './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit
{
    public dashBoardValue: Observable<BaseResponse>;
    public dashboardDTO: DashboardDTO;
    public user: User;
    public avatar: string | SafeResourceUrl = 'assets/images/avatars/brian-hughes.jpg';
    /**
     * Constructor
     */
    constructor(
        private _dashBoardService: DashboardService,
        private _authService: AuthService,
        private _domSanitizer: DomSanitizer,
    )
    {}

    ngOnInit(): void {
        this.user = this._authService.authenticatedUser;
        this.avatar = this._authService.loadDefaultAvatar();
        this._authService.getAvata.subscribe(res => {
            if (res) {
                this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl(res);
            } else {
                this.avatar = this._authService.loadDefaultAvatar();
                this._authService.loadAvataLocal();
            }
        })
        this._dashBoardService.dashboard$.subscribe(res => this.dashboardDTO = res);
    }
}
