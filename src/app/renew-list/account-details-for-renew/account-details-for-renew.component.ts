import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-account-details-for-renew',
  standalone: true,
   imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,SpinnerComponent],
  templateUrl: './account-details-for-renew.component.html',
  styleUrl: './account-details-for-renew.component.scss'
})
export class AccountDetailsForRenewComponent {
  showSpiner = true;
  listOfDataById: any[] = [];
  accountPrimaryDetail: any[] = [];
  AccountID:any;
  accountId:any
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  Yard_Address:any
  No_of_Driver:any;
  No_of_Unit:any;
  PolicyType:any

  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
   
    this.AccountID = this.router.snapshot.paramMap.get('id')
    this.clearLocalStorage()
    this.getDataByAccountId()
    
  }

  getDataByAccountId(){

    this.http.getAllDataId(ApiUrl.getAllAccountById, this.AccountID).subscribe(
      (data) => {
        this.listOfDataById = data.Accounts || [];
        this.accountPrimaryDetail = data.AccountPrimaryDetail || [];
        this.showSpiner = false
        this.showSpiner = false; // Hide spinner once data is loaded
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.showSpiner = false;
      }
    );
  }


  completeNextStep(data:any){
    this.accountId = data.AccountID;
    this.accountName = data.AccountName;
    this.lookUpCode = data.LookUpCode;
    this.emailID = data.EmailID;
    this.phoneNumber = data.PhoneNumber
   this.Yard_Address = data.Yard_Address
   this.No_of_Driver = data.No_of_Driver
   this.No_of_Unit = data.No_of_Unit
   this.PolicyType = data.PolicyType

    const locationData = {
      City: data.City,
      State: data.State,
      ZIP: data.ZIP,
      Description: data.Description
    };

    localStorage.setItem("locationData", JSON.stringify(locationData));
    

    
    localStorage.setItem("accountId" ,this.accountId)
    localStorage.setItem("accountName" ,this.accountName)
    localStorage.setItem("lookUpCode" ,this.lookUpCode)
    localStorage.setItem("emailID" ,this.emailID)
    localStorage.setItem("phoneNumber" ,this.phoneNumber);

    localStorage.setItem("Yard_Address" ,this.Yard_Address)
    localStorage.setItem("No_of_Driver" ,this.No_of_Driver)
    localStorage.setItem("No_of_Unit" ,this.No_of_Unit)
    localStorage.setItem("PolicyType" ,this.PolicyType);
    // sessionStorage.setItem('navigated', 'true');
    this.cRouter.navigateByUrl('/marketed',);
    
    // this.cRouter.navigate(['/detailLayout'])
    
  }

  clearLocalStorage() {
    localStorage.removeItem("locationData");
    localStorage.removeItem("accountId");
    localStorage.removeItem("accountName");
    localStorage.removeItem("lookUpCode");
    localStorage.removeItem("emailID");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("Yard_Address");
    localStorage.removeItem("No_of_Driver");
    localStorage.removeItem("No_of_Unit");
    localStorage.removeItem("PolicyType");
  }
    
  }

