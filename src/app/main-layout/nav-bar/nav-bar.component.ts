import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AddEditAccountComponent } from '../acoount-details/add-edit-account/add-edit-account.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { AddMessageToTeamComponent } from '../add-message-to-team/add-message-to-team.component';
import { AddNoteComponent } from '../add-note/add-note.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,MaterialModule, MatMenuModule ,RouterOutlet],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  AccountId:any;
  accountId:any;
  userName:any;
  ChildPolicyID:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  isDropdownOpen: boolean = false;
  isNameDropdownOpen: boolean = false;
  constructor(public dialog: MatDialog,private router: Router){
 
  }

  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.accountId =localStorage.getItem('accountId');
   
    this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');
 
  
  }
  backToMarketed(){
    this.router.navigate(["/dashboard"])
    

  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
  openDialog(data:any) {
    this.AccountId = 0
   
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
      width: '1400px',
      height: '700px',
      data: {AccountId:this.AccountId},
      
    });
  }



  addMessageToTeam(data:any) {
    this.AccountId = 0
   
    const dialogRef = this.dialog.open(AddMessageToTeamComponent, {
      width: '400px',
      height: '250px',
      data: {AccountId:this.AccountId},
      
    });
  }





}
