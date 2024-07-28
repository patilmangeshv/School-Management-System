import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  baseUrl = 'https://localhost:5001/api/';
  validationErrors: string[]=[];

  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  get404Error() {
    this._http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
  get400Error() {
    this._http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
  get500Error() {
    this._http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
  get401Error() {
    this._http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
  get400ValidationError() {
    this._http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: response => console.log(response),
      error: errors => {
        this.validationErrors = errors;
        console.log(errors);}
    });
  }

}
