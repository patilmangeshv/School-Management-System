import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './modules/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './home/contact/contact.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { LoadingHttpInterceptor } from './interceptors/loading-http.interceptor';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TextInputComponent } from './forms/text-input/text-input.component';
import { DatePickerComponent } from './forms/date-picker/date-picker.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';

import { AdmissionsComponent } from './home/admissions/admissions.component';
import { CoursesComponent } from './courses/courses.component';
import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { AddEventPhotosDialogComponent } from './modals/add-event-photos-dialog/add-event-photos-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TeachersComponent } from './home/teachers/teachers.component';
import { AtAGlanceComponent } from './home/at-a-glance/at-a-glance.component';
import { SchoolAmenitiesComponent } from './home/school-amenities/school-amenities.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ContactComponent,
    AdmissionsComponent,
    CoursesComponent,
    HomeComponent,
    RegisterComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DatePickerComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent,
    AddEventPhotosDialogComponent,
    ChangePasswordComponent,
    TeachersComponent,
    AtAGlanceComponent,
    SchoolAmenitiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
