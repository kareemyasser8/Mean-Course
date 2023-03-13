import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading: false;

  constructor() { }

  onLogin(form: NgForm){
    console.log(form.value)
  }

  ngOnInit(): void {
  }

}
