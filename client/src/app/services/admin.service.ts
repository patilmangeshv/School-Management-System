import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _availableRoles: any[] = [];

  constructor(private _http: HttpClient) { }

  getUsersRoles() {
    this._availableRoles = [];
    if (this._availableRoles.length && this._availableRoles.length > 0) {
      return this._availableRoles;
    } else {
      this._http.get<[]>(environment.apiUrl + 'admin/users-roles').subscribe({
        next: roles => {
          this._availableRoles = [];
          roles.forEach(role => {
            var r: any = role;
            this._availableRoles.push(r.rolename);
          });
        }
      });
      return this._availableRoles;
    }
  }

  getUsersWithRoles() {
    return this._http.get<User[]>(environment.apiUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this._http.post<string[]>(environment.apiUrl + 'admin/edit-roles/'
      + username + '?roles=' + roles, {});
  }

  resetUserPassword(username: string) {
    return this._http.post(environment.apiUrl + 'admin/reset-password?username=' + username, {});
  }

  deleteUser(username: string) {
    return this._http.delete<boolean>(environment.apiUrl + 'admin/delete-user?username=' + username);
  }
}
