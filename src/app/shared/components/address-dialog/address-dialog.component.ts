import { Component, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdmCategoriesDTO } from 'app/models/admin';
import { AddressService } from 'app/service/common-service/address.service';
import { ISelectModel } from 'app/shared/models/select.model';

@Component({
    selector: 'app-address-dialog',
    templateUrl: './address-dialog.component.html',
    styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
    public addressForm: FormGroup = new FormGroup({});
    public provinces: Array<ISelectModel> = [];
    public districts: Array<ISelectModel> = [];
    public communes: Array<ISelectModel> = [];
    private defaultData: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string,
        private dialogRef: MatDialogRef<AddressDialogComponent>,
        private _addressService: AddressService,
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initForm();
        this._addressService.getProvince().subscribe((res) => {
            if (res) {
                this.provinces = (res.payload as AdmCategoriesDTO[]).map(el => ({
                    id: el.categoriesCode,
                    label: el.categoriesName
                }));
                if (this.data) {
                    const addressData = this.data.split(', ');
                    const province = this.provinces.filter(x => x.label === addressData[3])[0].id;
                    this.onPickProvince(province as string);
                    this.defaultData = {
                        address: addressData[0],
                        province: province
                    };
                    this.initForm(this.defaultData);
                }
            }
        });
    }

    onPickProvince(event: string): void {
        if (event) {
            this._addressService.getDistrict(event).subscribe((res) => {
                if (res) {
                    this.districts = (res.payload as AdmCategoriesDTO[]).map(el => ({
                        id: el.categoriesCode,
                        label: el.categoriesName
                    }));
                    this.addressForm.controls.district.enable();
                    if (this.data) {
                        const district = this.districts.filter(x => x.label === this.data.split(', ')[2])[0].id;
                        this.addressForm.controls.district.setValue(district);
                        this.onPicDistrict(district as string);
                    } else {
                        this.addressForm.controls.district.setValue(null);
                    }
                }
            });
        }
    }
    onPicDistrict(event: string): void {
        if (event) {
            this._addressService.getCommune(event).subscribe((res) => {
                if (res) {
                    this.communes = (res.payload as AdmCategoriesDTO[]).map(el => ({
                        id: el.categoriesCode,
                        label: el.categoriesName
                    }));
                    this.addressForm.controls.commune.enable();
                    if (this.data) {
                        const commune = this.communes.filter(x => x.label === this.data.split(', ')[1])[0].id;
                        this.addressForm.controls.commune.setValue(commune);
                    } else {
                        this.addressForm.controls.commune.setValue(null);
                    }
                }
            });
        }
    }

    discard(): void {
        this.dialogRef.close();
    }

    reset(): void {
        this.addressForm.reset();
        this.addressForm.controls.district.disable();
        this.addressForm.controls.commune.disable();
    }

    submit(): void {
        this.addressForm.markAllAsTouched();
        if (this.addressForm.valid) {
            const value = this.addressForm.value;
            const commune = this.communes.filter(x => x.id === value.commune)[0].label;
            const district = this.districts.filter(x => x.id === value.district)[0].label;
            const province = this.provinces.filter(x => x.id === value.province)[0].label;
            this.dialogRef.close(`${value.address}, ${commune}, ${district}, ${province}`);
        }
    }

    private initForm(data?: any): void {
        this.addressForm = this._formBuilder.group({
            province: new FormControl(data ? data.province : null, [Validators.required]),
            district: new FormControl({
                value: null,
                disabled: this.provinces.length === 0
            }, [Validators.required]),
            commune: new FormControl({
                value: null,
                disabled: this.districts.length === 0
            }, [Validators.required]),
            address: new FormControl(data ? data.address : null, [Validators.required]),
        });
    }

    isValidatorRequired(controlName: string) : boolean {
        const validator = this.addressForm.get(controlName).validator({} as AbstractControl);
        return !!(validator && validator.required);
    }

}
