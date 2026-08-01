import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-policy',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './delete-policy.component.html',
  styleUrl: './delete-policy.component.scss'
})
export class DeletePolicyComponent {
  showSpiner = true
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  ChildPolicyID ='';
  LoginUserName:any;
  dataResponse:any;
  userPermission:any;
  VehicleID ='';
  userName ='';
  setExpirationDate = new Date(); 
  ExpirationDate:any
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<DeletePolicyComponent>,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.data;
    this.ChildPolicyID = this.data.ChildPolicyID
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.makeForm()
    this.currentDate()
  }
  
  currentDate(){
    let dte = new Date(this.setExpirationDate)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.ExpirationDate  =month + "/" + day + "/" + year
  }
  makeForm(){
    this.deleteForm = this.fb.group({
      ChildPolicyID:[this.ChildPolicyID],
      UserName:[this.LoginUserName],
      DeleteReason:['',[Validators.required,]],
      ExpirationDate:[''],
      DeletedBy:[this.LoginUserName],
      
    });
  }

  deleteReasons: string[] = [
  'Cancelled - General',
  'cancelled - Insured Request',
  'Cancelled - Non Payment',
  'Cancellation - Pending',
  'Cancellation - Processed',
  'cancelled - Rewritten',
  'Entered in Error/Clean-up',
  'Policy Marketed',
  'New bussiness',
  'Non - Review',
  'Non - Renew of new business by company',
  'Non - Renew of new business by insured',
  'Non - Renew of renewal by company',
  'Non - Renew of renewal by insured',
  'New Bussiness Quote',
  'Policy Lapse - Autolapse',
  'Policy Lapse - Lost Business',
  'Policy Lapse - Rebroke',
  'Policy Lapse - Revoked',
  'Quote Not Taken',
  'Reinstatement',
  'Renewal',
  'Rewrite',
  'Database Synchronization',
  'Client review',
  'Under Review',
  'Non Paying',
  'It Self',
    'Policy Line Adjustment',
  'Unreported Driver',
  'Unreported Unit',
  'Hazmat Material',
  'Telematics Cameras /ELD',
  'Material Change Risk',
  'Team Driving'
];



  deleteRecord() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.deleteForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.deleteForm.value))

   if(this.ChildPolicyID){
    obj['ChildPolicyID'] = this.ChildPolicyID
  }

    this.http.addEditData(ApiUrl.deletePolicy,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
       
       
       
        if(this.dataResponse == '1'){
         
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess();
          this.changeLocation()
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage
          this.error()
        }
     
        this.closeModel()
        console.log(obj)
        
      }
    
    )
  }



  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
  }
  get f() {
    return this.deleteForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
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
    this.toastr.success('confirm', this.alertMessage ,{
      timeOut: 3000,
    });
    this.onNoClick()
  }

  showError() {
    this.toastr.error('Delete record  Successfully', '' ,{
      timeOut: 3000,
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
   
  }
}
