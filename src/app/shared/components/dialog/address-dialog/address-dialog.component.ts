import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {APP_TEXT} from '../../../constants';
import {IBaseDataSourceObj} from '../../../models/base.model';
import {AddressService} from '../../../../service/common-service/address.service';

@Component({
    selector: 'address-dialog',
    templateUrl: './address-dialog.component.html'
})
export class AddressKycDialogComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();
    formGroup: FormGroup;
    provinces: IBaseDataSourceObj[] = [];
    districts: IBaseDataSourceObj[] = [];
    communes: IBaseDataSourceObj[] = [];
    message = APP_TEXT;
    alreadyAddress: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddressKycDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private _addressService: AddressService,
        private _fb: FormBuilder,
    ) { }

    get provinceFormControl(): FormControl {
        return this.formGroup.get('province') as FormControl;
    }

    get districtFormControl(): FormControl {
        return this.formGroup.get('district') as FormControl;
    }

    get communeFormControl(): FormControl {
        return this.formGroup.get('commune') as FormControl;
    }

    get streetAddressFormControl(): FormControl {
        return this.formGroup.get('street') as FormControl;
    }

    ngOnInit(): void {
        this.initAreaForm();
        // If already address value
        if ( this.data ) {
            this.alreadyAddress = this.data.split(', ');
        }

        this.loadProvince();
        this.streetAddressFormControl.patchValue(this.alreadyAddress[this.alreadyAddress.length - 4]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initAreaForm(): void {
        this.formGroup = this._fb.group({
            province: this._fb.control('', Validators.required),
            district: this._fb.control('', Validators.required),
            commune: this._fb.control('', Validators.required),
            street: this._fb.control('', Validators.required),
        });
    }

    resetForm(): void {
        this.districts = [];
        this.communes = [];
        this.formGroup.reset();
    }

    onChangeProvince(): void {
        this.communes = [];
        this.communeFormControl.patchValue(null);
        this.streetAddressFormControl.reset();
        this.loadDistrict();
    }

    loadProvince(): void {
        this.subscription.add(
            this._addressService.getProvince().subscribe((res) => {
                this.provinces = res.payload as IBaseDataSourceObj[];
                const alreadyProvince = this.provinces.filter(
                    p => p.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 1]
                )[0];
                if ( alreadyProvince ) {
                    this.provinceFormControl.patchValue(alreadyProvince);
                }
                this.loadDistrict();
            })
        );
    }

    loadDistrict(): void {
        if ( this.provinceFormControl.valid ) {
            this.subscription.add(
                this._addressService.getDistrict(this.provinceFormControl.value.categoriesCode)
                    .subscribe((res) => {
                        this.districts = res.payload as IBaseDataSourceObj[];
                        const alreadyDistrict = this.districts.filter(
                            d => d.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 2]
                        )[0];
                        this.districtFormControl.patchValue(alreadyDistrict);
                        this.loadCommune();
                    }
                )
            );
        }
    }

    loadCommune(): void {
        if ( this.districtFormControl.valid ) {
            this.subscription.add(
                this._addressService.getCommune(this.districtFormControl.value.categoriesCode)
                    .subscribe((res) => {
                        this.communes = res.payload as IBaseDataSourceObj[];
                        const alreadyCommune = this.communes.filter(
                            c => c.categoriesName === this.alreadyAddress[this.alreadyAddress.length - 3]
                        )[0];
                        this.communeFormControl.patchValue(alreadyCommune?.categoriesName);
                    }
                )
            );
        }
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if ( this.formGroup.valid ) {
            const dialogResult = this._addressService.getAddressSelectionData(this.formGroup.value);
            this.dialogRef.close(dialogResult);
        }
    }
}
