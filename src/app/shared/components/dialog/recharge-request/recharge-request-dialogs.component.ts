import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {FsTopupDTO} from '../../../../models/service';
import {TopUpTransactionService} from '../../../../service/admin/topup-transaction.service';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';

@Component({
  selector: 'confirm-processing',
  templateUrl: './recharge-request-dialogs.component.html',
  styleUrls: ['recharge-request-dialogs.component.css'],
})
export class RechargeRequestDialogsComponent implements OnInit {
  onSubmit = new EventEmitter();
  rechargeRequestForm: UntypedFormGroup;
  listTopupWaits = [];
  payload: object;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      lstTopupWait: [FsTopupDTO];
      title: string;
      status: number;
      transCode?: string;
      complete: () => void;
      isTopupTransaction?: boolean;
    },
    private _formBuilder: FormBuilder,
    private _topupTransactionService: TopUpTransactionService,
    private _fuseAlertService: FuseAlertService,
    private _confirmService: FuseConfirmationService,
    private _router: Router, 
  ) { }

  /**
   * On init
   */
  ngOnInit(): void {
    const defaultAmount = this.data.isTopupTransaction && this.data.lstTopupWait && this.data.lstTopupWait.length > 0
      ? this.data.lstTopupWait[0].amount
      : 0;

    this.rechargeRequestForm = this._formBuilder.group({
      transCode: (this.data.status === 6 || this.data.status === 2)
        ? new FormControl(null, Validators.required)
        : new FormControl(),
      amount: (this.data.status === 6 || this.data.status === 3)
        ? new FormControl(defaultAmount, [Validators.required, Validators.min(1)])
        : new FormControl(),
      transCodeStr: new FormControl({value: this.data.transCode, disabled: true}),
    });

    this.listTopupWaits = this.data.lstTopupWait;
  }

  public submit(): void {
    if (this.rechargeRequestForm.invalid) {
      return;
    }
    const formValue = this.rechargeRequestForm.value;
    this.onSubmit.emit(formValue);
  }

  public close(): void {
    this.data.complete();
  }

  public onKey(target): void {
    if (target.value) {
      this.listTopupWaits = this.search(target.value);
    } else {
      this.listTopupWaits = this.data.lstTopupWait;
    }
  }

  public search(value: string): any {
    return this.listTopupWaits.filter(option => option.fsTopupCode.toLowerCase().includes(value.toLowerCase()));
  }
}

@Component({
  selector: 'recharge-request-save-dialogs',
  templateUrl: './recharge-request-save-dialogs.component.html',
})
export class RechargeRequestSaveDialogsComponent {
  public currentDate = new Date();
  onUpdate = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      complete: () => void;
    },
  ) {}

  public update(): void {
    this.onUpdate.emit();
  }

  public close(): void {
    this.data.complete();
  }
}