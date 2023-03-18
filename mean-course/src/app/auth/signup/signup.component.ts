import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  isLoading: boolean = false;
  private authStatusSub: Subscription

  constructor(private authService: AuthService) { }

  onSignup(form: NgForm){
    if(form.invalid) return
    this.isLoading = true;
    this.authService.createUser(form.value.email,form.value.password)
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
