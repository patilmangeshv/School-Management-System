import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Event } from '../models/event';
import { PhotoEvent } from '../models/photo-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private _eventSource = new ReplaySubject<Event | null>(1);
  event$ = this._eventSource.asObservable();

  constructor(private _http: HttpClient) { }

  getEvents() {
    return this._http.get<Event[]>(environment.apiUrl + 'event/events');
  }

  retrieveMainEvent() {
    this._http.get<Event>(environment.apiUrl + 'event/main-event').subscribe({
      next: event => {
        this._eventSource.next(event);
      }
    });
  }

  editPhotoEvent(photoEvent: PhotoEvent) {
    return this._http.put<Event>(environment.apiUrl + 'event/edit-photo-event', photoEvent);
  }

  deletePhotoEvent(photoEvent: PhotoEvent) {
    return this._http.delete<Event>(environment.apiUrl + 'event/delete-photo-event', { body: photoEvent });
  }

  getSchoolAmenitiesData() {
    return this._http.get<Event[]>('/assets/school-amenities-data.json');
  }
}
