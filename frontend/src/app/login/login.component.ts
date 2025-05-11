import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, // ✅ Required in standalone apps
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']


})
export class LoginComponent {
  email = '';
  password = '';
  passwordVisible = false;

  showSuccessPopup = false;
  successMessage = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate(['/dashboard']);
  }
}


  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);
        
        this.successMessage = 'Login successful!';
        this.showSuccessPopup = true;

         // 🔁 Now fetch user profile
       setTimeout(() => {
          this.auth.getProfile().subscribe({
            next: (user: any) => {
              const role = user.role;
              if (role === 'professor') {
                this.router.navigate(['/dashboard']);
              } else if (role === 'student') {
                this.router.navigate(['/student-dashboard']);
              } else {
                this.errorMessage = 'Unknown role';
              }
            },
            error: () => {
              this.errorMessage = 'Failed to load profile';
            }
          });
        }, 2000); // Wait before redirect
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
        this.showSuccessPopup = true;
      }
    });
  }
}