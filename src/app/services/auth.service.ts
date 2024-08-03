import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';
  isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  loginUser(token: string): void {
    localStorage.setItem(this.AUTH_KEY, token);
    this.isLoggedIn.next(true);
  }

  logoutUser(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn.value;
  }
}