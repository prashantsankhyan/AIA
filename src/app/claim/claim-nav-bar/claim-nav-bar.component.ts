import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditClaimComponent } from '../add-edit-claim/add-edit-claim.component';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ListOfMoveClaimComponent } from '../list-of-move-claim/list-of-move-claim.component';

@Component({
  selector: 'app-claim-nav-bar',
  standalone: true,
  imports: [MaterialModule, RouterLink,RouterModule],
  templateUrl: './claim-nav-bar.component.html',
  styleUrl: './claim-nav-bar.component.scss'
})
export class ClaimNavBarComponent {
  TransactionID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;

  constructor(public dialog: MatDialog,){
 
  }

  ngOnInit(){
   
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');
 
  
  }

  addClaimHere(data:any) {
    this.TransactionID = 0
    const dialogRef = this.dialog.open(AddEditClaimComponent, {
      width: '1400px',
      height: '600px',
      data: {TransactionID:this.TransactionID},
    });
  
  }

  getListOfMoveClaim(){
    const dialogRef = this.dialog.open(ListOfMoveClaimComponent, {
      width: '1400px',
      height: '650px',  
    });

  }
}
