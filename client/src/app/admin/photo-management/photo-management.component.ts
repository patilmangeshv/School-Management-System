import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { TabDirective } from 'ngx-bootstrap/tabs';

import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
import { take } from 'rxjs/operators';
import { PhotoEvent } from 'src/app/models/photo-event';
import { ConfrimService } from 'src/app/services/confrim.service';
import { AddEventPhotosService } from 'src/app/services/add-event-photos.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  events: Event[] | undefined;
  photoEventForm: FormGroup = new FormGroup({});
  selectedEvent: Event | null = null;
  selectedPhotoEvent: PhotoEvent | null = null;
  activeSlideIndex: number = 0;

  constructor(private _eventService: EventService, private _fb: FormBuilder, private _toastr: ToastrService
    , private _confirmService: ConfrimService, private _addEventPhotosService: AddEventPhotosService) { }

  ngOnInit() {
    this.initializeForm();
    this.getEvents();
  }

  initializeForm() {
    this.photoEventForm = this._fb.group({
      title: [''],
      description: [''],
      isMain: [false],
    });
  }

  getEvents() {
    this._eventService.getEvents().pipe(take(1)).subscribe({
      next: events => {
        this.events = events;
        this.events?.map(e => {
          if (e.id == 1) {
            this.selectedEvent = e;
            this.setFormValues();
          }
        });
      }
    });
  }

  tabSelect(data: TabDirective): void {
    this.selectedEvent = null;
    this.events?.map(e => {
      if (e.eventName == data.heading) {
        this.selectedEvent = e;
        this.activeSlideIndex = 0;
        this.setFormValues();
      }
    });
  }

  slideChanged(tabSelected: number) {
    this.activeSlideIndex = tabSelected;
    this.setFormValues();
  }

  setFormValues() {
    var photoEventFound = this.selectedEvent?.photos.find((value, index) => index == this.activeSlideIndex);
    this.selectedPhotoEvent = photoEventFound ? photoEventFound : null;
    this.resetChanges();
  }

  async saveChanges() {
    // dirty to make sure there are any changes on the firm
    if (this.selectedPhotoEvent && this.photoEventForm.valid && this.photoEventForm.dirty) {
      this.selectedPhotoEvent.title = this.photoEventForm.controls['title'].value;
      this.selectedPhotoEvent.description = this.photoEventForm.controls['description'].value;
      this.selectedPhotoEvent.isMain = this.photoEventForm.controls['isMain'].value;

      this._eventService.editPhotoEvent(this.selectedPhotoEvent).pipe(take(1)).subscribe({
        next: editEvent => {
          this.selectedEvent = editEvent;
          this.resetChanges();
          this._toastr.success('Event details updated successfully!');
        }
      });
    }
  }

  resetChanges() {
    this.photoEventForm.reset();
    if (this.selectedPhotoEvent) {
      this.photoEventForm.controls['title'].patchValue(this.selectedPhotoEvent.title);
      this.photoEventForm.controls['description'].patchValue(this.selectedPhotoEvent.description);
      this.photoEventForm.controls['isMain'].patchValue(this.selectedPhotoEvent.isMain);
    }
  }

  addPhotoEvents() {
    this._addEventPhotosService.addEventPhotos(this.selectedEvent).pipe(take(1)).subscribe({
      next: editEvent => {
        const index = this.events!.indexOf(this.selectedEvent!);
        if (index != -1) {
          // copy edited event's photo to the original event, ... is called spread operator in java script
          this.events![index] = { ...this.events![index], ...editEvent };
        }
      }
    });
  }

  deletePhotoEvent() {
    this._confirmService.confirm("Delete event photo", "Are you sure to delete this photo?").subscribe({
      next: confirm => {
        if (confirm) {
          if (this.selectedPhotoEvent) {
            this._eventService.deletePhotoEvent(this.selectedPhotoEvent).pipe(take(1)).subscribe({
              next: editEvent => {
                this.events?.map(event => {
                  if (event.eventName == editEvent.eventName) {
                    event.photos.map((photoEvent, index) => {
                      if (photoEvent != null && photoEvent.id == this.selectedPhotoEvent?.id) {
                        event.photos.splice(index, 1);
                      }
                    });
                  }
                });
                this.selectedEvent = editEvent;
                this.selectedPhotoEvent = null;
                this._toastr.success("Photo deleted successfully!");
              }
            });
          }
        }
      }
    });
  }
}
