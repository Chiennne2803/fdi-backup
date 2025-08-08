import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {AdmAccessLogService} from "../../../service";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
    selector: 'action-audit',
    templateUrl: './action-audit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ActionAuditComponent {
    // @ViewChild('detailDrawer', {static: true}) detailDrawer: MatDrawer;
    menuData: FuseNavigationItem[];

    /**
     * Constructor
     */
    constructor(
        private _admAccessLogService: AdmAccessLogService,
    ) {
    }

    ngOnInit(): void {
        this.menuData = [
            {
                title: 'Giám sát truy cập',
                type: 'group',
                children: [
                    {
                        title: 'Nhân viên',
                        type: 'basic',
                        link: `staff`,
                    },
                    {
                        title: 'Tài khoản NĐT',
                        type: 'basic',
                        link: `investor`,
                    },
                    {
                        title: 'Tài khoản bên HĐV',
                        type: 'basic',
                        link: `lender`,
                    },
                ]
            },
        ];
        // this._admAccessLogService.setDrawer(this.detailDrawer);
    }
}
