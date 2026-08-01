import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditMarketdComponent } from '../add-edit-marketd/add-edit-marketd.component';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MarketedComponent } from '../marketed.component';
import { LogoutService } from '../../_service/logout.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MaterialModule,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  MarkedPolicyID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  Yard_Address:any;
  No_of_Unit:any;
  No_of_Driver:any;
  PolicyType:any;
  userName:any;
  isNameDropdownOpen: boolean = false;
  constructor(public dialog: MatDialog,private router: Router,private logoutService: LogoutService,){
 
  }

  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');

    this.Yard_Address = localStorage.getItem('Yard_Address');
    this.No_of_Unit =localStorage.getItem('No_of_Unit');
    this.No_of_Driver =localStorage.getItem('No_of_Driver');
    this.PolicyType =localStorage.getItem('PolicyType');


 
  
  }
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
  openMarketd(data:any) {
    this.MarkedPolicyID= 0
   
    const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      width: '1400px',
      height: '450px',
      data: {MarkedPolicyID:this.MarkedPolicyID},
    });
  }

  openListOfAllFile() {
    const url = `${window.location.origin}/#/marketed/listOfAttachemtAddedBySale`;

    // Open the URL in a new tab
    window.open(url, '_blank');
  
    
  }

  logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
    this.logoutService.performLogout(userData)
  }

  listOfAttachemnt(){
    this.router.navigate(['/marketed/listOfAttachment']);
  }

  backToDashboard(){
    // sessionStorage.setItem('navigated', 'true');
    this.router.navigate(['/dashboard']);

  }
}
