import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
export interface AuthRequestData {
  Kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  // user = new Subject<User>();
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }
  signup(email: string, password: string) {
    return this.http.post<AuthRequestData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDcT98cX87ZnnWfvqUF45lXCSXE_CE1rSs',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handelError),
      tap(respData => {
        this.handelAuthentication(
          respData.email,
          respData.localId,
          respData.idToken,
          +respData.expiresIn
        );
      }
      )
    );
  }
  login(email: string, password: string) {
    return this.http.post<AuthRequestData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDcT98cX87ZnnWfvqUF45lXCSXE_CE1rSs',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe
      (catchError(this.handelError),
        tap(respData => {
          this.handelAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        }
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('UserData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } =
      // string converting object , using JSON parse
      JSON.parse(localStorage.getItem('UserData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handelAuthentication(email: string, userID: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userID,
      token,
      expirationDate);
    // calling subject
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handelError(errorResponse: HttpErrorResponse) {
    let customError = 'An unknown error occurred';
    if (!errorResponse.error || !errorResponse.error) {
      return throwError(customError);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        customError = ' This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        customError = ' The email does not exist';
        break;
      case 'INVALID_PASSWORD':
        customError = ' Password is incorrect';
        break;
    }
    return throwError(customError);
  }
}
