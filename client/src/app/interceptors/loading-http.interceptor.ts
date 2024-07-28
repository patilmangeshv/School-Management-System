import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { identity, Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

import { BusyHttpService } from '../services/busy-http.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingHttpInterceptor implements HttpInterceptor {

  constructor(private _busyHttpService: BusyHttpService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this._busyHttpService.busy();

    return next.handle(request).pipe(
      (environment.production ? identity: delay(1000)),//implment fake delay for development mode but not in production mode
      finalize(() => {
        this._busyHttpService.idle();
      })
    );
  }
}
