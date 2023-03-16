import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router){

  }

  getToken(){
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;

  }

  createUser(email:string,password: string){
      const authData: AuthData = {email: email, password: password}
      this.http.post("http://localhost:3000/api/user/signup",authData)
        .subscribe(response=>{
            console.log("The response is: ", response)
        })
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password}
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login",authData)
    .subscribe((response)=>{
      const token = response.token
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.tokenTimer = setTimeout(()=>{
          this.logOut();
        },expiresInDuration * 1000)
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    })
  }

  logOut(){
    this.token = null
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer)
    this.router.navigate(['/']);
  }


}
