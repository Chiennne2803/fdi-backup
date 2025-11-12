import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InvestorService } from '../../../service';
import { FsLoanProfilesDTO } from '../../../models/service';
import { WControlEuDTO } from '../../../models/wallet/WControlEuDTO.model';
import { TopupDialog } from "../investment-topup/dialogs/investor-dialogs.component";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
    templateUrl: './manual-investment.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ManualInvestmentComponent implements OnInit {
    investorProfile: FsLoanProfilesDTO;
    wControlEuDTO: WControlEuDTO;
    listInvestmentTime: number[];
    public fullName = '';

    constructor(
        private _investorService: InvestorService,
        private _matDialog: MatDialog,
        private authService: AuthService,
    ) {
        this.fullName = this.authService.authenticatedUser.fullName;
        this.checkScreenSize();
    }
    isMobile = false;

    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; // < 1024px thì coi là mobile/tablet
    }

    ngOnInit(): void {
        this._investorService.prepare$.subscribe((res) => {
            if (res && res.payload) {
                this.wControlEuDTO = res.payload.wControlEuDTO;
                this.listInvestmentTime = res.payload.listInvestmentTime;
            }
        });
    }


    public openTopupDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        this._matDialog.open(TopupDialog, dialogConfig);
    }
}
