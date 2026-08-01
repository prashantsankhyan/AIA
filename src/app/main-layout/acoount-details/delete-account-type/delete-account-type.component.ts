import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';

@Component({
  selector: 'app-delete-account-type',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './delete-account-type.component.html',
  styleUrl: './delete-account-type.component.scss'
})
export class DeleteAccountTypeComponent {
 showSpiner = true
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  AccountId ='';
  LoginUserName:any;
  dataResponse:any;
  userPermission:any;
  VehicleID ='';
  userName ='';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<DeleteAccountTypeComponent>,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.data;
    this.AccountId = this.data.AccountId;
  

    this.LoginUserName = sessionStorage.getItem('UserName');
    this.makeForm()
  }
  
  makeForm(){
    this.deleteForm = this.fb.group({
      AccountID:[this.AccountId],
      DeletedBy:[this.LoginUserName],
      DeletedByTeam:['Sale',],
      DeletedReason:['',[Validators.required,]],
      
    });
  }


  deleteRecord() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.deleteForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.deleteForm.value))

   if(this.AccountId){
    obj['AccountId'] = this.AccountId
  }

    this.http.addEditData(ApiUrl.deleteMainAccount,obj).pipe().subscribe(
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
