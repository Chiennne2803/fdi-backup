import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../../../shared/components/pipe/date-time-format.pipe';

@Component({
    selector: 'dialog-process-6',
    templateUrl: './dialog-process-6.component.html',
    providers: [DateTimeformatPipe]
})
export class DialogProcess6Component implements OnInit {
    onSubmit = new EventEmitter();
    formGroup: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
    ) {}

    ngOnInit(): void {
        this.formGroup = this._formBuilder.group({
            status: new FormControl(null, Validators.required),
            content: new FormControl(null),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    onClickSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            this.onSubmit.emit(this.formGroup.value);
        }
    }
}
