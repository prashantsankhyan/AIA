import { Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTransactionComponent } from '../add-edit-transaction/add-edit-transaction.component';
import { LogoutService } from '../../_service/logout.service';

@Component({
  selector: 'app-transaction-nav-bar',
  standalone: true,
  imports: [MaterialModule,RouterModule,],
  templateUrl: './transaction-nav-bar.component.html',
  styleUrl: './transaction-nav-bar.component.scss'
})
export class TransactionNavBarComponent {
  TransactionID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  ownerName:any;
  userName:any;
  Yard_Address:any;
  No_of_Unit:any;
  No_of_Driver:any;
  PolicyType:any;


  constructor(public dialog: MatDialog,private logoutService: LogoutService,private router:Router){
 
  }

  ngOnInit(){
   
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');
    this.ownerName =localStorage.getItem('ownerName');


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

  addTransactionHere(data:any) {
    this.TransactionID = 0
    const dialogRef = this.dialog.open(AddEditTransactionComponent, {
      width: '1400px',
      height: '800px',
      data: {TransactionID:this.TransactionID},
    });
  
  }

   logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
    this.logoutService.performLogout(userData)
  }

   backToDashboard(){
    // sessionStorage.setItem('navigated', 'true');
    this.router.navigate(['/dashboard']);

  }

 
}
