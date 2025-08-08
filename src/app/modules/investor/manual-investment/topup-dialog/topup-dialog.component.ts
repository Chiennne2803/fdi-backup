import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TopupService } from '../../../../service/investor/topup.service';
import {FsTopupDTO} from '../../../../models/service/FsTopupDTO.model';

@Component({
    selector: 'create-department-dialog',
    templateUrl: './topup-dialog.component.html',
})

export class TopupDialogComponent implements OnInit {
    topUp: FsTopupDTO;

    constructor(
        private matDialogRef: MatDialogRef<TopupDialogComponent>,
        private _topUpService: TopupService,
    ) { }

    ngOnInit(): void {
        this._topUpService.getPrepareLoadingPage().subscribe((res) => {
            this.topUp = res.payload;
        });
    }

    discard(): void {
        this.matDialogRef.close(false);
    }
}
