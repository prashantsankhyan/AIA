import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-open-claim-status',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './open-claim-status.component.html',
  styleUrl: './open-claim-status.component.scss'
})
export class OpenClaimStatusComponent {
   showSpiner = true
    updateForm!:FormGroup ;
    submit = false ;
    alertMessage ='';
    errorMessage ='';
    messageSuccess = true;
  
    claimId:any;
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialogRef: MatDialogRef<OpenClaimStatusComponent>){}
   
    ngOnInit(): void {
      this.data
      this.claimId = this.data.ClaimID
     this.makeForm()
     
     }
  
  
     makeForm(){
      this.updateForm = this.fb.group({
        claimId:[this.claimId],
        claimStatus:['' ,[Validators.required,]],
      
        
      });
    }
  
  onSubmit() {
  this.submit = true; 
  this.messageSuccess = false;

  if (!this.updateForm.valid) {
    this.messageSuccess = true;
    return;
  }

  let obj = { ...this.updateForm.value };

  if (this.claimId) {
    obj['claimId'] = this.claimId;
  }

  this.http.addEditData(ApiUrl.updateClaimStats, obj).subscribe(
    (data: any) => {

      let response = JSON.stringify(data)
      let obj  = JSON.parse(response)
     
     

      if (obj.Data.Response === 1) {
        // Success
        this.alertMessage = data.ErrorMessage || 'Record updated successfully!';
       this.toastr.success(this.alertMessage, '' ,{
        timeOut: 3000,
      });
      this.changeLocation()
    
       
      } else {
        // Failure
        this.alertMessage = data.ErrorMessage || 'Error occurred!';
        
      }
    },
    (error) => {
      this.alertMessage = 'Something went wrong!';
    
    }
  );
}

    

    showSuccess() {
      this.toastr.success(this.alertMessage, '' ,{
        timeOut: 3000,
      });
     this.closeModel()
   
    } 
  
    error() {
      this.toastr.error(this.errorMessage, '' ,{
        timeOut: 3000,
      });
    }
    get f() {
      return this.updateForm.controls;
      
    }
  
    closeModel(): void {
      this.dialogRef.close();
     
    }
  
    changeLocation() {
this.closeModel()
    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/_claimsData']); // navigate to same route
    }); 
  }

  
}
