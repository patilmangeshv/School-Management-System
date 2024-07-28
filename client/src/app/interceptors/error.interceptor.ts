import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isArray } from 'ngx-bootstrap/chronos';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private _toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              } else if (isArray(error.error)) {
                const modelStateErrors = [];
                var errorString = '';
                for (const e in error.error) {
                  if (error.error[e]) {
                    modelStateErrors.push(<any>error.error[e]);
                  }
                }
                modelStateErrors.forEach(element => {
                  errorString += element.code + ' - ' + element.description + '\n';
                });
                this._toastr.error(errorString);
              } else {
                this._toastr.error(error.error, error.status.toString());
              }
              break;
            case 401:
              this._toastr.error('Unauthorised - ' + error.error, error.status.toString());
              break;
            case 404:
              this._router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: error.error } };
              this._router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this._toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        throw error;
      })
    );
  }
}
