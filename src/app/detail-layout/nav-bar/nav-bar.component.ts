import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet ,} from '@angular/router';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ListOfEndrosementComponent } from '../../policy/list-of-endrosement/list-of-endrosement.component';
import { AddOrEditEndrosementComponent } from '../../endorsement/endrosement-details/add-or-edit-endrosement/add-or-edit-endrosement.component';
import { MaterialModule } from '../../sharingModule/material/material.module';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,MaterialModule ,MatSidenavModule,MatButtonModule,MatMenuModule ,MatButtonModule,RouterLink,RouterOutlet,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  showFiller = true;

  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  teamName:any;
  EndorsementID:any;
  marketedName:any;
  showBackToPoicy = false;
  showBacckToMarketed = false
  showLogoBaseOnEndorsementID = false;
  showRenew = false
  MarkedPolicyId:any;
  ChildPolicyID:any;
  isDropdownOpen: boolean = false;
  isNameDropdownOpen: boolean = false;

  userName:any;
  retrievedLocation:any ={};
  constructor(private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,) { }
  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.accountName = localStorage.getItem('accountName');
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')

    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    
   
    this.lookUpCode = localStorage.getItem('lookUpCode');
    this.emailID =localStorage.getItem('emailID');
    this.phoneNumber =localStorage.getItem('phoneNumber');
    this.teamName =localStorage.getItem('teamName');
   
    this.retrievedLocation = JSON.parse(localStorage.getItem('locationData') || '{}');
  
    
    if(this.teamName === "Binding Team"){
      this.showBackToPoicy = true;
      this.showBacckToMarketed = false;
      this.showLogoBaseOnEndorsementID = false;
      this.showRenew = false

    } else if (this.teamName === "Endorsement Team"){
      this.showLogoBaseOnEndorsementID = true;
      this.showBackToPoicy = false;
      this.showBacckToMarketed = false;
      this.showRenew = false

    }
    else if (this.teamName === "Submission Team"){
      this.showBacckToMarketed = true;
      this.showLogoBaseOnEndorsementID = false;
      this.showBackToPoicy = false;
      this.showRenew = false
     

    } else if (this.teamName === "Renewable Team"){
      this.showBacckToMarketed = true;
      this.showLogoBaseOnEndorsementID = false;
      this.showBackToPoicy = false;
      this.showRenew = true
      
     

    }

    

    this.marketedName = localStorage.getItem('marketedName')
    
    this.EndorsementID = localStorage.getItem('EndorsementID');
   
    // if(this.EndorsementID == '0'){
    //   this.showLogoBaseOnEndorsementID = false
    // }
    // else{
    //   this.showLogoBaseOnEndorsementID = true;



    // }

    
 
  
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
  

  goBackToEndrosement(){
    this.router.navigate(['/endorsement/endrosementDetail'])
    
    // this.dialog.open(AddOrEditEndrosementComponent ,{
    //   width: '1400px',
    //   height: '700px',
    //  data: {MarkedPolicyID:this.MarkedPolicyId,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
    // });
  }

  isActive(route: string): boolean {
   
    return this.router.url === route;
  }


  backToMarketed(){
    this.router.navigate(["/marketed"])
    this.removeLocalStorage()

  }

  backToDashboard(){
    // sessionStorage.setItem('navigated', 'true');
    this.router.navigate(['/dashboard']);

  }
  backToPolicy(){
     this.router.navigate(['/policy']);
  }
  backToRenew(){
    this.router.navigate(['/dashboard']);
  }

  removeLocalStorage(){
    localStorage.removeItem('MarkedPolicyID')
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('IsChildPolicyExist')
  }
}
