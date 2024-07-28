import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class ModeratorGuard implements CanActivate {
  constructor(private _accountService: AccountService, private _toastr: ToastrService) { }

  canActivate(): Observable<boolean> {
    return this._accountService.currentUser$.pipe(
      map(user => {
        if (!user) {
          this._toastr.error('You cannot enter to this area!');
          return false;
        }

        if (user.roles.includes("Admin") || user.roles.includes("Moderator")) {
          return true;
        } else {
          this._toastr.error("You cannot enter to this area!");
          return false;
        }
      })
    );
  }

}
