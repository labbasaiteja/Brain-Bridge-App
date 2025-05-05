import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
    ]
  }
];
