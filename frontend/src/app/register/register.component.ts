import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
    
  };
  
  passwordVisible = false;
  confirmPasswordVisible = false;
  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onRegister() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.user.role) {
      alert('Please select a role');
      return;
    }

    this.auth.register(this.user).subscribe({
      next: () => {
        alert('Successfully registered!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.msg || 'Registration failed');
      }
    });
  }
}
