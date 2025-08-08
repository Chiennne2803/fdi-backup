import { Component, OnInit } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'app-commission-management',
    templateUrl: './commission-management.component.html',
    styleUrls: ['./commission-management.component.scss']
})
export class CommissionManagementComponent implements OnInit {
    menuData: FuseNavigationItem[] = [
        {
            title: 'Thanh toán hoa hồng',
            type: 'group',
            children: [
                {
                    title: 'Danh sách giao dịch',
                    type: 'basic',
                    link: '/application/commission-management/transaction',
                    exactMatch: true,
                },
                {
                    title: 'Yêu cầu thanh toán hoa hồng',
                    type: 'basic',
                    link: '/application/commission-management/request-payment'
                }
            ]
        },
    ];

    constructor() { }

    ngOnInit(): void {
    }

}
