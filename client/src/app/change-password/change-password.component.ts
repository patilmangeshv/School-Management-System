import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(private _accountService: AccountService, private _toastr: ToastrService, private _fb: FormBuilder, private _router: Router) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.changePasswordForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required, this.matchValues('newPassword')]]
    });

    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe({
      next: () => this.changePasswordForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
    }
  }

  changePassword() {
    this.validationErrors = [];

    this._accountService.changePassword(this.changePasswordForm.value).subscribe({
      next: response => {
        if (response) {
          this._toastr.success("Password changed successfully!");
          this.changePasswordForm.reset();
        }
      },
      error: error => {
        if (error) {
          if (error.error) {
            this.validationErrors = [];
            for (const e in error.error) {
              if (error.error[e]) {
                var errorMessage = <any>error.error[e].description;
                this.validationErrors.push(errorMessage);
              }
            }
          } else {
            console.log(error);
          }
        }
      }
    });
  }
}
