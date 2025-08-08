import { Component, OnInit } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import {ManagementCashInReqService} from "../../../service/admin/management-cash-in-req.service";

@Component({
    selector: 'app-funding-process',
    templateUrl: './funding-process.component.html',
    styleUrls: ['./funding-process.component.scss']
})
export class FundingProcessComponent implements OnInit {
    public wHo: number = 0;
    public totalChargeCash: number = 0;
    public showDetail: boolean = false;

    menuData: FuseNavigationItem[] = [
        {
            title: 'Xử lý yêu cầu tiếp quỹ',
            type: 'group',
            children: [
                {
                    title: 'Chờ phê duyệt',
                    type: 'basic',
                    link: '/application/funding-process/waiting',
                    exactMatch: true,
                },
                {
                    title: 'Giao dịch lỗi',
                    type: 'basic',
                    link: '/application/funding-process/error'
                },
                {
                    title: 'Đã phê duyệt',
                    type: 'basic',
                    link: '/application/funding-process/success'
                }
            ]
        },
    ];

    constructor(private _manageCashInReqService: ManagementCashInReqService) { }

    ngOnInit(): void {
        this._manageCashInReqService.getPrepare$.subscribe(res => {
            this.wHo = res.payload.wHo;
            this.totalChargeCash = res.payload.totalChargeCash;
        })
        this._manageCashInReqService.getShowDetail$.subscribe(res => this.showDetail = res);
    }
}
