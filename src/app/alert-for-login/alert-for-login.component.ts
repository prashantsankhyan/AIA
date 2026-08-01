import { Component } from '@angular/core';
import { LogoutService } from '../_service/logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-for-login',
  standalone: true,
  imports: [],
  templateUrl: './alert-for-login.component.html',
  styleUrl: './alert-for-login.component.scss'
})
export class AlertForLoginComponent {
  constructor(private router: Router,private logoutService: LogoutService,){
    
  }
   
  openThatPage(){
    this.router.navigate(['/dashboard/_dashboard'])
  }

  logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
    this.logoutService.performLogout(userData);
  }
}
