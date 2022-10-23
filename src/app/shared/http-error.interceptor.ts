import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(0),
        catchError((err: HttpErrorResponse) => {
          console.log('HttpErrorInterceptor:');
          console.log(err);
          if (err != null) {
            switch (err.status) {
              case 403:
                // window.sessionStorage.setItem('logon', 'N');
                // window.location.reload();
                break;
              default:

            }
          }
          return throwError(err);
        }
        )
      );
  }
}
