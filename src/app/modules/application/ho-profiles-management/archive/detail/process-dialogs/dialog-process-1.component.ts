import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AdmAccountDetailDTO} from '../../../../../../models/admin';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../../../shared/components/pipe/date-time-format.pipe';

@Component({
    selector: 'dialog-process-1',
    templateUrl: './dialog-process-1.component.html',
})
export class DialogProcess1Component implements OnInit {
    onSubmit = new EventEmitter();
    formGroup = new FormGroup({
        approvalBy: new FormControl(null, Validators.required)
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            lstApprovedByProcess1: AdmAccountDetailDTO[];
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





