import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfessorProfileComponent } from './app/professor-profile/professor-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      { path: 'view-applicants', component: ViewApplicantsComponent }

      // You can add other children routes like 'view-applicants' here
    ],
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'professor-profile',
    component: ProfessorProfileComponent
  }
];
