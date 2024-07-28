import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-event-photos-dialog',
  templateUrl: './add-event-photos-dialog.component.html',
  styleUrls: ['./add-event-photos-dialog.component.css']
})
export class AddEventPhotosDialogComponent implements OnInit {
  event: Event | undefined;
  eventResponse: Event | null = null;

  uploader: FileUploader | undefined;
  hasBaseDropZoneOver: boolean = false;
  user: User | undefined;

  constructor(public bsModalRef: BsModalRef, private _accountService: AccountService, private _toaster: ToastrService) {
    this._accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
  }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase() {
    this.hasBaseDropZoneOver = true;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: environment.apiUrl + 'event/add-photo-event?eventid=' + this.event?.id,
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.eventResponse = null;
      if (response) {
        const event = JSON.parse(response);
        this.eventResponse = event;
        // this.member?.photos.push(photo);
        // if (photo.isMain && this.user && this.member) {
        //   this.user.photoUrl = photo.url;
        //   this.member.photoUrl = photo.url;
        //   this._accountService.setCurrentUser(this.user);
        // }
      }
    }

    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
      this.eventResponse = null;
      if (response) {
        this._toaster.error("Photo cannot be added!");
      }
    }
  }

  closeDialog() {
    this.bsModalRef.hide();
  }
}
