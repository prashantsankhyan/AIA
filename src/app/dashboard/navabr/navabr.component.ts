import { CommonModule } from '@angular/common';
import { Component,Directive,  HostListener,ElementRef, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AddEditAccountComponent } from '../../main-layout/acoount-details/add-edit-account/add-edit-account.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LogoutService } from '../../_service/logout.service';

@Component({
  selector: 'app-navabr',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,MatMenuModule,MatIconModule ,MatButtonModule ,RouterOutlet,RouterLink,RouterModule],
  templateUrl: './navabr.component.html',
  styleUrl: './navabr.component.scss'
})
export class NavabrComponent {
  AccountId:any;
  userName:any;
  showFiller = true;
  nameOfTeam:any
  showSaleTeam = false;
  showClaimTeam = false;
  showSubmissionTeam =false;
  showTransactionTeam = false;
  isDropdownOpen: boolean = false;
  isNameDropdownOpen: boolean = false;
  constructor(private router: Router,private logoutService: LogoutService,private el: ElementRef, private renderer: Renderer2,public dialog: MatDialog,) {
    
   }

 
  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.getNameOfTeam()
  }
 
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
 
 

  getNameOfTeam(){
  this.nameOfTeam =  localStorage.getItem('teamName')
  
  if(this.nameOfTeam == 'Sale Team') {
    this.showSaleTeam = true

  }else if (this.nameOfTeam == 'Submission Team') {
    this.showSubmissionTeam = true

  }else if (this.nameOfTeam == 'Claim Team') {
    this.showClaimTeam = true;


  }else if (this.nameOfTeam == 'Transaction Team') {
   
    this.showTransactionTeam = true;

  }
 
  }
  logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
    this.logoutService.performLogout(userData)
    
  }

  // logout(){
  //   this.router.navigate(['/login'])

  // }


  addAccountDetail(data:any) {
    
    this.AccountId = 0
   
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
    
      data: {AccountId:this.AccountId},
      
    });
    this.router.navigate(['/mainLayout/account'])
  }
  
}
