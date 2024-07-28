import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-school-amenities',
  templateUrl: './school-amenities.component.html',
  styleUrls: ['./school-amenities.component.css']
})
export class SchoolAmenitiesComponent implements OnInit {
  schoolAmenitiesEventData: Event[] = [];

  constructor(private _eventService: EventService) { }

  ngOnInit() {
    this._eventService.getSchoolAmenitiesData().pipe(take(1)).subscribe({
      next: eventData => {
        this.schoolAmenitiesEventData = eventData;
      }
    });
  }
}
