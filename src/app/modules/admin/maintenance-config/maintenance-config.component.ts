import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert';
import { MaintenanceService } from 'app/service';

@Component({
  selector: 'app-maintenance-config',
  templateUrl: './maintenance-config.component.html'
})
export class MaintenanceConfigComponent implements OnInit {
  maintenanceForm!: FormGroup;
  minDate = new Date();        // hôm nay
  minStartTime = '';           // cho giờ bắt đầu
  minEndTime = '';
  constructor(
    private _formBuilder: FormBuilder,
    private maintenanceService: MaintenanceService,
    private _fuseAlertService: FuseAlertService,
  ) { }

  ngOnInit(): void {
    this.maintenanceForm = this._formBuilder.group({
      isMaintenance: new FormControl(false),
      startDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      startTime: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      ]),
      endDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      endTime: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      ]),
      content: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(5)])
    });

    // gọi API để fill form
    this.maintenanceService.getMaintenance(false).subscribe({
      next: (res) => {
        if (res) {
          this.patchForm(res);
        }
      },
      error: (err) => console.error('Lỗi load data:', err)
    });

    // theo dõi khi toggle thay đổi
    this.maintenanceForm.get('isMaintenance')?.valueChanges.subscribe((value) => {
      if (value) {
        this.enableFormControls();
      } else {
        this.disableFormControls();
      }
    });
    // theo dõi startDate, startTime -> cập nhật minEndTime
    this.maintenanceForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateMinEndTime();
    });
    this.maintenanceForm.get('startTime')?.valueChanges.subscribe(() => {
      this.updateMinEndTime();
    });
  }
  private updateMinEndTime(): void {
    const startDate = this.maintenanceForm.get('startDate')?.value;
    const startTime = this.maintenanceForm.get('startTime')?.value;

    if (startDate && startTime) {
      const [h, m] = startTime.split(':').map(Number);
      const start = new Date(startDate);
      start.setHours(h, m, 0, 0);

      // Nếu endDate = startDate thì endTime ≥ startTime
      const endDate = this.maintenanceForm.get('endDate')?.value;
      if (endDate && new Date(endDate).toDateString() === start.toDateString()) {
        this.minEndTime = startTime;
      } else {
        this.minEndTime = '';
      }
    }
  }

  private patchForm(data: any): void {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    this.maintenanceForm.patchValue({
      isMaintenance: data.status === 1,
      startDate: start,
      startTime: this.formatTime(start),
      endDate: end,
      endTime: this.formatTime(end),
      content: data.message
    });

    // Nếu status = 0 thì disable các input (chỉ giữ toggle)
    if (data.status === 0) {
      this.disableFormControls();
    } else {
      this.enableFormControls();
    }
  }

  private enableFormControls(): void {
    this.maintenanceForm.get('startDate')?.enable();
    this.maintenanceForm.get('startTime')?.enable();
    this.maintenanceForm.get('endDate')?.enable();
    this.maintenanceForm.get('endTime')?.enable();
    this.maintenanceForm.get('content')?.enable();
  }

  private disableFormControls(): void {
    this.maintenanceForm.get('startDate')?.disable();
    this.maintenanceForm.get('startTime')?.disable();
    this.maintenanceForm.get('endDate')?.disable();
    this.maintenanceForm.get('endTime')?.disable();
    this.maintenanceForm.get('content')?.disable();
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      const formValue = this.maintenanceForm.getRawValue();
      const start = this.combineDateTime(formValue.startDate, formValue.startTime);
      const end = this.combineDateTime(formValue.endDate, formValue.endTime);
  
      const payload = {
        startTime: start,
        endTime: end,
        message: formValue.content,
        status: formValue.isMaintenance ? 1 : 0,
      };
  
      console.log('Submitting payload:', payload);
  
      this.maintenanceService.updateMaintenance({ cronExpression: JSON.stringify(payload) }).subscribe({
        next: (res) => {
          if (!res || (res && res.errorCode === 'CM000')) {
            this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
          } else {
            this._fuseAlertService.showMessageSuccess('Cập nhật thất bại');
            const errorMsg = res?.message || 'Có lỗi xảy ra';
            this._fuseAlertService.showMessageError(errorMsg);
          }
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          this._fuseAlertService.showMessageError('Lỗi kết nối API: ' + (err.message || 'Unknown'));
        },
        complete: () => {
          console.log('Observable completed'); 
        }
      });
    } else {
      console.log('Form invalid. Errors:', this.maintenanceForm.errors);
      this._fuseAlertService.showMessageError('Vui lòng kiểm tra lại thông tin form');
    }
  }

  private combineDateTime(date: Date, time: string): string {
    if (!date || !time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);

    return `${result.getFullYear()}-${(result.getMonth() + 1).toString().padStart(2, '0')}-${result.getDate().toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  private formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}
