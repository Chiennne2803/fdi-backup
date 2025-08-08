import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {InvestorListService} from '../../../service/investor/investor-profile-list.service';

@Component({
    selector     : 'invested-profile',
    templateUrl  : './invested-profile.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InvestedProfileComponent implements OnInit
{
    menuData: FuseNavigationItem[];
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _investorListService: InvestorListService,
    ) {
        this.menuData = [
            {
                title   : 'Quản lý hồ sơ đầu tư',
                type    : 'group',
                children: [
                    {
                        title: 'Chờ phê duyệt',
                        type : 'basic',
                        link: '/investor/invested-profile-management',
                        exactMatch: true,
                    },
                    {
                        title: 'Đang đầu tư',
                        type : 'basic',
                        link: '/investor/invested-profile-management/investing',
                    },
                    {
                        title: 'Đã đầu tư',
                        type : 'basic',
                        link: '/investor/invested-profile-management/invested',
                    },
                    {
                        title: 'Từ chối',
                        type : 'basic',
                        link: '/investor/invested-profile-management/rejected',
                    },
                ]
            },
        ];
    }

    ngOnInit(): void {
        this._investorListService.setDrawer(this.detailDrawer);
    }
}
