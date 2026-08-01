import { ChangeDetectorRef, Component } from '@angular/core';
import { RenewListComponent } from '../../renew-list/renew-list.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchRenewListPipe } from '../../renew-list/search-renew-list.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { ListOfAllDataOfRenewComponent } from '../../renew-list/list-of-all-data-of-renew/list-of-all-data-of-renew.component';

@Component({
  selector: 'app-list-of-renew-policy-for-loss-run',
  standalone: true,
   imports: [ CommonModule,MaterialModule,RouterModule,SearchRenewListPipe,SpinnerComponent],
  templateUrl: './list-of-renew-policy-for-loss-run.component.html',
  styleUrl: './list-of-renew-policy-for-loss-run.component.scss'
})
export class ListOfRenewPolicyForLossRunComponent {
showSpiner = true
  listOfAllRenew:any =[]
  AccountID ='';
  MarkedPolicyID:any;
  ChildPolicyID:any;
  accountId:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  Yard_Address:any;
  No_of_Driver:any;
  PolicyType:any;
  No_of_Unit:any;
  searchCriteria = {
    Expiration: '',
    LookUpCode: '',
    ExpireInDays: '',
  
  };

  constructor(private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.getAllData();
    
  }
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  onExpirationChange(newExpiration: string) {
    this.updateSearchCriteria({ Expiration: newExpiration });
    
  }

  onLookUpCodeChange(newLookUpCode: string) {
    this.updateSearchCriteria({ LookUpCode: newLookUpCode });
  }
  
  onExpireInDaysChange(newExpireInDays: string) {
    this.updateSearchCriteria({ ExpireInDays: newExpireInDays });
  }
 
  getAllData(){
    this.http.getAllData(ApiUrl.getListOfAllRenewPolicyWithoutAccountId).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfAllRenew = obj.ChildPolicys

      }
    )
  }


   



  completeNextStep(data:any){
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

  detailList(data:any){
    let AccountId  = data.AccountID
    this.cRouter.navigate(['/renew/details', AccountId]);
  }

  backToLossRun(){
    this.cRouter.navigate(['/lossRun/lossRun']);
   
  }


  listOfAllData(data:any){
    let AccountId  = data.AccountID
    const dialogRef = this.dialog.open(ListOfAllDataOfRenewComponent, {
      width: '1800px',
      height: '800px',
      data: {AccountID:data.AccountID,ChildPolicyID:data.ChildPolicyID,MarkedPolicyID:data.MarkedPolicyID},  
    });
   
  }

 
}
