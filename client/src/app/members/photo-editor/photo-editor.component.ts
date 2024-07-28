import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { FileUploader } from 'ng2-file-upload';

import { environment } from 'src/environments/environment';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { Photo } from 'src/app/models/photo';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver: boolean = false;
  baseUrl: string = environment.apiUrl;
  user: User | undefined;

  constructor(private _accountService: AccountService, private _memberService: MembersService, private _toaster: ToastrService) {
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

  setMainPhoto(photo: Photo) {
    this._memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this._accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
      }
    });
  }

  deletePhoto(photoId: number) {
    this._memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member?.photos.filter(p => p.id != photoId);
        }
      }
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
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
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this._accountService.setCurrentUser(this.user);
        }
      }
    }

    this.uploader.onErrorItem = (item, response, status, headers) => {
      if (response) {
        this._toaster.error("Photo cannot be added!");
      }
    }
  }
}
