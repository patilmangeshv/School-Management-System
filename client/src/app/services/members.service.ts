import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';

import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { PaginationResult } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParam';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private _members: Member[] = [];
  private _memberCache = new Map();
  private _userParams: UserParams | undefined;
  private _user: User | undefined;

  constructor(private _http: HttpClient, private _accountService: AccountService) {
    this._accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this._user = user;
          this._userParams = new UserParams(user);
        }
      }
    });
  }

  getUserParams() {
    return this._userParams;
  }

  setUserParams(userParams: UserParams) {
    this._userParams = userParams;
  }

  resetUserParams() {
    if (this._user) {
      this._userParams = new UserParams(this._user);
      return this._userParams;
    }
    return;
  }

  getMembers(userParams: UserParams) {
    const response = this._memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResults<Member[]>(environment.apiUrl + 'users', params).pipe(
      map(response => {
        this._memberCache.set(Object.values(userParams).join('-'), response);

        return response;
      })
    );

    // if (this._members.length > 0) return of(this._members);

    // return this._http.get<Member[]>(environment.apiUrl + 'users').pipe(
    //   map(members => {
    //     this._members = members;
    //     return members;
    //   })
    // );
  }

  getMember(username: string) {
    const member = [...this._memberCache.values()]
      .reduce((arr, ele) => arr.concat(ele.result), [])
      .find((member: Member) => member.userName === username);

    if (member) return of(member);

    return this._http.get<Member>(environment.apiUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this._http.put(environment.apiUrl + 'users/', member).pipe(
      map(() => {
        const index = this._members.indexOf(member);
        this._members[index] = { ...this._members[index], ...member }
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this._http.put(environment.apiUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this._http.delete(environment.apiUrl + 'users/delete-photo/' + photoId);
  }

  private getPaginatedResults<T>(url: string, params: HttpParams) {
    var paginatedResult = new PaginationResult<T>();

    return this._http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }
}
