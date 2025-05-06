import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-job-postings.component.html',
  styleUrls: ['./manage-job-postings.component.css']
})
export class ManageJobPostingsComponent {
  constructor(private router: Router) {}
  
  job = {
    title: '',
    description: '',
    domain: '',
    deadline: ''
  };

  submitJob() {
    console.log('Submitted:', this.job);
    alert('Job submitted!');
  }

  // editJob() {
  //   alert('Edit functionality coming soon!');
  // }

  deleteJob() {
    //alert('Job deleted!');
    this.router.navigate(['/dashboard']);
  }
}