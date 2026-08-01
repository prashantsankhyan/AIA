import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxPrintModule } from 'ngx-print';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { PDFDocument } from 'pdf-lib';
@Component({
  selector: 'app-submit-change-request',
  standalone: true,
  imports: [NgxPrintModule,CommonModule],
  templateUrl: './submit-change-request.component.html',
  styleUrl: './submit-change-request.component.scss'
})
export class SubmitChangeRequestComponent {
  ChildPolicyID:any;
  AccountID:any;
  EffectiveDateChange:any;
  IDBasedOnAMC:any;
  EndorsementID:any;
  LineShortName:any;
  LineName:any;
  ListOfAllDriver:any=[];
  ListOfAllVehicle:any=[];
  Description:any;
  part1: string = '';
  part2: string = ''; 
  part3: string = ''; 
  agencyInfo =`Amerigo Insurance Agency
1110 Civic Center Ste 202D
Yuba City, CA 95993`;
 phonenUmber ='(530) 290-1633';
 faxNumber ='(530) 290-1701';
 today: Date = new Date();

accountName:any;
lookUpCode:any;

EnteredBy:any
issuingCompanyName:any;
childPolicyName:any;
OwnerName='Parmjit Dhami'





   constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private cdr: ChangeDetectorRef,private router:Router,public dialog: MatDialog,public dialogRef: MatDialogRef<SubmitChangeRequestComponent>) { 
     
    }

    ngOnInit(): void {
      this.accountName = localStorage.getItem('accountName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
      this.data;
      this.AccountID = this.data.AccountID
      this.ChildPolicyID =this.data.ChildPolicyID;
      this.EffectiveDateChange = this.data.EffectiveDateChange
      this.IDBasedOnAMC = this.data.IDBasedOnAMC;
      this.EndorsementID = this.data.EndorsementID;
      this.EnteredBy = this.data.EnteredBy;
     
      this.LineShortName= this.data.LineShortName;
      this.LineName = this.data.LineName;


     
      this.Description = localStorage.getItem('Description');
      const parts = this.Description.split('-');
      this.part1 = parts[0]; // "APD"
      this.part2 = parts[1]; // "MTC"
      this.part3 = parts[2]; // "APD"
  
     
       this.gePolciyDetails();
      this.getResultData();
      
      
   }
   get hasMTC(): boolean {
    return [this.part1, this.part2, this.part3].includes('MTC');
  }

  get hasAL(): boolean {
    return [this.part1, this.part2, this.part3].includes('AL');
  }


get isProperty(): boolean {
  return this.LineName === 'PROP';
}

get isTruckers(): boolean {
  return ['TRUC', 'CPKG', 'PHYD'].includes(this.LineName);
}

get isMotorCarriers(): boolean {
  return ['MTC', 'CPKG'].includes(this.LineName);
}

get isGeneralLiability(): boolean {
  return this.LineName === 'GLIA';
}

get isUmbrella(): boolean {
  return this.LineName === 'CUMB';
}

get isWorkersComp(): boolean {
  return this.LineName === 'WCOM';
}

get isAuto(): boolean {
  
  return ['Auto Liability', 'CPKG'].includes(this.LineName);
}

get isPhysicalDamage(): boolean {
  return this.LineName === 'PHYD';
}

get isNTL(): boolean {
  return this.LineName === 'NTL';
}

  gePolciyDetails() {
  this.http.getAllDataId(ApiUrl.getPolicyBuChildPolcyId, this.ChildPolicyID)
    .subscribe((data: any) => {

      console.log(data);

      if (data.ChildPolicys && data.ChildPolicys.length > 0) {

        this.issuingCompanyName = data.ChildPolicys[0].IssuingCompanyName;
        this.childPolicyName = data.ChildPolicys[0].ChildPolicyName;
     
        console.log('Issuing Company Name:', this.issuingCompanyName);
        console.log('Child Policy Name:', this.childPolicyName);
      }

    });
}

     getResultData() {
    this.http.getAllDataByTwoId(ApiUrl.submitChangeRequestForDriverAndVehicle, this.AccountID,this.EndorsementID)
      .subscribe(data => {
        const obj = JSON.parse(JSON.stringify(data));
        this.ListOfAllDriver = obj.Drivers || [];
        this.ListOfAllVehicle = obj.Vehicles || [];
      });
  }

  get EffectiveDate(): string {
    if (this.ListOfAllDriver.length > 0) {
      return this.formatDate(this.ListOfAllDriver[0]?.Effective);
    } else if (this.ListOfAllVehicle.length > 0) {
      return this.formatDate(this.ListOfAllVehicle[0]?.Effective);
    }
    return '';
  }

  get ExpirationDate(): string {
    if (this.ListOfAllDriver.length > 0) {
      return this.formatDate(this.ListOfAllDriver[0]?.Expiration);
    } else if (this.ListOfAllVehicle.length > 0) {
      return this.formatDate(this.ListOfAllVehicle[0]?.Expiration);
    }
    return '';
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Format MM/dd/yyyy
  }



}
