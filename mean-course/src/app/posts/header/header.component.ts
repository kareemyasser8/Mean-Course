import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListnenerSubs: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListnenerSubs = this.authService.getAuthStatusListener()
    .subscribe(
      isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onlogOut(){
    this.authService.logOut()
  }

  ngOnDestroy(): void {
    this.authListnenerSubs.unsubscribe();
  }

}
