import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(private _accountService: AccountService, private _toastr: ToastrService, private _fb: FormBuilder, private _router: Router) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });

  }

  login() {
    this._accountService.login(this.loginForm.value).subscribe({
        next: () => {
          this._router.navigateByUrl('/');
        }
      });
  }

  logout() {
    this._accountService.logout();
    this._router.navigateByUrl('/');
  }
}
