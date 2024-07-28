import { Injectable } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map, Observable, of } from 'rxjs';
import { AddEventPhotosDialogComponent } from '../modals/add-event-photos-dialog/add-event-photos-dialog.component';

import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class AddEventPhotosService {
  bsModalRef?: BsModalRef<AddEventPhotosDialogComponent>;

  constructor(private _modalService: BsModalService) { }

  addEventPhotos(event: Event | null): Observable<Event | null> {
    if (event == null) return of(null);

    const config = {
      initialState: {
        event
      }
    }
    this.bsModalRef = this._modalService.show(AddEventPhotosDialogComponent, config);

    return this.bsModalRef.onHidden!.pipe(
      map(() => {
        return this.bsModalRef!.content!.eventResponse;
      }));
  }
}
