import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { TranslocoService } from "@ngneat/transloco";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private _authService: AuthService,
        private translocoService: TranslocoService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq = req.clone();

        // Không thêm Bearer token cho refresh token request
        if (this._authService.accessToken && !req.url.includes('/oauth/token')) {
            newReq = req.clone({
                headers: req.headers
                    .set('Authorization', 'Bearer ' + this._authService.accessToken)
                    .append('lang', this.translocoService.getActiveLang()),
            });
        }

        return next.handle(newReq).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && 
                    (error.status === 401 || error?.error === 'invalid_token' || error?.error?.error === 'invalid_token') &&
                    this._authService.refreshToken) {
                    return this.handle401Error(newReq, next);
                }

                // Nếu server bảo trì
                if (error instanceof HttpErrorResponse && error.status === 503) {
                    this._authService.signOutMaintenance();
                    return throwError(() => error);
                }

                // Các lỗi 500
                if (error instanceof HttpErrorResponse && error.status >= 500 && error.status < 600) {
                    this._authService.signOutError();
                    return throwError(() => error);
                }

                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = this._authService.refreshToken;
            if (!refreshToken) {
                this._authService.signOut(false).subscribe();
                return throwError(() => new Error('No refresh token'));
            }

            // 🔹 Gọi API refresh token
            return this._authService.refreshAccessToken(refreshToken).pipe(
                switchMap((tokenResponse: any) => {
                    this.isRefreshing = false;

                    if (tokenResponse?.access_token) {
                        this.refreshTokenSubject.next(tokenResponse.access_token);

                        const cloned = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${tokenResponse.access_token}`,
                                lang: this.translocoService.getActiveLang()
                            }
                        });

                        return next.handle(cloned);
                    } else {
                        // Nếu refresh thất bại
                        this._authService.signOut(false).subscribe();
                        return throwError(() => new Error('Failed to refresh token'));
                    }
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this._authService.signOut(false).subscribe();
                    return throwError(() => err);
                })
            );

        } else {
            // Nếu đang refresh -> chờ token mới
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    const cloned = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                            lang: this.translocoService.getActiveLang()
                        }
                    });
                    return next.handle(cloned);
                })
            );
        }
    }
}
