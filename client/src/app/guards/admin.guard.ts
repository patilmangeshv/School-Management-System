import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _accountService: AccountService, private _toastr: ToastrService) { }

  canActivate(): Observable<boolean> {
    return this._accountService.currentUser$.pipe(
      map(user => {
        if (!user) {
          this._toastr.error('You cannot enter to this area!');
          return false;
        }

        if (user.roles.includes("Admin")) {
          return true;
        } else {
          this._toastr.error('You cannot enter to this area!');
          return false;
        }
      })
    );
  }
}
