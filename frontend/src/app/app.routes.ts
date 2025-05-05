import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfessorProfileComponent } from './app/professor-profile/professor-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';

export const routes: Routes = [
  // 🔒 Public (non-layout) routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // 🧭 Main layout routes (with sidebar/header etc.)
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'view-applicants',
        component: ViewApplicantsComponent
      },
      {
        path: 'professor-profile',
        component: ProfessorProfileComponent
      }
    ]
  }
];
