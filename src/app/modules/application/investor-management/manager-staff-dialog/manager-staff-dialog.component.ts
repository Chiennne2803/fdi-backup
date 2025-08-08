import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdmAccountDetailDTO} from "../../../../models/admin";

@Component({
    selector: 'manager-staff-dialog',
    templateUrl: './manager-staff-dialog.component.html',
})
export class ManageStaffDialogsComponent implements OnInit {
    onSubmit = new EventEmitter();
    formGroup = new FormGroup({
        managerStaff: new FormControl(null, Validators.required)
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            lstManagerStaff: AdmAccountDetailDTO[];
        },
    ) {}

    ngOnInit(): void {
    }

    onClickSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            this.onSubmit.emit(this.formGroup.value);
        }
    }
}
