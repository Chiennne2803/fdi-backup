import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'main-screen',
    templateUrl: './main-screen.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MainScreenComponent {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public screenMode: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _title: Title,   // 👈 inject Title service
    ) {
        this._route.params.subscribe(params => {
            this.screenMode = params['key'];
            this.setPageTitle(this.screenMode);
        });
    }

    private setPageTitle(mode: string): void {
        let title = 'Hồ sơ'; // default
        switch (mode) {
            case 'company-info':
                title = 'Thông tin chi tiết doanh nghiệp';
                break;
            case 'representative':
                title = 'Thông tin người đại diện';
                break;
            case 'detail':
                title = 'Thông tin chi tiết cá nhân';
                break;
            case 'biggest-capital-contributor':
                title = 'Người góp vốn lớn nhất';
                break;
            case 'economic-info':
                title = 'Báo cáo tài chính chi tiết';
                break;
            case 'legal-documents':
                title = 'Hồ sơ pháp lý';
                break;
            case 'financial-documents':
                title = 'Hồ sơ tài chính';
                break;
            case 'business-activity':
                title = 'Tài liệu hoạt động kinh doanh';
                break;
            case 'contact-information':
                title = 'Thông tin liên hệ';
                break;
            case 'labor-contract':
                title = 'Hợp đồng lao động';
                break;
            case 'rental-contract':
                title = 'Hợp đồng cho thuê tài sản';
                break;
            case 'other-income':
                title = 'Giấy chứng minh thu nhập khác';
                break;
            case 'other-valuable-papers':
                title = 'Giấy tờ có giá trị khác';
                break;
            default:
                title = 'Quản lý tài khoản';
        }
        this._title.setTitle(title + ' - LINKFIIN'); // 👈 set title kèm brand
    }
}
