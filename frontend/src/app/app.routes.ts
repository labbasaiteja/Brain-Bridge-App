import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfessorProfileComponent } from './professor-profile/professor-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';
import { ManageJobPostingsComponent } from './manage-job-postings/manage-job-postings.component';

export const routes: Routes = [
  // 🔒 Public (non-layout) routes
  {
    path: '',
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
        path: 'manage-job-postings',
        component: ManageJobPostingsComponent
      },
      {
        path: 'professor-profile',
        component: ProfessorProfileComponent
      }
    ]
  }
];
