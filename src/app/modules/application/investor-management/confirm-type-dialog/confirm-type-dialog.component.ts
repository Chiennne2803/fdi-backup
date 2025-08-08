import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {UserType} from '../../../../models/admin';

@Component({
    selector: 'app-confirm-type-dialog',
    templateUrl: './confirm-type-dialog.component.html',
    styleUrls: ['./confirm-type-dialog.component.scss']
})
export class ConfirmTypeDialogComponent implements OnInit {
    userType = UserType;
    constructor(
        public matDialogRef: MatDialogRef<ConfirmTypeDialogComponent>,
    ) { }

    ngOnInit(): void {
    }

}
