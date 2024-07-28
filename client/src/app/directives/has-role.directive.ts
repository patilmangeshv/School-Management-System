import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Directive({
  selector: '[appHasRole]'// *appHasRole='["Admin',"Thing"]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor(private _viewContainerRef: ViewContainerRef, private _templateRef: TemplateRef<any>, private _accountService: AccountService) {
    this._accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
  }

  ngOnInit() {
    if (this.user.roles.some(role => this.appHasRole.includes(role))) {
      this._viewContainerRef.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainerRef.clear();
    }
  }
}
