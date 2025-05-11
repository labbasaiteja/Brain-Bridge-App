import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  ,Router} from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  isSidebarExpanded = false;
    professorName = '';
  showLogoutModal = false;
  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>('https://brain-bridge-app-erc6.onrender.com/api/user/', { headers }).subscribe({
        next: (res) => {
          this.professorName = res.name;  // assuming the response is { name: 'Mike Ross', ... }
        },
        error: (err) => {
          console.error('Failed to fetch user info:', err);
        }
      });
    }
  }
  openSidebar() {
    this.isSidebarExpanded = true;
    
  }
logout() {
  localStorage.removeItem('token');
  this.router.navigateByUrl('/login').then(() => {
    // Clear history so browser forward/back doesn’t restore dashboard
    window.location.replace('/login');
  });
}
  closeSidebar() {
    this.isSidebarExpanded = false;
  }

  onProfile() {
    console.log("Profile clicked");
  }

  onManageJobPostings() {
    console.log("Manage Job Postings clicked");
  }

  onViewApplicants() {
    console.log("View Applicants clicked");
  }


onLogout() {
  this.showLogoutModal = true;
}

confirmLogout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
  this.showLogoutModal = false;
}

cancelLogout() {
  this.showLogoutModal = false;
}
    
  }

