import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {RechargeTransactionService} from 'app/service/admin/recharge-transaction.service';
import {ROUTER_CONST} from 'app/shared/constants';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {InvestorService} from 'app/service';
import {FsLoanProfilesDTO} from 'app/models/service';
import {WControlEuDTO} from 'app/models/wallet/WControlEuDTO.model';
import {TopupDialog} from '../investment-topup/dialogs/investor-dialogs.component';
import {FsReqTransP2PService} from "../../../service/admin/req-trans-p2p.service";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
    selector     : 'investor-charge-transaction',
    templateUrl  : './investment-transfer.component.html',
    styleUrls: ['./investment-transfer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InvestmentTransferComponent
{
    menuData: FuseNavigationItem[];
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    investorProfile: FsLoanProfilesDTO;
    wControlEuDTO: WControlEuDTO;
    public fullName = '';

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
        private _fsReqTransP2PService: FsReqTransP2PService,
        private _matDialog: MatDialog,
        private authService: AuthService,
    ) {
        this._fsReqTransP2PService.prepare().subscribe();
        this.fullName = this.authService.authenticatedUser.fullName;
        this.menuData = [
            {
                type    : 'group',
                children: [
                    {
                        title: 'Hồ sơ đề nghị chuyển nhượng',
                        type : 'basic',
                        link: `/${ROUTER_CONST.config.investor.investmentTransfer.sale.link}`,
                    },
                    {
                        title: 'Hồ sơ chuyển nhượng của tôi',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.investor.investmentTransfer.offer.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Đang chuyển nhượng',
                                type : 'basic',
                                link: `/${ROUTER_CONST.config.investor.investmentTransfer.offer.link}`,
                                exactMatch: true,
                            },
                            {
                                title: 'Đã kết thúc',
                                type : 'basic',
                                link: `/${ROUTER_CONST.config.investor.investmentTransfer.offer.link}/finished`,
                                exactMatch: true,
                            }
                        ]
                    },
                ]
            },
        ];
    }

    ngOnInit(): void {

        this._fsReqTransP2PService.prepareP2P$.subscribe((res) => {
            if (res) {
                this.wControlEuDTO = res.payload.wControlEuDTO;
            }
        });
    }

    public oepnTopupDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        this._matDialog.open(TopupDialog, dialogConfig);
    }
}
