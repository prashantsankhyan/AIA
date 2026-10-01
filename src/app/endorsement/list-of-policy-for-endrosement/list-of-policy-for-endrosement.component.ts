import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditAccountComponent } from '../../main-layout/acoount-details/add-edit-account/add-edit-account.component';
import { DeletePolicyComponent } from '../../policy/delete-policy/delete-policy.component';
import { AddEditPolicyComponent } from '../../policy/add-edit-policy/add-edit-policy.component';
import { ListOfRemarksForEndrosementComponent } from '../list-of-remarks-for-endrosement/list-of-remarks-for-endrosement.component';
import { ListOfAllDriverTruckAndAnotherComponent } from '../../policy/list-of-all-driver-truck-and-another/list-of-all-driver-truck-and-another.component';
import { ListOfDriverAnVehilceOnBindTimeComponent } from '../list-of-driver-an-vehilce-on-bind-time/list-of-driver-an-vehilce-on-bind-time.component';
import { ListOfEndrosementBaseAddEditDeleteDataComponent } from '../list-of-endrosement-base-add-edit-delete-data/list-of-endrosement-base-add-edit-delete-data.component';

@Component({
  selector: 'app-list-of-policy-for-endrosement',
  standalone: true,
  imports: [CommonModule,MaterialModule,SpinnerComponent],
  templateUrl: './list-of-policy-for-endrosement.component.html',
  styleUrl: './list-of-policy-for-endrosement.component.scss'
})
export class ListOfPolicyForEndrosementComponent {
 showSpiner = true;

  AccountID: any;
  ChildPolicyID: any;
  MarkedPolicyID = '';

  // Flags for display
  showPolicyTableEmpty = false;
  showPolicyTableFilled = false;
  showExpireTableEmpty = false;
  showExpireTableFilled = false;

  // Data holders
  issuedPolicies: any[] = [];
  filteredPolicies: any[] = [];
  expiredPolicies: any[] = [];
  repostingType:any;
repostingTypeMap: { [key: number]: string } = {};
  constructor(
    private http: AllApiService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.http.listen().subscribe((m: any) => {
      console.log(m);
      this.getPolicyByAccountId();
    });
  }

  ngOnInit(): void {
    this.AccountID = localStorage.getItem('accountId');
    this.getPolicyByAccountId();
  }

  getPolicy(): void {
    this.getPolicyByAccountId();
  }

  getAllExpire(): void {
    this.getAllExpirePolicyListByAccontId();
  }

  // getPolicyByAccountId() {
  //   this.showSpiner = true;
  //   this.showPolicyTableEmpty = false;
  //   this.showPolicyTableFilled = false;

  //   this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId, this.AccountID).subscribe(data => {
  //     this.showSpiner = false;
  //     const obj = JSON.parse(JSON.stringify(data));
  //     const policies = obj.ChildPolicys || [];

  //     if (policies.length === 0) {
  //       this.showPolicyTableEmpty = true;
  //     } else {
  //       this.showPolicyTableFilled = true;
  //       this.issuedPolicies = policies;
  //       this.filteredPolicies = policies.filter((item:any) => item.StageType === 'Issue');
  //     }

  //     // hide expire view
  //     this.showExpireTableFilled = false;
  //     this.showExpireTableEmpty = false;
  //   });
  // }
getPolicyByAccountId() {
  this.showSpiner = true;
  this.showPolicyTableEmpty = false;
  this.showPolicyTableFilled = false;

  this.http
    .getAllDataId(ApiUrl.getAllPolicyByAccountId, this.AccountID)
    .subscribe(data => {

      this.showSpiner = false;

      const obj = JSON.parse(JSON.stringify(data));
      const policies = obj.ChildPolicys || [];

      if (policies.length === 0) {
        this.showPolicyTableEmpty = true;
      } else {
        this.showPolicyTableFilled = true;

        this.issuedPolicies = policies;

        // Issue policies first, then all other policies
        this.filteredPolicies = [...policies].sort((a: any, b: any) => {
          const aIssue = a?.StageType === 'Issue' ? 0 : 1;
          const bIssue = b?.StageType === 'Issue' ? 0 : 1;

          return aIssue - bIssue;
        });
      }

      this.showExpireTableFilled = false;
      this.showExpireTableEmpty = false;
    });
}

  getAllExpirePolicyListByAccontId() {
    this.showSpiner = true;
    this.showExpireTableFilled = false;
    this.showExpireTableEmpty = false;

    this.http.getAllDataId(ApiUrl.getAllExpirePolicyByAccountId, this.AccountID).subscribe(data => {
      this.showSpiner = false;
      const obj = JSON.parse(JSON.stringify(data));
      const policies = obj.ChildPolicys || [];

      if (policies.length === 0) {
        this.showExpireTableEmpty = true;
      } else {
        this.showExpireTableFilled = true;
        this.expiredPolicies = policies;
      }

      // hide issued view
      this.showPolicyTableEmpty = false;
      this.showPolicyTableFilled = false;
    });
  }

  
getRepoting(data: any): void {

  const childPolicyID = data?.ChildPolicyID;

  if (!childPolicyID) {
    return;
  }

  console.log('Mouse entered row:', childPolicyID);

  this.http
    .getAllDataId(
      ApiUrl.getPolicyStatus,
      childPolicyID
    )
    .subscribe((response: any) => {

      const obj =
        typeof response === 'string'
          ? JSON.parse(response)
          : response;

      console.log(
        'API Response:',
        childPolicyID,
        obj
      );

      if (obj?.Reposting?.length > 0) {

        const repostingData = obj.Reposting[0];

        this.repostingTypeMap[childPolicyID] =
          repostingData.RepostingType || '';

        console.log(
          'ChildPolicyID:',
          childPolicyID
        );

        console.log(
          'RepostingType:',
          this.repostingTypeMap[childPolicyID]
        );

      } else {

        this.repostingTypeMap[childPolicyID] = '';

      }
    });
}

  editPolicy(data: any) {
    this.ChildPolicyID = data.ChildPolicyID;
    this.MarkedPolicyID = data.MarkedPolicyID;

    this.dialog.open(AddEditPolicyComponent, {
      width: '1400px',
      data: { ChildPolicyID: this.ChildPolicyID, MarkedPolicyID: this.MarkedPolicyID }
    });
  }

  
  
  viewAllData(data: any) {
  

    this.dialog.open(ListOfAllDriverTruckAndAnotherComponent, {
    width: '1900px',
    height: '700px',
      data: { ChildPolicyID: data.ChildPolicyID, MarkedPolicyID: data.MarkedPolicyID }
    });
  }


   bindTimeData(data: any) {
  

    this.dialog.open(ListOfDriverAnVehilceOnBindTimeComponent, {
    width: '1900px',
    height: '700px',
      data: { ChildPolicyID: data.ChildPolicyID, MarkedPolicyID: data.MarkedPolicyID }
    });
  }

  changeTimeData(data: any) {
  

    this.dialog.open(ListOfEndrosementBaseAddEditDeleteDataComponent, {
    width: '1900px',
    height: '700px',
      data: { ChildPolicyID: data.ChildPolicyID, MarkedPolicyID: data.MarkedPolicyID }
    });
  }
  deletePolicy(data: any) {
    this.dialog.open(DeletePolicyComponent, {
      width: '400px',
      data: { ChildPolicyID: data.ChildPolicyID }
    });
  }

   remarksViews(data: any) {
    this.dialog.open(ListOfRemarksForEndrosementComponent, {
      width: '500px',
      
      data: { ChildPolicyID: data.ChildPolicyID }
    });
  }

  updateAccountType(data: any) {
    this.dialog.open(AddEditAccountComponent, {
      data: { AccountId: this.AccountID }
    });
  }

  // goToEndrosement(data: any) {
  //   this.clearLocalStorage();

  //   localStorage.setItem('MarkedPolicyID', data.MarkedPolicyID);
  //   localStorage.setItem('ChildPolicyID', data.ChildPolicyID);
  //   localStorage.setItem('accountId', this.AccountID);
   
    
  //   localStorage.setItem('Description', data.Description);

  //   this.router.navigate(['./endorsement/endrosementDetail']);
  // }
  goToEndrosement(data: any) {

  // Only Issue policies are clickable
  if (data?.StageType !== 'Issue') {
    return;
  }

  this.clearLocalStorage();

  localStorage.setItem('MarkedPolicyID', data.MarkedPolicyID);
  localStorage.setItem('ChildPolicyID', data.ChildPolicyID);
  localStorage.setItem('accountId', this.AccountID);

  localStorage.setItem('Description', data.Description);

  this.router.navigate(['./endorsement/endrosementDetail']);
}

  clearLocalStorage() {
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('ChildPolicyID');
    localStorage.removeItem('Description');
     localStorage.removeItem('ExpirationDate')
    
  }

  shouldHighlight(data: any): boolean {
  return data?.IsTemporaryDelete == true && data?.Ischildpolicyexist == true;
}
  goToDashboard() {
    this.router.navigate(['/dashboard/_dashboard']);
  }




}
