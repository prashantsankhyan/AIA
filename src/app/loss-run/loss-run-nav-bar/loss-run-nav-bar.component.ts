import { Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEditLossRunComponent } from '../add-edit-loss-run/add-edit-loss-run.component';


@Component({
  selector: 'app-loss-run-nav-bar',
  standalone: true,
  imports: [MaterialModule,RouterModule,RouterOutlet],
  templateUrl: './loss-run-nav-bar.component.html',
  styleUrl: './loss-run-nav-bar.component.scss'
})
export class LossRunNavBarComponent {
  accountId:any;
  TransactionID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  userName:any

  constructor(public dialog: MatDialog,private router: Router,){
 
  }

  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');
 
  
  }

  addLossRun(data:any) {
    this.TransactionID = 0
    const dialogRef = this.dialog.open(AddEditLossRunComponent, {
      width: '800px',
      height: '630px',
      data: {accountId:this.accountId},
    });
  
  }

  backToDashboard(){
    // sessionStorage.setItem('navigated', 'true');
    this.router.navigate(['/dashboard']);

  }

  // getListOfMoveClaim(){
  //   const dialogRef = this.dialog.open(ListOfMoveClaimComponent, {
  //     width: '1400px',
  //     height: '650px',  
  //   });

  // }
}
