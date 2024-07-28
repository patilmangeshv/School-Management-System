import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { ConfrimService } from 'src/app/services/confrim.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  // availableRoles: string[] = [];
  availableRoles = [
    'Admin',
    'Moderator',
    'Accountant',
    'Teacher',
    'Parent',
    'Student',
  ]

  constructor(private _adminService: AdminService, private _modalService: BsModalService
    , private _toastr: ToastrService, private _confirmService: ConfrimService) { }

  ngOnInit() {
    this.getUsersWithRoles();
    // this.getUsersRoles();
  }

  getUsersWithRoles() {
    this._adminService.getUsersWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    });
  }

  getUsersRoles() {
    this.availableRoles = this._adminService.getUsersRoles();
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this._modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this._adminService.updateUserRoles(user.username, selectedRoles!).pipe(take(1)).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  deleteUser(user: User) {
    this._confirmService.confirm("Delete user", `Are you sure to delete user '${user.username}'?`).pipe(take(1)).subscribe({
      next: confirm => {
        if (confirm) {
          this._adminService.deleteUser(user.username).pipe(take(1)).subscribe({
            next: response => {
              if (response) {
                var foundIndex = this.users.indexOf(user);
                if (foundIndex != -1) this.users.splice(foundIndex, 1);
                this._toastr.success("User deleted successfully!")
              }
            }
          });
        }
      }
    });
  }

  resetUserPassword(user: User) {
    this._adminService.resetUserPassword(user.username).pipe(take(1)).subscribe({
      next: response => {
        var password: any = response;
        user.resetPassword = password.resetPassword;

        this._toastr.success("Password reset successfully!")
      }
    });
  }

  copyPassword(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);

    this._toastr.success("Password copied!")
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
