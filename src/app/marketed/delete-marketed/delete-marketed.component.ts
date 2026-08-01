import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';


@Component({
  selector: 'app-delete-marketed',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './delete-marketed.component.html',
  styleUrl: './delete-marketed.component.scss'
})
export class DeleteMarketedComponent {
  MarkedPolicyID ='';
  alertMessage:any;
  dataResponse:any;
  hideSaveButton = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteMarketedComponent>) { }
  ngOnInit(): void {
    this.MarkedPolicyID =this.data.MarkedPolicyID;
 
   
   
  }
  deleteData(){
    this.http.deleteById(ApiUrl.deleteMarkedPolicy,this.MarkedPolicyID).pipe().subscribe(
      data=>{
        let respone = JSON.stringify(data)
        let obj  = JSON.parse(respone)
      
       
        if(obj.Data.Response == '0'){
          this.showError()
        }
       
        else{
          this.hideSaveButton = !this.hideSaveButton;
        
         
          this.alertMessage = obj.Data.ErrorMessage;
         
        
          this.showSuccess()
           window.location.reload();
         
        }


      }
    )
  }


  showSuccess() {
    this.toastr.error(this.alertMessage, '' ,{
      timeOut: 1000,
    });
    
   
    this.onNoClick()
    this.changeLocation()
  
  }

  showError(){
    this.toastr.error(this.alertMessage, ' ', {
   timeOut: 1000,
  });
  }
  changeLocation() {
    this.alertMessage = true
   
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); 
    }); 
  }
  onNoClick(): void {
    this.dialogRef.close();
   
  }
}
