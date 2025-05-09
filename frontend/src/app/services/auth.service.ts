import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth'; // adjust if your backend is hosted elsewhere

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }
  getProfile() {
  return this.http.get('http://localhost:5000/api/user/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
}
