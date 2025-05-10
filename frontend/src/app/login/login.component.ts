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

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);
        alert('Login successful!');

         // 🔁 Now fetch user profile
        this.auth.getProfile().subscribe({
          next: (user: any) => {
            const role = user.role;
            if (role === 'professor') {
              this.router.navigate(['/dashboard']);
            } else if (role === 'student') {
              this.router.navigate(['/student-dashboard']);
            } else {
              alert('Unknown role');
            }
          },
          error: () => {
            alert('Failed to load profile');
          }
        });

        // if (res.role === 'professor') {
        //   this.router.navigate(['/dashboard']);
        // } else if (res.role === 'student') {
        //   this.router.navigate(['/student-home']); // Optional: add student route later
        // } else {
        //   alert('Unknown role');
        // }
      },
      error: () => {
        alert('Invalid credentials');
      }
    });
  }
}
