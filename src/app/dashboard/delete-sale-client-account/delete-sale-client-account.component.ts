import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-delete-sale-client-account',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './delete-sale-client-account.component.html',
  styleUrl: './delete-sale-client-account.component.scss'
})
export class DeleteSaleClientAccountComponent {
  AccountID ='';
  showSpiner = true;
  submit = false ;
  alertMessage =''
  addEditPolicyForm!:FormGroup;
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  DeletedBy:any;
  DeletedByTeam :any
  userName:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService, public dialogRef: MatDialogRef<DeleteSaleClientAccountComponent>,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.DeletedBy = sessionStorage.getItem('UserName')
    let data = this.data ;
    
    this.AccountID = data.AccountID;
    this.makeForm()
  }
  makeForm(){
   
    this.addEditPolicyForm = this.fb.group({
      DeletedBy:[this.DeletedBy],
      AccountID:[this.AccountID],
      DeletedByTeam:['Sale Team'],
      DeletedReason:['' ,[Validators.required]],
      
      
      
    });
  }




  

  
  onSubmit() {
    this.submit = true ; 
   this.messageSuccess = false;
    if(!this.addEditPolicyForm.valid){
      this.messageSuccess= true
      
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditPolicyForm.value))

   

    this.http.addEditData(ApiUrl.detelAccount,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);

        if(obj.Data.Response =='1'){
          this.alertMessage =obj.Data.ErrorMessage;
          this.showSuccess()

        }


        
       
       
       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
    this.closeModel()
  }

  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

  get f() {
    return this.addEditPolicyForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }
}
