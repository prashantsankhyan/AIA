
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-delete-vehicle',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './delete-vehicle.component.html',
  styleUrl: './delete-vehicle.component.scss'
})
export class DeleteVehicleComponent {
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  userPermission:any;
  EndorsementID:any
  VehicleID ='';
  userName:any;
  ChildPolicyID:any;
  AccountID:any;
 ExpirationDate:any;
 isManualReason = false;
manualReason = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<DeleteVehicleComponent>){
 
  }
  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
    if(this.userName == null){
      this.router.navigate(['/login'])
      this.dialogRef.close();
  }
    this.makeForm()
  }
onReasonChange(): void {

  const reason = this.deleteForm.get('Reason')?.value;

  if (reason === 'None of These') {
    this.isManualReason = true;
    this.manualReason = '';
  } else {
    this.isManualReason = false;
    this.manualReason = '';
  }
}
setManualReason(): void {

  if (this.isManualReason && this.manualReason.trim()) {

    this.deleteForm.patchValue({
      Reason: this.manualReason.trim()
    });

  }
}
  makeForm(){
    this.data;
    this.data;
    this.VehicleID = this.data.VehicleID;
  
    this.EndorsementID = this.data.EndorsementID
    this.ChildPolicyID = this.data.ChildPolicyID
    this.AccountID = this.data.AccountID

  this.ExpirationDate = localStorage.getItem('ExpirationDate');

if (this.ExpirationDate) {
  const date = new Date(this.ExpirationDate);

  this.ExpirationDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
} else {
  this.ExpirationDate = '';
}
    
    this.deleteForm = this.fb.group({
      VehicleID:[this.VehicleID],
      UserName:[`${this.userName}\n${this.ExpirationDate}`],
      AccountID:[this.AccountID],
      ChildPolicyID:[this.ChildPolicyID],
      Reason:['',[Validators.required,]],
      EndorsementID:[this.EndorsementID]
     
    });
  }
 onSubmit() {

  this.messageSuccess = false;
  this.submit = true;

  if (!this.deleteForm.valid) {
    this.messageSuccess = true;
    return;
  }

  const selectedReason = this.deleteForm.get('Reason')?.value;

  // None of These selected
  if (selectedReason === 'None of These') {

    if (!this.manualReason.trim()) {
      this.toastr.error('Please enter a reason', '');
      this.messageSuccess = true;
      return;
    }

    // Replace None of These with manual reason
    this.deleteForm.patchValue({
      Reason: this.manualReason.trim()
    });
  }

  // Now Reason contains only final value
  let obj = JSON.parse(
    JSON.stringify(this.deleteForm.value)
  );

  console.log('Final Reason:', obj.Reason);

  if (this.VehicleID) {
    obj.VehicleID = this.VehicleID;
  }

this.http.deleteAddQuery(ApiUrl.deleteVehicle, obj)
  .subscribe({
    next: (data: any) => {

      console.log('Delete Response:', data);

      if (data?.Data?.Response === 1) {

        this.toastr.success(
          data.Data.ErrorMessage || 'Record Delete Successfully',
          ''
        );

        // Close dialog and tell parent that record was deleted
        this.dialogRef.close({
          deleted: true,
          VehicleID: this.VehicleID
        });

      } else {

        this.toastr.error(
          data?.Data?.ErrorMessage || 'Unable to delete record',
          ''
        );

      }
    },

    error: (error) => {

      console.error('Delete error:', error);

      this.toastr.error(
        'Something went wrong while deleting record',
        ''
      );
    }
  });
}

  deleteRecord(){
    this.closeComponent()
    this.http.delete(ApiUrl.deleteVehicle,this.VehicleID,this.userName).subscribe(
      data=> {
       
        this.changeLocation()
        let response = JSON.stringify(data)
        this.showSuccess()
        
      }
    )
  }

  
  closeComponent(): void {
    this.dialogRef.close();
  }


  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }


  showSuccess() {
    this.toastr.success('Delete record  Successfully', '' ,{
      timeOut: 3000,
    });
    this.closeComponent()
  }

}
