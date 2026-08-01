import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';

@Component({
  selector: 'app-detete-broker',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,],
  templateUrl: './detete-broker.component.html',
  styleUrl: './detete-broker.component.scss'
})
export class DeteteBrokerComponent {
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  BrokerID ='';
  LoginUserName:any;
  dataResponse:any;
  userPermission:any;
  VehicleID ='';
  userName ='';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<DeteteBrokerComponent>,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.data;
    this.BrokerID = this.data.BrokerID
    this.LoginUserName = sessionStorage.getItem('UserName');
  }
  

  
  

  deleteRecord(){
    
    this.http.deleteById(ApiUrl.deleteBroker,this.BrokerID).subscribe(
      data=> {
        let response = JSON.stringify(data)
        this.changeLocation()
       
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
    this.toastr.success('error in delete', '' ,{
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
