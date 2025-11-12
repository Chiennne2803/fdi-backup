import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { MaintenanceService } from 'app/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  message: string = 'Đang bảo trì';
  countdown: string = '--:--:--';
  private endTime: Date | null = null;
  private timerSub?: Subscription;
  isFinished = false;

  constructor(private http: HttpClient, private maintenanceService: MaintenanceService,
    private _router: Router,


  ) { }

  ngOnInit(): void {
    this.maintenanceService.getMaintenanceConfig().subscribe({
      next: (res) => {
        if (res.status === 200 && res.enabled) {
          this.message = res.message;

          const [startStr, endStr] = res.time.split(',');
          this.endTime = this.parseDateTime(endStr);

          this.timerSub = interval(1000).subscribe(() => this.updateCountdown());
          this.updateCountdown();
        } else {
          this._router.navigate(['sign-in']);
        }
      },
      error: (err) => {
        if (err.status === 503 && err.error) {
          const res = err.error;
          this.message = res.message;

          const [startStr, endStr] = res.time.split(',');
          this.endTime = this.parseDateTime(endStr);

          this.timerSub = interval(1000).subscribe(() => this.updateCountdown());
          this.updateCountdown();
        } else {
          this.message = 'Không thể kết nối đến server bảo trì';
        }
      }
    });


  }
  private parseDateTime(dateTimeStr: string): Date {
    const [datePart, timePart] = dateTimeStr.split('-');
    const [day, month, year] = datePart.split('/').map(n => parseInt(n, 10));
    const [hours, minutes] = timePart.split(':').map(n => parseInt(n, 10));

    return new Date(year, month - 1, day, hours, minutes, 0);
  }


  private updateCountdown(): void {
    if (!this.endTime) return;

    const now = new Date().getTime();
    const diff = Math.max(0, Math.floor((this.endTime.getTime() - now) / 1000));

    if (diff <= 0) {
      this.finishMaintenance();
      return;
    }

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    this.countdown = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  }

  private finishMaintenance(): void {
    this.countdown = 'Hoàn tất';
    this.isFinished = true;
    this.timerSub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
  goToSignIn(): void {
    this._router.navigate(['/sign-in']);
  }
}
