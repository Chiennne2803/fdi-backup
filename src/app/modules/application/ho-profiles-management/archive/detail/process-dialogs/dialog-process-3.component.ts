import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../../../shared/components/pipe/date-time-format.pipe';
import {AdmAccountDetailDTO} from "../../../../../../models/admin";


@Component({
    selector: 'dialog-process-3',
    templateUrl: './dialog-process-3.component.html',
})
export class DialogProcess3Component implements OnInit {
    onSubmit = new EventEmitter();
    formGroup = new FormGroup({
        approvalBy: new FormControl(null, Validators.required)
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            lstApprovedByProcess3: AdmAccountDetailDTO[];
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
