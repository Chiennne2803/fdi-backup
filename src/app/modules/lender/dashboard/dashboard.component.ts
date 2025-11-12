import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from 'app/service/common-service/dashboard.service';
import { Observable } from 'rxjs';
import { BaseResponse } from 'app/models/base';
import { AuthService } from "../../../core/auth/auth.service";
import { User } from "../../../core/user/user.types";
import { DashboardDTO } from "../../../models/admin/DashboardDTO.model";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { getInitials } from 'app/shared/utils/utils';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    public dashBoardValue: Observable<BaseResponse>;
    public dashboardDTO: DashboardDTO;
    public user: User;
    public avatar: string | SafeResourceUrl;
    /**
     * Constructor
     */
    constructor(
        private _dashBoardService: DashboardService,
        private _authService: AuthService,
        private _domSanitizer: DomSanitizer,
    ) { }

    ngOnInit(): void {
        this.user = this._authService.authenticatedUser;
        this._authService.getAvata.subscribe(res => {
            if (res) {
                this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl(res);
            } 
        })
        this._dashBoardService.dashboard$.subscribe(res => this.dashboardDTO = res);
    }
    getInitials(name: string): string {
        return getInitials(name);
    }
}
