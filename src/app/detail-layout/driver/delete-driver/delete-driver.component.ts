import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.scss'
})
export class DeleteDriverComponent {
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  DriverID ='';
  driverName ='';
  userName:any;
  userPermission:any;
  EndorsementID :any
  ChildPolicyID:any;
  AccountID:any;
  ExpirationDate:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteDriverComponent>) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
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
    this.makeForm()
  
   
   
  }

  
  makeForm(){
    this.data;
    this.DriverID = this.data.DriverID;
    this.driverName = this.data.driverName;
    this.ChildPolicyID = this.data.ChildPolicyID
    this.AccountID = this.data.AccountID
    this.EndorsementID = this.data.EndorsementID
    this.deleteForm = this.fb.group({
    DriverID:[this.DriverID],
    UserName:[`${this.userName}\n${this.ExpirationDate}`],
    AccountID:[this.AccountID],
    ChildPolicyID:[this.ChildPolicyID],
    Reason:['',[Validators.required,]],
    EndorsementID:[this.EndorsementID]
    });
  }

  clickTimer(){
    this.messageSuccess = true;
    this.messageSuccess = true
  }
  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.deleteForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.deleteForm.value))

   if(this.DriverID){
    obj['DriverID'] = this.DriverID
  }

    this.http.deleteAddQuery(ApiUrl.deleteDriver,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
       
        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
         
        
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess();
          this.changeLocation();
          this.closeComponent()
        }
     
       
        console.log(obj)
        
      }
    
    )
  }
  




  deleteRecord(){
    this.closeComponent()
    this.http.delete(ApiUrl.deleteDriver,this.DriverID,this.driverName).subscribe(
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
  }


}
