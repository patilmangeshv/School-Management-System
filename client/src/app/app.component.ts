import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { take } from 'rxjs';

import { User } from './models/user';
import { Event } from './models/event';
import { AccountService } from './services/account.service';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  copyrightYear: string = "";
  currentRoute: string = "";
  routeName: string = "";
  routeDescription: string = "";
  marqueeAddmissionText: string = ""
  schoolAmenitiesEventData: Event[] = [];

  constructor(public accountService: AccountService, private _router: Router, public eventService: EventService) {
    this._router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url.replace('/', '');
          switch (this.currentRoute) {
            case "admissions":
              this.routeName = "Admissions";
              this.routeDescription = "Online application process from Nursery to 10th Std. for the Academic Year 2023 - 2024.";
              break;
            case "teachers":
              this.routeName = "Teachers";
              this.routeDescription = "About the Teachers of the KBL English High School.";
              break;
            case "at-a-glance":
              this.routeName = "At a glance";
              this.routeDescription = "About the school.";
              break;
            case "school-amenities":
              this.routeName = "School amenities";
              this.routeDescription = "About the school's amenities.";
              break;
            case "contact":
              this.routeName = "Contact";
              this.routeDescription = "Contact school for any queries.";
              break;
            case "courses":
              this.routeName = "Courses";
              this.routeDescription = "Available courses in the school.";
              break;
            case "login":
              this.routeName = "Login";
              this.routeDescription = "Login to school management system.";
              break;
            case "change-password":
              this.routeName = "Change password";
              this.routeDescription = "Change current password.";
              break;
            case "register":
              this.routeName = "Register";
              this.routeDescription = "Register for school management system.";
              break;
            case "admin":
              this.routeName = "Admin";
              this.routeDescription = "Manage users. Manage photos to show on the website.";
              break;
            case "user-management":
              this.routeName = "User management";
              this.routeDescription = "Manage users for school management system.";
              break;
            case "photo-management":
              this.routeName = "Photo management";
              this.routeDescription = "Manage photos to show on the website.";
              break;
            default:
              this.routeName = "Home";
              this.currentRoute = "";
              this.routeDescription = "Home page.";
              break;
          }
        }
      });

    this.eventService.retrieveMainEvent();
  }

  ngOnInit() {
    this.copyrightYear = new Date().getFullYear().toString();
    this.marqueeAddmissionText = `Online school admission will start from 01st May ${this.copyrightYear} to 31st May ${this.copyrightYear}.`;
    this.setCurrentUser();
    this.eventService.getSchoolAmenitiesData().pipe(take(1)).subscribe({
      next: eventData => {
        eventData.forEach(event => {
          event.photos.forEach(photo => {
            photo.description = photo.description.replace('<p>', '').substring(0, 100).concat('...');
          });
        });
        this.schoolAmenitiesEventData = eventData;
      }
    });
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  logout() {
    this.accountService.logout();
    this._router.navigateByUrl('/');
  }
}
