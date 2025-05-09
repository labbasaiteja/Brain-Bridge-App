import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent{
  
  student = {
    name: 'Mike Ross',
    email: 'mikeross@university.edu',
    major: 'Computer Science',
    imageUrl: 'https://via.placeholder.com/120'
  };

  constructor(private router: Router) {}
  
  isSidebarOpen = true;
  isEditMode = false;


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  toggleEdit() {
    this.isEditMode =false;
  }

  submitChanges() {
    this.isEditMode = false;
    // Save logic here if needed
  }
}
