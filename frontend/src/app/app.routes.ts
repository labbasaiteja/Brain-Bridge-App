import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfessorProfileComponent } from './professor-profile/professor-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';
import { ManageJobPostingsComponent } from './manage-job-postings/manage-job-postings.component';
import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  
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

 
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
  },
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'student-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'student-dashboard',
        component: StudentDashboardComponent
      },
      {
        path: 'jobs',
        component: JobsComponent
      },
      {
        path: 'student-profile',
        component: StudentProfileComponent
      }
    ]
  }
];
