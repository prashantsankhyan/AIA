import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxPrintModule } from 'ngx-print';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cab-card',
  standalone: true,
  imports: [NgxPrintModule,CommonModule],
  templateUrl: './cab-card.component.html',
  styleUrl: './cab-card.component.scss'
})
export class CabCardComponent {

  MarkedPolicyID: any;
  ChildPolicyID: any;
  AccountID:any;
  LookUpCode:any;

  listOfData: any[] = [];
  carrierData: any = {};
  listOfAccount:any ={};
  vehicleDetail:any[]=[];
  cabCard='Cab Card';
  LoginUserName:any;

  policyData: any = {
    BrokerID: null,
    BrokerName: '',
    ChildPolicyName: '',
    Effective: '',
    Expiration: '',
    IssuingCompany: '',
    IssuingCompanyName: '',
    AccountID: null
  };

  constructor(
    private dialogRef: MatDialogRef<CabCardComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: any,

    private http: AllApiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.MarkedPolicyID = this.data?.MarkedPolicyID;
    this.ChildPolicyID = this.data?.ChildPolicyID;
    this.LoginUserName = sessionStorage.getItem('UserName');

    console.log('MarkedPolicyID:', this.MarkedPolicyID);
    console.log('ChildPolicyID:', this.ChildPolicyID);

    this.getPolicy();
    this.getAllVehicle();
  }

  getPolicy() {

  this.http.getAllDataId(
    ApiUrl.getPolicyByChildPolcyId,
    this.ChildPolicyID
  ).subscribe((data: any) => {

    console.log('Policy API Response:', data);

    if (data?.ChildPolicys?.length > 0) {

      const policy = data.ChildPolicys[0];
      this.cabCard = `Cab Card - ${policy.ChildPolicyName || ''}`;

      this.policyData = {
        BrokerID: policy.BrokerID,
        BrokerName: policy.BrokerName,

        ChildPolicyName: policy.ChildPolicyName,
        Effective: policy.Effective,
        Expiration: policy.Expiration,

        IssuingCompany: policy.IssuingCompany,
        IssuingCompanyName: policy.IssuingCompanyName,

        AccountID: policy.AccountID
      };

      console.log('Policy Data:', this.policyData);

      // Call Carrier API after getting IssuingCompany
      this.getCarrierDetial(policy.IssuingCompany);
      this.getDataByAccountId(policy.AccountID)
    }
  });
}



 getCarrierDetial(issuingCompany: any) {

  console.log('Issuing Company ID:', issuingCompany);

  this.http.getAllDataId(
    ApiUrl.getCarrierById,
    issuingCompany
  ).subscribe((data: any) => {

    console.log('Carrier Response:', data);

    // store carrier data here
    this.carrierData = data?.Carrier?.[0] || {};
   
  });
}


getDataByAccountId(accountName: any) {

  console.log('accountName:', accountName);

  this.http.getAllDataId(
    ApiUrl.getAllAccountById,
    accountName
  ).subscribe((data: any) => {

    console.log('Account Response:', data);

    this.listOfAccount = data?.Accounts || [];
     this.LookUpCode =
        this.listOfAccount[0].LookUpCode || '';

    if (this.listOfAccount.length > 0) {
      console.log('Account Name:', this.listOfAccount[0].AccountName);
    }

  });
}
 
     
     
  
   
  



getAllVehicle() {

  this.http.getAllDataByTwoId(
    ApiUrl.getAllClaimVehicle,
    this.MarkedPolicyID,
    this.ChildPolicyID
  ).subscribe((data: any) => {

    console.log('Vehicle Response:', data);

    this.vehicleDetail = data?.Vehicles || [];

    console.log('Total Vehicles:', this.vehicleDetail.length);
    console.log('Vehicles:', this.vehicleDetail);

  });

}

  close(): void {
    this.dialogRef.close();
  }
}
