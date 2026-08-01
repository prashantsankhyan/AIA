import { Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutService } from '../../_service/logout.service';

@Component({
  selector: 'app-certs-nav-bar',
  standalone: true,
  imports: [MaterialModule, RouterLink,RouterModule,RouterOutlet],
  templateUrl: './certs-nav-bar.component.html',
  styleUrl: './certs-nav-bar.component.scss'
})
export class CertsNavBarComponent {
ChildPolicyID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  descriptionClient:any;
  City:any;
  State:any;
  ZIP:any;
  ownerName:any;
  userName:any;
  isNameDropdownOpen: boolean = false;
  constructor(public dialog: MatDialog,private logoutService: LogoutService,){
 
  }

  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');

    this.descriptionClient = localStorage.getItem('descriptionClient');
    this.City =localStorage.getItem('City');
    this.State =localStorage.getItem('State');
    this.ZIP =localStorage.getItem('ZIP');
    this.ownerName =localStorage.getItem('ownerName');
  
  }


  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
  logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
    this.logoutService.performLogout(userData)
  }
}
