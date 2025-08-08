import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from '@fuse/animations';
import {AdmAccountType} from 'app/core/user/user.types';
import {AdmCategoriesDTO} from 'app/models/admin';
import {AccountModel} from 'app/models/service/FsAccountBankDTO.model';
import {ProfileService} from 'app/service/common-service';
import {AuthService} from "../../../../../core/auth/auth.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ActivatedRoute, Router} from "@angular/router";
import {ChangeIdentificationComponent} from "../change-identification-dialog/change-identification.component";
import {ChangeGpkdDialogComponent} from "../change-gpkd-dialog/change-gpkd-dialog.component";
import {KycServices} from "../../../../../service/kyc";

@Component({
    selector: 'change-id-gpkd',
    templateUrl: './change-id-gpkd.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ChangeIdGpkdComponent implements OnInit {
    titlePage: string = '';
    constructor(
        private _route: Router,
        public authService: AuthService,
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
        private route: ActivatedRoute,
        private _kycService: KycServices,
    ) {
    }

    ngOnInit(): void {
        this._profileService.titlePage$.subscribe(t => this.titlePage = t);
    }

    changeIdentification(): void {
        const dialog = this._matDialog.open(ChangeIdentificationComponent, {disableClose: true});
    }

    changeBusinessLicense(): void {
        const dialog = this._matDialog.open(ChangeGpkdDialogComponent, {disableClose: true});
    }

    downloadBCCTTemplate() {
        this._kycService.downloadTemplate('downloadTemplateBCTC')
    }

}
