import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-remarks',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    SpinnerComponent
  ],
  templateUrl: './remarks.component.html',
  styleUrl: './remarks.component.scss'
})
export class RemarksComponent {
  showSpinner = true;
  addEditRemarksForm!: FormGroup;
  listOfRemarks: any[] = [];
  accountId: number = 0;
IsChildPolicyExist:any;
 showSaveButtion = true;
 MarkedPolicyId:any;
 ChildPolicyID:any;
  constructor(
    private http: AllApiService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService ,
  ) {}

  ngOnInit(): void {
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '0');
     this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = Number(localStorage.getItem('ChildPolicyID'));
   
       this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
       
      
    if(this.IsChildPolicyExist == 'true'){
      this.showSaveButtion = true
    }
    else{
      this.showSaveButtion = true
    }
    if (!this.accountId) {
      alert('Invalid account ID');
      return;
    }


    this.initForm();
    this.getListOfRemarks();
    // this.getDetails()
  }

  initForm() {
    this.addEditRemarksForm = this.fb.group({
      RemarkID: [0],
      AutoLiability: [''],
      AL_Deductible: [''],
      PhysicalDamage: [''],
      PhyDamage_Deductible: [''],
      MTC: [''],
      MTC_Deductible: [''],
      MTC_Refer_Breakdown: [''],
      TrailerInterchange: [''],
      Trailer_limit: [''],
      GLC_occurence: [''],
      GLC_DamageToRented: [''],
      GLC_MedExp: [''],
      GLC_PersonalAdv: [''],
      GLC_GeneralAgg: [''],
      GLC_Productcomp: [''],
      GLC_Others: [''],
      Umbrella_Limit: [''],
      Umbrella_Deductible: [''],
      Contingent_CargoLimit: [''],
      Contingent_Deductible: [''],
      ContingentLiability_Limit: [''],
      ContingentLiability_Deductible: [''],
      Contingent_XS_Limit: [''],
      Contingent_XS_Deductible: [''],
      ExcessLiability_Limit: [''],
      ExcessLiablity_Deductible: [''],
      NonTrucking_Limit: [''],
      NonTrucking_Deductible: [''],
      TowingLimit_Limit: [''],
      TowingLimit_Deductible: [''],
      MTC_Theft_of_Electronic:[''],
      Trailer_Interchange_Deductible:[''],
       UninsuredMotorist:[''],
      UnderinsuredMotorist:[''],
      TIV:[''],
    });
  }

  getDetails() {
  this.http.getAllDataByThreId(ApiUrl.getDetailsOfDataOfVehicle, this.accountId, this.MarkedPolicyId, this.ChildPolicyID).subscribe({
    next: (res: any) => {
      this.showSpinner = false;
      this.listOfRemarks = res?.Detail || [];

      if (this.listOfRemarks.length > 0) {
        const latestRemark = this.listOfRemarks[this.listOfRemarks.length - 1];
        this.addEditRemarksForm.reset(); // Clear old values
        this.patchForm(latestRemark);
      }

      // Set TIV from Detail (outside listOfRemarks)
      const tivValue = res?.Detail?.TotalVehicleValueVINSeventeen ?? '';
      this.addEditRemarksForm.patchValue({ TIV: tivValue });
    },
    error: (err) => {
      console.error('Failed to fetch remarks:', err);
      this.showSpinner = false;
    }
  });
}


  getListOfRemarks() {
    this.showSpinner = true;

    this.http.getAllDataId(ApiUrl.getRemarksById, this.accountId).subscribe({
      next: (res: any) => {
        this.showSpinner =false
        this.listOfRemarks = res?.Brokers || [];

        if (this.listOfRemarks.length > 0) {
          const latestRemark = this.listOfRemarks[this.listOfRemarks.length - 1];
          this.addEditRemarksForm.reset(); // Clear old values
          this.patchForm(latestRemark);
        }

        this.showSpinner = false;
      },
      error: (err) => {
        console.error('Failed to fetch remarks:', err);
        this.showSpinner = false;
      }
    });
  }
formatCoverage(controlName: string, prefix: string) {
  const control = this.addEditRemarksForm.get(controlName);
  if (!control) return;

  let value = (control.value || '').toString().trim();

  if (!value) {
    control.setValue('');
    return;
  }

  // Already formatted
  if (value.startsWith(prefix)) {
    return;
  }

  // Keep custom text (e.g. "See Proposal")
  if (!/^[\d$,]+$/.test(value)) {
    return;
  }

  // Remove "$" and commas
  const numericValue = value.replace(/\$/g, '').replace(/,/g, '');

  if (!isNaN(Number(numericValue))) {
    control.setValue(
      `${prefix} $${Number(numericValue).toLocaleString('en-US')}`
    );
  }
}
  saveRemarks() {
   
    if (this.addEditRemarksForm.invalid) return;

    this.showSpinner = true;

    const formData = {
      ...this.addEditRemarksForm.value,
      AccountId: this.accountId,
      ChildPolicyID:this.ChildPolicyID
    };

    this.http.addEditFormData(ApiUrl.addEditRemakrs, formData).subscribe({
      next: (res) => {
           this.toastr.success('Data Dave', 'Done' ,{
      timeOut: 3000,
    });
        this.getListOfRemarks(); // Reload latest data
      },
      error: (err) => {
        alert('Error saving remarks');
        console.error(err);
        this.showSpinner = false;
      }
    });
  }

  patchForm(data: any) {
    this.addEditRemarksForm.patchValue(data);
  }
}
