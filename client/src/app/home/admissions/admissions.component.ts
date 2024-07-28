import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent implements OnInit {

  showSection = 'page1';

  constructor() { }

  ngOnInit() {
  }

  showOnlineForm() {
    alert("Redirecting to Online form!");
    //https://forms.gle/eH4evj4d8GxKH6PL6
  }
}
