import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  passwordVisible = false;

  showSuccessPopup = false;
  successMessage = '';
  errorMessage = '';

  isBrowser: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const token = res.token;
        if (this.isBrowser) {
          localStorage.setItem('token', token);
        }

        this.successMessage = 'Login successful!';
        this.showSuccessPopup = true;

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
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
        this.showSuccessPopup = true;
      }
    });
  }
}
