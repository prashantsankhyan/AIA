
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
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

  makeForm(){
    this.data;
    this.data;
    this.VehicleID = this.data.VehicleID;
    this.userName = this.data.VehicleType
    this.EndorsementID = this.data.EndorsementID
    
    this.deleteForm = this.fb.group({
      VehicleID:[this.VehicleID],
      UserName:[this.userName],
      Reason:['',[Validators.required,]],
        EndorsementID:[this.EndorsementID]
     
    });
  }
  onSubmit() {
    this.messageSuccess = false;
    this.submit = true ; 
    
    if(!this.deleteForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.deleteForm.value))

   if(this.VehicleID){
    obj['VehicleID'] = this.VehicleID
  }

    this.http.deleteAddQuery(ApiUrl.deleteVehicle,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data;
       
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
