import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyHttpService {
  private _busyRequestCount = 0;
  constructor(private _spinnerService: NgxSpinnerService) { }

  busy() {
    this._busyRequestCount++;

    this._spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(105,105,105,0)',
      fullScreen:true,
      color: '#333333'
    });
  }

  idle() {
    this._busyRequestCount--;

    if (this._busyRequestCount <= 0) {
      this._busyRequestCount = 0;
      this._spinnerService.hide();
    }
  }
}
