import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdmAccountDetailDTO } from 'app/models/admin';
import { ISelectModel } from 'app/shared/models/select.model';
import {InputDialogDTO} from "../../../models/base/input-dialog.model";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {FuseConfirmationConfig, FuseConfirmationService} from "../../../../@fuse/services/confirmation";

@Component({
    selector: 'app-sign-request-dialog',
    templateUrl: './sign-request-dialog.component.html',
    styleUrls: ['./sign-request-dialog.component.scss']
})
export class SignRequestDialogComponent implements OnInit {
    public signRequestForm: FormGroup = new FormGroup({});
    public lstApprovalAccount: Array<ISelectModel> = [];

    assignToReqMsg = 'RTTK010';
    assignCommentMaxlen = 100;
    assignCommentReqMsg = undefined;
    permission: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: InputDialogDTO,
        private dialogRef: MatDialogRef<SignRequestDialogComponent>,
        private _formBuilder: FormBuilder,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        this.signRequestForm = this._formBuilder.group({
            assignTo: new FormControl(null, Validators.required),
            assignComment: new FormControl(null)
        });
        this.lstApprovalAccount = this.data.lstSign.map(el => ({
            id: el.admAccountId,
            label: el.fullName
        }));
        if (this.data.permission) {
            this.permission = this.data.permission;
        }
        if (this.data.assignToReqMsg) {
            this.assignToReqMsg = this.data.assignToReqMsg;
        }
        if (this.data.assignCommentMaxlen) {
            this.assignCommentMaxlen = this.data.assignCommentMaxlen;
        }
        if (this.data.assignCommentReqMsg) {
            this.assignCommentReqMsg = this.data.assignCommentReqMsg;
        }
    }
    discard(): void {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
            actions: {
                confirm: {
                    label: 'Đồng ý',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this.dialogRef.close();
            }
        });
        return;
    }

    submit(): void {
        this.signRequestForm.markAllAsTouched();
        if (this.signRequestForm.dirty) {
            this.dialogRef.close(this.signRequestForm.value);
        } else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
    }
}
