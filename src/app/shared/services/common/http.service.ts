import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export abstract class HttpService {
    constructor(
        protected http: HttpClient
    ) { }

    get(url: string): Observable<any> {
        return this.http
            .get<any>(url)
            .pipe(
                tap(response => response)
            );
    }

    post(url: string, body: any, options?: any): Observable<any> {
        return this.http
            .post<any>(url, body, options)
            .pipe(
                tap(response => response),
                catchError(err =>
                    of(err)
                )
            );
    }

    put(url: string, body: any): Observable<any> {
        return this.http
            .put<any>(url, body)
            .pipe(
                tap(response => response)
            );
    }

    delete(url: string, body: any): Observable<any> {
        return this.http
            .request('delete', url, { body: body })
            .pipe(
                tap(response => response)
            );
    }
}
