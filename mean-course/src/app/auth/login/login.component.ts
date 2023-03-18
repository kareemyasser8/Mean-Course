import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  isLoading: boolean = false;
  private authStatusSub: Subscription

  constructor(private authService: AuthService) { }


  onLogin(form: NgForm){
    if(form.invalid)return
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe({
      next: (authStatus:boolean) =>{this.isLoading = false}
    })
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
