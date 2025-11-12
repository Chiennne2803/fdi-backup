import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceService } from './device.service';

@Injectable()
export class DeviceInterceptor implements HttpInterceptor {
  constructor(private deviceService: DeviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const deviceId = this.deviceService.getDeviceId();

    // Gắn header X-Device-ID vào tất cả request
    const cloned = req.clone({
      setHeaders: {
        'X-Device-ID': deviceId
      }
    });

    return next.handle(cloned);
  }
}
