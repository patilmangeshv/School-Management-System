import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { HomeComponent } from './home/home.component';
import { AdmissionsComponent } from './home/admissions/admissions.component';
import { ContactComponent } from './home/contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
// import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ModeratorGuard } from './guards/moderator.guard';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TeachersComponent } from './home/teachers/teachers.component';
import { AtAGlanceComponent } from './home/at-a-glance/at-a-glance.component';
import { SchoolAmenitiesComponent } from './home/school-amenities/school-amenities.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'at-a-glance', component: AtAGlanceComponent },
  { path: 'school-amenities', component:SchoolAmenitiesComponent},
  { path: 'admissions', component: AdmissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'courses', component: CoursesComponent },
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      // { path: 'members', component: MemberListComponent },
      // { path: 'members/:username', component: MemberDetailComponent },
      // { path: 'members/:username/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      // { path: 'lists', component: ListsComponent },
      // { path: 'messages', component: MessagesComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AdminGuard] },
      { path: 'photo-management', component: PhotoManagementComponent, canActivate: [ModeratorGuard] },
    ]
  },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
