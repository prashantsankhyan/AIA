import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAccountComponent } from '../add-edit-account/add-edit-account.component';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from '../search-filter.pipe';
import { FormsModule } from '@angular/forms';
import { AddEditMarketdComponent } from '../../../marketed/add-edit-marketd/add-edit-marketd.component';
import { AddNoteComponent } from '../../add-note/add-note.component';
import { UpdateAccoutTypeComponent } from '../update-accout-type/update-accout-type.component';
import { DeleteAccountTypeComponent } from '../delete-account-type/delete-account-type.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatMenuModule,FormsModule ,MaterialModule ,HttpClientModule ,SpinnerComponent,SearchFilterPipe],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent {
showSpiner = true
listOfAllAcount:any =[];
AccountId =0;
accountId ='';
accountName ='';
searchTerm: string = '';
lookUpCode ='';
emailID ='';
phoneNumber ='';
isNameDropdownOpen: boolean = false;
userName:any;
searchCriteria = {
  name: '',
  lookUpCode: '',
  city: '',
  state: '',
  zip: '',
  accountType:'',
  claimNumber:'',
  };
 constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
  this.http.listen().subscribe((m:any)=>{
    console.log(m)
    this.getAllAccountList()
  })
 }

  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
   
    if(this.userName == null){
      this.router.navigate(['/login'])
     
  }
    this.getAllAccountList();
    this.clearLocalStorageValue()
  
  }
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }
   updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  onNameChange(newName: string) {
    this.updateSearchCriteria({ name: newName });
  }

  onLookUpCodeChange(newLookUpCode: string) {
    this.updateSearchCriteria({ lookUpCode: newLookUpCode });
  }

  onCityChange(newCity: string) {
    this.updateSearchCriteria({ city: newCity });
  }

  onStateChange(newState: string) {
    this.updateSearchCriteria({ state: newState });
  }

  onZipChange(newZip: string) {
    this.updateSearchCriteria({ zip: newZip });
  }

  onAccountTypeChange(newAccountType: string) {
    this.updateSearchCriteria({ accountType: newAccountType });
  }
  onClaimNumberChange(newClaimNumber: string) {
    this.updateSearchCriteria({ claimNumber: newClaimNumber });
  }


  getAllAccountList(){
    this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfAllAcount = obj.Accounts
       
       
        
      }
    )
  }

  
  addAccount() {
    this.AccountId =0
   
   
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
     
      data: {AccountId:this.AccountId},
      
    });
  
    
  }

  addEditAccount(data:any) {
    this.AccountId = data.AccountID
    
   
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
     
      data: {AccountId:this.AccountId},
      
    });
  
    
  }
  updateAccountType(data:any) {
    this.AccountId = data.AccountID
    const dialogRef = this.dialog.open(UpdateAccoutTypeComponent, {
      width: '350px',
      height: '120px',
      data: {AccountId:this.AccountId},
      
    });
  
    
  }

  deleteAccountType(data:any) {
    this.AccountId = data.AccountID
    const dialogRef = this.dialog.open(DeleteAccountTypeComponent, {
      width: '350px',
      height: '250px',
      data: {AccountId:this.AccountId},
      
    });

  }
  addNoteForYourSelf(data:any) {
    this.AccountId = data.AccountID
   
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: '620px',
      height: '530px',
      data: {AccountId:this.AccountId,nameOfAccount:data.AccountName},
      
    });
  }

  openMarketd(data:any) {
    this.accountId = data.AccountID
    this.accountName = data.AccountName
    this.lookUpCode = data.LookUpCode;
    this.emailID = data.EmailID;
    this.phoneNumber = data.PhoneNumber
    let MarkedPolicyID = '0'
    localStorage.setItem("accountId" ,this.accountId)
    localStorage.setItem("accountName" ,this.accountName)
    localStorage.setItem("lookUpCode" ,this.lookUpCode)
    localStorage.setItem("emailID" ,this.emailID)
    localStorage.setItem("phoneNumber" ,this.phoneNumber)
   
    const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      width: '1400px',
      height: '400px',
      data: {MarkedPolicyID:MarkedPolicyID},
    });
    this.router.navigateByUrl('/marketed',);

  }

   goToAttachmentFile(data:any){
    this.accountId = data.AccountID
    this.accountName = data.AccountName
    // alert(this.accountName)
    this.lookUpCode = data.LookUpCode;
    this.emailID = data.EmailID;
    this.phoneNumber = data.PhoneNumber
   
    localStorage.setItem("accountId" ,this.accountId)
    localStorage.setItem("accountName" ,this.accountName)
    localStorage.setItem("lookUpCode" ,this.lookUpCode)
    localStorage.setItem("emailID" ,this.emailID)
    localStorage.setItem("phoneNumber" ,this.phoneNumber)
    this.router.navigateByUrl('/mainLayout/attachment',);

   }



  clearLocalStorageValue(){
    localStorage.removeItem('accountId')
    localStorage.removeItem('accountName')
    localStorage.removeItem('MarkedPolicyID')
    localStorage.removeItem('IsChildPolicyExist')
    localStorage.removeItem('ChildPolicyID')
  
      localStorage.removeItem('lookUpCode')
      localStorage.removeItem('emailID')
      localStorage.removeItem('phoneNumber')
   
  }
  editId:any
  moveToMarkedValue(data:any) {
    this.editId = data.AccountName;
    // alert(this.editId)
  }

}
