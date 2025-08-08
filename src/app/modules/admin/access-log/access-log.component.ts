import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {ROUTER_CONST} from '../../../shared/constants';
import {InvestorListService} from '../../../service/investor/investor-profile-list.service';
import {TranspayInvestorTransactionService} from "../../../service";
import {fuseAnimations} from "../../../../@fuse/animations";

@Component({
  selector: 'app-investor-refund',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss'],
    animations: fuseAnimations
})
export class AccessLogComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    menuData: FuseNavigationItem[];
    public isShowDetail = false;

    /**
     * constructor
     * @param _investorTransService
     */
    constructor(
        private _investorTransService: TranspayInvestorTransactionService,
    ) { }

    ngOnInit(): void {
        this.menuData = [
            {
                title   : 'Giám sát truy cập',
                type    : 'group',
                children: [
                    {
                        title: 'Nhân viên',
                        type : 'basic',
                        link: ROUTER_CONST.config.admin.accessLogs.staff.link,
                        exactMatch: true,
                    },
                    {
                        title: 'Tài khoản NĐT',
                        type : 'basic',
                        link: ROUTER_CONST.config.admin.accessLogs.investor.link,
                    },
                    {
                        title: 'Tài khoản bên HĐV',
                        type : 'basic',
                        link: ROUTER_CONST.config.admin.accessLogs.lender.link,
                    },
                ]
            },
        ];
        this._investorTransService.isShowDetail$.subscribe((value: boolean) => {
            this.isShowDetail = value;
        })
    }

}
