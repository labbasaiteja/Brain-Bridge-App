import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api'; // adjust if your backend is hosted elsewhere

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }
  getProfile() {
  return this.http.get('http://localhost:5000/api/user/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
  createPosting(posting: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/assistantships/`, posting,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  }

  getProfessorPostings(page: number = 1, limit: number = 5): Observable<any> {
  return this.http.get(`${this.baseUrl}/assistantships/all_professor?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
     }
   });
 } 

  updatePosting(postingId: string, posting: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/assistantships/${postingId}`, posting,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  }
  deletePosting(postingId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/assistantships/${postingId}`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  }
   getApplicants(postingId: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/assistantships/${postingId}/professor`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
 }
}
