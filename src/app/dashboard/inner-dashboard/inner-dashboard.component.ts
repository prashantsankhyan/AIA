import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../sharingModule/material/material.module';
import { AddEditMarketdComponent } from '../../marketed/add-edit-marketd/add-edit-marketd.component';
import { DeleteSaleTeamNoteComponent } from '../delete-sale-team-note/delete-sale-team-note.component';
import { DeleteSaleProspectiveAccountComponent } from '../delete-sale-prospective-account/delete-sale-prospective-account.component';
import { DeleteSaleClientAccountComponent } from '../delete-sale-client-account/delete-sale-client-account.component';
import { AddEditTransactionComponent } from '../../transaction/add-edit-transaction/add-edit-transaction.component';
import { AddEditClaimComponent } from '../../claim/add-edit-claim/add-edit-claim.component';
import { SearchFilterPipe } from '../search-filter.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AppRegistraionComponent } from '../../app-registraion/app-registraion.component';
import { RenewListComponent } from '../../renew-list/renew-list.component';
import { AccountTeamComponent } from '../../account-team/account-team.component';

@Component({
  selector: 'app-inner-dashboard',
  standalone: true,
  imports: [CommonModule,MaterialModule,AppRegistraionComponent,RenewListComponent,ReactiveFormsModule,FormsModule,SearchFilterPipe,SpinnerComponent,AccountTeamComponent],
  templateUrl: './inner-dashboard.component.html',
  styleUrl: './inner-dashboard.component.scss'
})
export class InnerDashboardComponent {
  showSpiner = true
  nameOfTeam:any;
  showSaleTeam = false;
  showLossRun = false;
  showRenewTeam = false;
  showClaimTeam = false;
  showEndrosement = false;
  showSubmissionTeam =false;
  showTransactionTeam = false;
  showAppRegistration = false;
  showRenewableTeam = false;
  showGenrateCertificateTeam = false;
  masterLogin = false;
  bindingTeam = false
  listOfAllAcount:any  =[];
  listOfAllAcountForSubmission:any =[];
  listOfAllAcountForClaim:any =[];
  listOfAllAcountForTransaction:any =[];
  searchAccount='';
  accountId ='';
  accountName ='';
  lookUpCode ='';
  emailID ='';
  phoneNumber ='';
  listOFNote:any =[];
  fieldId:any;
  currentAudio: HTMLAudioElement | null = null;
  audioTime: string = '0:00';
  showPlayButton = false;
  isButtonClicked: boolean = false;
  showLoddingMessageForSale:any;
  TeamType:any;
  listOfClinetForBunding:any =[];
  showClientButtonForBindingteam = false;
  showInsuredButtionForBindingTeam = false;
  showSuppoertTeam = false;
  suppoerTeam = false;
  showAccountTeam = false;
  accountTeam = false;
  masterTeam = false;

  Yard_Address:any;
  No_of_Unit:any;
  No_of_Driver:any;
  PolicyType:any;
  listOfCount:any=[];
  userName:any;
  descriptionClient:any;
  State:any;
  ZIP:any;
  City:any;
  ownerName:any;
  cityStore:any;
  stateStore:any;
  zipStore:any;
  description:any;
  ownerDesignation:any
  ownerPhoneNo:any;
  ownerEmailID:any;
  GaragingAddress:any;
  GaragingCity:any;
  GaragingState:any;
  GaragingPinCode:any;
  searchCriteria = {
  name: '',
  lookUpCode: '',
  city: '',
  state: '',
  zip: '',
  accountType:'',
  claimNumber:'',
  childPolicyName:'',
  };

  autoSelect ="Insured";
  teamName:any;
  showSpinner = true;
  showTeamSelector: boolean = false;
  selectedAccountName = '';
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef){
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      // this.getNameOfTeam()
    })
  }


  ngOnInit(){
  localStorage.removeItem('ExpirationDate')
     if (!sessionStorage.getItem('reloaded')) {
    sessionStorage.setItem('reloaded', 'true');
    window.location.reload();
  }
    
    this.userName = sessionStorage.getItem('UserName')
   
    if(this.userName == null){
      this.router.navigate(['/login'])  
    }
    const allowedUsers = ['Cj', 'Sandy', 'Harpal','Ray'];
  this.showTeamSelector = allowedUsers.includes(this.userName);
   this.getNameOfTeam();
    // this.clearLocalStorageValue();
    this.getCountAccount();
  }
 
 



  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  // Example function to update criteria based on user input


  // onNameChange(newName: string) {
    
  //   this.updateSearchCriteria({ name: newName });
  // }
  onNameChange(newName: string) {

  if (!newName || newName.trim() === '') {
    localStorage.removeItem('claimAccountName');
  } else {
    localStorage.setItem('claimAccountName', newName);
  }

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

  onChildPolicyChange(value: string) {
  this.updateSearchCriteria({ childPolicyName: value });
}
  

  getCountAccount(){
    this.http.getAllData(ApiUrl.getCountAccountDetai).subscribe(
      data=>{
       
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfCount = obj.AccountTypeDetail;
        
       
       
        
      })

  }

  getEffectiveDateFlagClass(flag: string): string {
    switch (flag) {
      case 'GoingToExpire':
        return 'going-to-expire';
      case 'EqualToToday':
        return 'equal-to-today';
      case 'Expired':
        return 'expired';
      default:
        return '';
    }
  }

  // getNameOfTeam(team?: string){
  //     if (team) {
  //   localStorage.setItem('teamName', team);
  //   this.nameOfTeam = team;
  //    window.location.reload();

  // } else {
  //   this.nameOfTeam = localStorage.getItem('teamName');
  // }
  //   // this.nameOfTeam =  localStorage.getItem('teamName')
  
  //   if(this.nameOfTeam == 'Sale Team') {
  //     this.showSaleTeam = true;
  //     this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcount = obj.Accounts
         
         
          
  //       }
  //     )


  //   }else if (this.nameOfTeam == 'Submission Team') {
  
    
  //     this.showSubmissionTeam = true
      
  //     this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(
  //       data=>{
         
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForSubmission = obj.Accounts;
          
         
         
          
  //       }
  //     )

  //   }
    
  //   else if (this.nameOfTeam == 'Binding Team') {
  //     this.bindingTeam = true;
  //     this.showClientButtonForBindingteam = true;

  //     this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(
  //       data=>{
          
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfClinetForBunding = obj.Accounts
         
         
          
  //       }
  //     )


  //   }
  //   else if (this.nameOfTeam == 'Endorsement Team') {
  //     this.showEndrosement = true;
  //     this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForTransaction = obj.Accounts
         
         
          
  //       }
  //     )


  //   }
  //   else if (this.nameOfTeam == 'Claim Team') {
  //     this.showClaimTeam = true;
  //     this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForClaim = obj.Accounts
         
         
          
  //       }
  //     )


  //   }
  //   else if (this.nameOfTeam == 'Transaction Team') {
  //     this.showTransactionTeam = true;
  //     this.http.getAllData(ApiUrl.getTransactionData).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForTransaction = obj.Accounts
         
         
          
  //       }
  //     )

  //   }
  //   else if (this.nameOfTeam == 'App Registration') {
  //     this.showAppRegistration = true;
  //     this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForTransaction = obj.Accounts
  //       }
  //     )

  //   }
  //   else if (this.nameOfTeam == 'Genrate Certificate Team') {
  //     this.showGenrateCertificateTeam = true;
  //     this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfClinetForBunding = obj.Accounts
         
         
          
  //       }
  //     )

  //   }
  //   else if (this.nameOfTeam == 'Renewable Team') {
  //     this.showRenewableTeam = true;
  //     this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForTransaction = obj.Accounts
         
         
          
  //       }
  //     )

  //   }
  //   else if(this.nameOfTeam == 'Loss Run') {
  //     this.showLossRun = true;
  //     this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcount = obj.Accounts
         
         
          
  //       }
  //     )


  //   }
    
  //   else if (this.nameOfTeam == 'Submission Team') {
  
    
  //     this.showSubmissionTeam = true
      
  //     this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(
  //       data=>{
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfAllAcountForSubmission = obj.Accounts;
          
         
         
          
  //       }
  //     )

  //   }
  
  //   else if (this.nameOfTeam == 'Support Team') {
  //     this.suppoerTeam = true;
  //     this.showSuppoertTeam = true;

  //     this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(
  //       data=>{
          
  //         this.showSpiner = false
  //         let response = JSON.stringify(data)
  //         var obj  = JSON.parse(response)
  //         this.listOfClinetForBunding = obj.Accounts
         
         
          
  //       }
  //     )


  //   }
  //    else if (this.nameOfTeam == 'Account Team') {
  //     this.accountTeam = true;
  //     this.showAccountTeam = true;
 


  //   }

  //     else if (this.nameOfTeam == 'Master Login') {
  //     this.masterTeam = true;
  //     this.masterLogin = true;
 


  //   }
    
    
  //   }

  getNameOfTeam(team?: string) {

 
  if (team) {
    localStorage.setItem('teamName', team);
    this.nameOfTeam = team;
 this.getNameOfTeam(); // reload logic without page refresh
return;
    // Reload page once after selection
   
    
  }
  else {
    // On page load
    this.nameOfTeam = localStorage.getItem('teamName');
  }

  // If no team found, stop
  if (!this.nameOfTeam) {
    this.showSpiner = false;
    return;
  }


  // Reset all flags
  this.resetTeamFlags();
  this.showSpiner = true;

  switch (this.nameOfTeam) {

    case 'Sale Team':
      this.showSaleTeam = true;
      this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcount = data.Accounts;
      });
      break;

    case 'Submission Team':
    
      this.showSubmissionTeam = true;
      this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForSubmission = data.Accounts;
      });
      break;

    case 'Binding Team':
      this.bindingTeam = true;
      this.showClientButtonForBindingteam = true;
      this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(data => {
        this.showSpiner = false;
        this.listOfClinetForBunding = data.Accounts;
      });
      break;

    case 'Endorsement Team':
      this.showEndrosement = true;
      this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForTransaction = data.Accounts;
      });
      break;

    case 'Claim Team':
      this.showClaimTeam = true;
      this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForClaim = data.Accounts;
       // Restore last searched account
    this.searchCriteria.name = localStorage.getItem('claimAccountName') || '';

      });
      break;

    case 'Transaction Team':
      this.showTransactionTeam = true;
      this.http.getAllData(ApiUrl.getTransactionData).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForTransaction = data.Accounts;
      });
      break;

    case 'App Registration':
      this.showAppRegistration = true;
      this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForTransaction = data.Accounts;
      });
      break;

    case 'Genrate Certificate Team':
      this.showGenrateCertificateTeam = true;
      this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(data => {
        this.showSpiner = false;
        this.listOfClinetForBunding = data.Accounts;
      });
      break;

    case 'Renewable Team':
      this.showRenewableTeam = true;
      this.http.getAllData(ApiUrl.getAllAcountForTransactionAndClaim).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcountForTransaction = data.Accounts;
      });
      break;

    case 'Loss Run':
      this.showLossRun = true;
      this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(data => {
        this.showSpiner = false;
        this.listOfAllAcount = data.Accounts;
      });
      break;

    case 'Support Team':
      this.suppoerTeam = true;
      this.showSuppoertTeam = true;
      this.http.getAllData(ApiUrl.getAllAccountForSubmiisonTeam).subscribe(data => {
        this.showSpiner = false;
        this.listOfClinetForBunding = data.Accounts;
      });
      break;

    case 'Account Team':
      this.accountTeam = true;
      this.showAccountTeam = true;
      this.showSpiner = false;
      break;

    case 'Master Login':
      this.masterTeam = true;
      this.masterLogin = true;
      this.showSpiner = false;
      break;

    default:
      this.showSpiner = false;
      break;
  }
}
resetTeamFlags() {
  this.showSaleTeam = false;
  this.showSubmissionTeam = false;
  this.bindingTeam = false;
  this.showEndrosement = false;
  this.showClaimTeam = false;
  this.showTransactionTeam = false;
  this.showAppRegistration = false;
  this.showGenrateCertificateTeam = false;
  this.showRenewableTeam = false;
  this.showLossRun = false;
  this.suppoerTeam = false;
  this.accountTeam = false;
  this.masterTeam = false;
  this.masterLogin = false;
}



    goToMasterLogin(){
       this.router.navigateByUrl('/masterLogin');
    }

    changeClinegtToInsured(){
     
      this.showClientButtonForBindingteam = false
      this.showInsuredButtionForBindingTeam = true;

      this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
        data=>{
          this.showSpiner = false
          let response = JSON.stringify(data)
          var obj  = JSON.parse(response)
          this.listOfClinetForBunding = obj.Accounts
         
         
          
        }
      )
    }
    changeInsuredToClient(){
      
      this.showClientButtonForBindingteam = true
      this.showInsuredButtionForBindingTeam = false;

      this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
        data=>{
          this.showSpiner = false
          let response = JSON.stringify(data)
          var obj  = JSON.parse(response)
          this.listOfClinetForBunding = obj.Accounts
         
         
          
        }
      )

    }


    deleteProspectiveAccount(data:any){
      
      const dialogRef = this.dialog.open(DeleteSaleProspectiveAccountComponent, {
        width: '400px',
        height: '280px',
        data: {AccountID:data.AccountID},
        
      });

    }

    deleteClientAccount(data:any){
      
      const dialogRef = this.dialog.open(DeleteSaleClientAccountComponent, {
        width: '400px',
        height: '250px',
        data: {AccountID:data.AccountID},
        
      });

    }


    openMarketd(data:any) {
      this.clearLocalStorageValue();
      this.accountId = data.AccountID
        this.accountName = data.AccountName
        this.lookUpCode = data.LookUpCode;
        this.emailID = data.EmailID;
        this.phoneNumber = data.PhoneNumber
        this.Yard_Address = data.Yard_Address;
        this.No_of_Driver = data.No_of_Driver
        this.No_of_Unit = data.No_of_Unit
        this.PolicyType = data.PolicyType;
        let ownerName  = data.AccountPrimaryDetail[0]?.Name
      
        const locationData = {
          City: data.City,
          State: data.State,
          ZIP: data.ZIP,
          Description: data.Description
        };
    
        localStorage.setItem("locationData", JSON.stringify(locationData));
        

        let MarkedPolicyID = '0'
        localStorage.setItem("accountId" ,this.accountId)
        localStorage.setItem("accountName" ,this.accountName)
        localStorage.setItem("lookUpCode" ,this.lookUpCode)
        localStorage.setItem("emailID" ,this.emailID)
        localStorage.setItem("phoneNumber" ,this.phoneNumber);
        localStorage.setItem("ownerName" ,ownerName);

        localStorage.setItem("Yard_Address" ,this.Yard_Address)
        localStorage.setItem("No_of_Driver" ,this.No_of_Driver)
        localStorage.setItem("No_of_Unit" ,this.No_of_Unit)
        localStorage.setItem("PolicyType" ,this.PolicyType);
        // sessionStorage.setItem('navigated', 'true');
        this.router.navigateByUrl('/marketed',);
      //  const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      //     width: '1400px',
      //     height: '350px',
      //     data: {MarkedPolicyID:MarkedPolicyID},
      //   });
    }
    goToPolicyBySubmissio(data:any) {
      this.clearLocalStorageValue();
     
      this.accountId = data.AccountID
      this.accountName = data.AccountName;
      this.lookUpCode = data.LookUpCode
      this.emailID = data.EmailID
      this.phoneNumber = data.PhoneNumber
      this.descriptionClient = data.Description
      this.City = data.City
      this.State = data.State
      this.ZIP = data.ZIP;
       this.ownerName  = data.AccountPrimaryDetail[0]?.Name
    
       
      this.GaragingAddress = data.GaragingAddress;
      this.GaragingCity = data.GaragingCity;
      this.GaragingState = data.GaragingState;
      this.GaragingPinCode = data.GaragingPinCode

      const locationData = {
        City: data.City,
        State: data.State,
        ZIP: data.ZIP,
        Description: data.Description
      };
      const accountPrimaryDetail = data.AccountPrimaryDetail?.[0]; 

      this.ownerName = accountPrimaryDetail?.Name || 'N/A';
      
     this.ownerDesignation = accountPrimaryDetail?.Designation || 'N/A';
     this.ownerPhoneNo = accountPrimaryDetail?.PhoneNo || 'N/A';
      this.ownerEmailID = accountPrimaryDetail?.EmailID || 'N/A';
    
      
      
      if (!data) {
       
        console.error('Submission is undefined or null');
        return;
    }
    try {
        const name = data.AccountPrimaryDetail[0].Name;
        this.ownerName =name
     
        if (!name) {
        
            console.error('Name is undefined or null');
            return;
        }
        // Rest of the code
    } catch (error) {
      this.ownerName ='null'
     
        // console.log('Error accessing Name property', 'check');
    }
   
    
    
      localStorage.setItem("accountId" ,this.accountId)
      localStorage.setItem("accountName" ,this.accountName)
      localStorage.setItem("lookUpCode" ,this.lookUpCode)
      localStorage.setItem("emailID" ,this.emailID)
      localStorage.setItem("phoneNumber" ,this.phoneNumber)
      localStorage.setItem("ownerName" ,this.ownerName);
      localStorage.setItem("descriptionClient" ,this.descriptionClient)
      localStorage.setItem("City" ,this.City)
      localStorage.setItem("State" ,this.State)
      localStorage.setItem("ZIP" ,this.ZIP)
      localStorage.setItem("ownerName" ,this.ownerName)
      localStorage.setItem("locationData", JSON.stringify(locationData));
      
      


       localStorage.setItem("GaragingAddress" ,this.GaragingAddress)
       localStorage.setItem("GaragingCity" ,this.GaragingCity)
       localStorage.setItem("GaragingState" ,this.GaragingState)
       localStorage.setItem("GaragingPinCode" ,this.GaragingPinCode)
       localStorage.setItem("ownerName" ,this.ownerName)
       localStorage.setItem("ownerDesignation" ,this.ownerDesignation)
       localStorage.setItem("ownerPhoneNo" ,this.ownerPhoneNo)
       localStorage.setItem("ownerEmailID" ,this.ownerEmailID)
       
   
      // const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      //   width: '1400px',
      //   height: '400px',
      //   data: {MarkedPolicyID:MarkedPolicyID},
      // });
      this.router.navigateByUrl('/policy',);
      
  
    }



      goToSupportTeam(data:any) {
      this.clearLocalStorageValue();
     
      this.accountId = data.AccountID
      this.accountName = data.AccountName;
      this.lookUpCode = data.LookUpCode
      this.emailID = data.EmailID
      this.phoneNumber = data.PhoneNumber
      this.descriptionClient = data.Description
      this.City = data.City
      this.State = data.State
      this.ZIP = data.ZIP;
       this.ownerName  = data.AccountPrimaryDetail[0]?.Name
    
       
      this.GaragingAddress = data.GaragingAddress;
      this.GaragingCity = data.GaragingCity;
      this.GaragingState = data.GaragingState;
      this.GaragingPinCode = data.GaragingPinCode

      const locationData = {
        City: data.City,
        State: data.State,
        ZIP: data.ZIP,
        Description: data.Description
      };
      const accountPrimaryDetail = data.AccountPrimaryDetail?.[0]; 

      this.ownerName = accountPrimaryDetail?.Name || 'N/A';
      
     this.ownerDesignation = accountPrimaryDetail?.Designation || 'N/A';
     this.ownerPhoneNo = accountPrimaryDetail?.PhoneNo || 'N/A';
      this.ownerEmailID = accountPrimaryDetail?.EmailID || 'N/A';
    
      
      
      if (!data) {
       
        console.error('Submission is undefined or null');
        return;
    }
    try {
        const name = data.AccountPrimaryDetail[0].Name;
        this.ownerName =name
     
        if (!name) {
        
            console.error('Name is undefined or null');
            return;
        }
        // Rest of the code
    } catch (error) {
      this.ownerName ='null'
     
        // console.log('Error accessing Name property', 'check');
    }
   
    
    
      localStorage.setItem("accountId" ,this.accountId)
      localStorage.setItem("accountName" ,this.accountName)
      localStorage.setItem("lookUpCode" ,this.lookUpCode)
      localStorage.setItem("emailID" ,this.emailID)
      localStorage.setItem("phoneNumber" ,this.phoneNumber)
      localStorage.setItem("ownerName" ,this.ownerName);
      localStorage.setItem("descriptionClient" ,this.descriptionClient)
      localStorage.setItem("City" ,this.City)
      localStorage.setItem("State" ,this.State)
      localStorage.setItem("ZIP" ,this.ZIP)
      localStorage.setItem("ownerName" ,this.ownerName)
      localStorage.setItem("locationData", JSON.stringify(locationData));
      
      


       localStorage.setItem("GaragingAddress" ,this.GaragingAddress)
       localStorage.setItem("GaragingCity" ,this.GaragingCity)
       localStorage.setItem("GaragingState" ,this.GaragingState)
       localStorage.setItem("GaragingPinCode" ,this.GaragingPinCode)
       localStorage.setItem("ownerName" ,this.ownerName)
       localStorage.setItem("ownerDesignation" ,this.ownerDesignation)
       localStorage.setItem("ownerPhoneNo" ,this.ownerPhoneNo)
       localStorage.setItem("ownerEmailID" ,this.ownerEmailID)
       
   
      // const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      //   width: '1400px',
      //   height: '400px',
      //   data: {MarkedPolicyID:MarkedPolicyID},
      // });
      this.router.navigateByUrl('/supportTeam',);
  
    }

    goToEndorsement(data:any) {
      this.clearLocalStorageValue();
      this.accountId = data.AccountID
      this.accountName = data.AccountName;
      this.lookUpCode = data.LookUpCode
      this.emailID = data.EmailID
      this.phoneNumber = data.PhoneNumber
      this.descriptionClient = data.Description
      this.ownerName  = data.AccountPrimaryDetail[0]?.Name
      
      this.City = data.City
      this.State = data.State
      this.ZIP = data.ZIP
      const locationData = {
        City: data.City,
        State: data.State,
        ZIP: data.ZIP,
        Description: data.Description
      };
      
      if (!data) {
       
        console.error('Submission is undefined or null');
        return;
    }
    try {
        const name = data.AccountPrimaryDetail[0].Name;
        this.ownerName =name
     
        if (!name) {
        
            console.error('Name is undefined or null');
            return;
        }
        // Rest of the code
    } catch (error) {
      this.ownerName ='null'
     
        console.log('Error accessing Name property', 'check');
    }
   
    
    
      localStorage.setItem("accountId" ,this.accountId)
      localStorage.setItem("accountName" ,this.accountName)
      localStorage.setItem("lookUpCode" ,this.lookUpCode)
      localStorage.setItem("emailID" ,this.emailID)
      localStorage.setItem("phoneNumber" ,this.phoneNumber)

      localStorage.setItem("descriptionClient" ,this.descriptionClient)
      localStorage.setItem("City" ,this.City)
      localStorage.setItem("State" ,this.State)
      localStorage.setItem("ZIP" ,this.ZIP)
      localStorage.setItem("ownerName" ,this.ownerName)
      localStorage.setItem("locationData", JSON.stringify(locationData));
      

     
      // const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      //   width: '1400px',
      //   height: '400px',
      //   data: {MarkedPolicyID:MarkedPolicyID},
      // });
      this.router.navigateByUrl('/endorsement',);
  
    }

    getNoteByAccountId(data:any){
      this.clearLocalStorageValue();
     this.showLoddingMessageForSale = true;
      let accountId = data.AccountID
     
      this.http.getAllDataId(ApiUrl.getGetNoteByAccout,accountId).subscribe(
        data=>{
         this.showLoddingMessageForSale = false
          let response = JSON.stringify(data)
          var obj  = JSON.parse(response)
          this.listOFNote = obj.VoiceDetail
         
         
          
        }
      )
    }

    playAudio() {
      if (this.currentAudio) {
        this.currentAudio.play();
        
      }
    }
  
    pauseAudio() {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
    }
  
    stopAudio() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        const stopButton = document.getElementById('stopButton');
        if (stopButton) {
          stopButton.style.display = 'none'; // Hide the stop button
        }
      }
    }
  
    // Function to format time in mm:ss format
    formatTime(time: number): string {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
  
    onNoteRowClick(file: any) {
      const apiUrl = `https://www.the-aia.com/api/Voice/GetNoteSaleTeam/${file.FileID}`;
  
      // Create an audio element
      const audio = new Audio(apiUrl);
  
      // Stop the currently playing audio, if any
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
  
      // Update audio time continuously
      audio.addEventListener('timeupdate', () => {
        this.audioTime = this.formatTime(audio.currentTime);
      });
  
      // Play the audio
      audio.play()
        .then(() => {
          this.showPlayButton = true
          // Display the length of the audio
  
          // Show the stop button
          const stopButton = document.getElementById('stopButton');
          if (stopButton) {
            stopButton.style.display = 'inline-block';
          }
  
          console.log('Audio playback started');
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
  
      // Update the currentAudio variable
      this.currentAudio = audio;
    }
  


    deletNote(data:any){
      let filedId = data.FileID;
      let passowrd = data.Password;
      
    this.dialog.open(DeleteSaleTeamNoteComponent ,{
      width: '450px',
      height:'230px',
      data: {filedId:filedId,passowrd:passowrd,}

    });
    }
  
    addLossRun(data:any) {
      this.clearLocalStorageValue();
      this.accountId = data.AccountID
        this.accountName = data.AccountName
        this.lookUpCode = data.LookUpCode;
        this.emailID = data.EmailID;
        this.phoneNumber = data.PhoneNumber

        const locationData = {
          City: data.City,
          State: data.State,
          ZIP: data.ZIP,
          Description: data.Description
        };
        if (!data) {
       
          console.error('Submission is undefined or null');
          return;
      }
      try {
          const name = data.AccountPrimaryDetail[0].Name;
          this.ownerName =name
          
          if (!name) {
          
              console.error('Name is undefined or null');
              return;
          }
          // Rest of the code
      } catch (error) {
       
        this.ownerName ='null'
          // console.error('Error accessing Name property', error);
      }
        let TransactionID = '0'

        localStorage.setItem("accountId" ,this.accountId)
        localStorage.setItem("accountName" ,this.accountName)
        localStorage.setItem("lookUpCode" ,this.lookUpCode)
        localStorage.setItem("emailID" ,this.emailID)
        localStorage.setItem("phoneNumber" ,this.phoneNumber)
        localStorage.setItem("ownerName" ,this.ownerName)
        localStorage.setItem("locationData", JSON.stringify(locationData));
      //  const dialogRef = this.dialog.open(AddEditTransactionComponent, {
      //     width: '1400px',
      //     height: '700px',
      //     data: {TransactionID:TransactionID},
      //   });
        this.router.navigateByUrl('/lossRun',);
     
  
    }
    addTranshaction(data:any) {
      this.clearLocalStorageValue();
      this.accountId = data.AccountID
        this.accountName = data.AccountName
        this.lookUpCode = data.LookUpCode;
        this.emailID = data.EmailID;
        this.phoneNumber = data.PhoneNumber
        const locationData = {
          City: data.City,
          State: data.State,
          ZIP: data.ZIP,
          Description: data.Description
        };
        if (!data) {
       
          console.error('Submission is undefined or null');
          return;
      }
      try {
          const name = data.AccountPrimaryDetail[0].Name;
          this.ownerName =name
          
          if (!name) {
          
              console.error('Name is undefined or null');
              return;
          }
          // Rest of the code
      } catch (error) {
       
        this.ownerName ='null'
          // console.error('Error accessing Name property', error);
      }
        let TransactionID = '0'

        localStorage.setItem("accountId" ,this.accountId)
        localStorage.setItem("accountName" ,this.accountName)
        localStorage.setItem("lookUpCode" ,this.lookUpCode)
        localStorage.setItem("emailID" ,this.emailID)
        localStorage.setItem("phoneNumber" ,this.phoneNumber)
        localStorage.setItem("ownerName" ,this.ownerName)
        localStorage.setItem("locationData", JSON.stringify(locationData));
      //  const dialogRef = this.dialog.open(AddEditTransactionComponent, {
      //     width: '1400px',
      //     height: '700px',
      //     data: {TransactionID:TransactionID},
      //   });
        this.router.navigateByUrl('/transaction');
     
  
    }


    addClaim(data:any) {
       this.selectedAccountName = data.AccountName;
       localStorage.setItem('claimAccountName', data.AccountName);
      this.clearLocalStorageValue();
      this.router.navigateByUrl('/claims');
      this.accountId = data.AccountID
        this.accountName = data.AccountName
        this.lookUpCode = data.LookUpCode;
        this.emailID = data.EmailID;
        this.phoneNumber = data.PhoneNumber
        this.ownerName  = data.AccountPrimaryDetail[0]?.Name

        let TransactionID = '0'
        const locationData = {
          City: data.City,
          State: data.State,
          ZIP: data.ZIP,
          Description: data.Description
        };
      
         
        localStorage.setItem("accountId" ,this.accountId)
        localStorage.setItem("accountName" ,this.accountName)
        localStorage.setItem("lookUpCode" ,this.lookUpCode)
        localStorage.setItem("ownerName" ,this.ownerName)
        localStorage.setItem("emailID" ,this.emailID)
        localStorage.setItem("phoneNumber" ,this.phoneNumber)
        localStorage.setItem("locationData", JSON.stringify(locationData));
      //  const dialogRef = this.dialog.open(AddEditClaimComponent,  {
      //     width: '1400px',
      //     height: '600px',
      //     data: {TransactionID:TransactionID},
      //   });
        
     
  
    }


    certs(data:any){

      this.clearLocalStorageValue();
      this.router.navigateByUrl('/certs/holder');
      this.accountId = data.AccountID
        this.accountName = data.AccountName
        this.lookUpCode = data.LookUpCode;
        this.emailID = data.EmailID;
        this.phoneNumber = data.PhoneNumber
  this.ownerName  = data.AccountPrimaryDetail[0]?.Name
        let TransactionID = '0'
        const locationData = {
          City: data.City,
          State: data.State,
          ZIP: data.ZIP,
          Description: data.Description
        };
        localStorage.setItem("accountId" ,this.accountId)
        localStorage.setItem("accountName" ,this.accountName)
        localStorage.setItem("lookUpCode" ,this.lookUpCode)
        localStorage.setItem("emailID" ,this.emailID)
         localStorage.setItem("ownerName" ,this.ownerName)
        localStorage.setItem("phoneNumber" ,this.phoneNumber)
        localStorage.setItem("locationData", JSON.stringify(locationData));
      //  const dialogRef = this.dialog.open(AddEditClaimComponent,  {
      //     width: '1400px',
      //     height: '600px',
      //     data: {TransactionID:TransactionID},
      //   });

    }
    
  
  
  
    clearLocalStorageValue(){
      localStorage.removeItem('accountId')
      localStorage.removeItem('accountName')
      localStorage.removeItem('lookUpCode')
      localStorage.removeItem('emailID')
      localStorage.removeItem('phoneNumber')
      localStorage.removeItem('Yard_Address')
      localStorage.removeItem('No_of_Unit')
      localStorage.removeItem('No_of_Driver')
      localStorage.removeItem('PolicyType')
      localStorage.removeItem('descriptionClient')
      localStorage.removeItem('City')
      localStorage.removeItem('State')
      localStorage.removeItem('ZIP')
      localStorage.removeItem('ownerName')
      localStorage.removeItem('locationData')
      localStorage.removeItem('ownerName')
      localStorage.removeItem('ownerDesignation')
      localStorage.removeItem('ownerPhoneNo')
      localStorage.removeItem('ownerEmailID')
      localStorage.removeItem('GaragingAddress')
      localStorage.removeItem('GaragingCity')
      localStorage.removeItem('GaragingState')
      localStorage.removeItem('GaragingPinCode')
      localStorage.removeItem('ownerName')
    }


}
