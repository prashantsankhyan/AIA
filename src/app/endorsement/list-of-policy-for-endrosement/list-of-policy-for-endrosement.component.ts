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

  getPolicyByAccountId() {
    this.showSpiner = true;
    this.showPolicyTableEmpty = false;
    this.showPolicyTableFilled = false;

    this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId, this.AccountID).subscribe(data => {
      this.showSpiner = false;
      const obj = JSON.parse(JSON.stringify(data));
      const policies = obj.ChildPolicys || [];

      if (policies.length === 0) {
        this.showPolicyTableEmpty = true;
      } else {
        this.showPolicyTableFilled = true;
        this.issuedPolicies = policies;
        this.filteredPolicies = policies.filter((item:any) => item.StageType === 'Issue');
      }

      // hide expire view
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

  editPolicy(data: any) {
    this.ChildPolicyID = data.ChildPolicyID;
    this.MarkedPolicyID = data.MarkedPolicyID;

    this.dialog.open(AddEditPolicyComponent, {
      width: '1400px',
      data: { ChildPolicyID: this.ChildPolicyID, MarkedPolicyID: this.MarkedPolicyID }
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

  goToEndrosement(data: any) {
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
  }

  shouldHighlight(data: any): boolean {
  return data?.IsTemporaryDelete == true && data?.Ischildpolicyexist == true;
}
  goToDashboard() {
    this.router.navigate(['/dashboard/_dashboard']);
  }




}
