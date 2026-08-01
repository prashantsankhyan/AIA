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
  selector: 'app-update-marketed-status',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './update-marketed-status.component.html',
  styleUrl: './update-marketed-status.component.scss'
})
export class UpdateMarketedStatusComponent {
  MarkedPolicyID ='';
  alertMessage:any;
  dataResponse:any;
  responseType = true;
  showConfirmButton:boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService,public dialogRef: MatDialogRef<UpdateMarketedStatusComponent>) { }
  ngOnInit(): void {
    this.MarkedPolicyID =this.data.MarkedPolicyID;
  
   
   
  }
  upDateData(){
    this.showConfirmButton = false;
    this.http.upDateByPassParameter(ApiUrl.updateMarketedSatus,this.MarkedPolicyID,this.responseType).pipe().subscribe(
      data=>{
       
        let respone = JSON.stringify(data)
        let obj  = JSON.parse(respone)
      
       
        if(obj.Data.Response == '0'){
          this.showConfirmButton = false;
          this.toastr.success('Confirm', 'All Data Fill By Team' ,{
            timeOut: 1000,
          });
        
          
         
          this.onNoClick()
          this.changeLocation()
         
        
        }
       
        else{
           
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess()
          
         
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
