import { Component,  Inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../sharingModule/material/material.module';


import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditMarketdComponent } from '../../../marketed/add-edit-marketd/add-edit-marketd.component';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';
import { json } from 'stream/consumers';
import { AddEditDriverComponent } from '../../driver/add-edit-driver/add-edit-driver.component';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-edit-vehicle',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss'
})
export class AddEditVehicleComponent {
  showSpiner = true
  addEditVehicleForm!:FormGroup ;
  showHtml = true;
  showButtonOnTimer = false;
  saveOneClick = true
  
  submit = false ;
  accountId =''
  VehicleID =''
  alertMessage =''
  errorMessage ='';
  messageSuccess = true;
  userName:any;
  dataResponse:any;
  OwnerShipType ='';
  MarkedPolicyId:any;
  EndorsementID:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any;
  showSaveButtion = true;
  Model ='';
  VIN ='';
  errorMesssgeVehicleInformation:any;
  alertMessageVehicleInformation:any;
  submitcheckRequest = true;
  showAccountDetail:any =[];
  showButtonOnUpdateTime =false
 
 ExpirationDate:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditVehicleComponent>){
 
  }
  ngOnInit(): void {
   this.Model ='';
   this.VIN ='';
   this.userName = sessionStorage.getItem('UserName')
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
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
    this.EndorsementID = localStorage.getItem('EndorsementID')
  
   
    if(this.userName == null){
        this.router.navigate(['/login'])
        this.dialogRef.close();
    }
  
    if(this.EndorsementID == null){
      this.EndorsementID = '0'
    }
    else{
      this.EndorsementID = localStorage.getItem('EndorsementID')
    }
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
    if(this.IsChildPolicyExist == 'true'){
      this.showSaveButtion = false
    }
    else{
      this.showSaveButtion = true
    }
    this.makeForm();
    this.load()
   
  }

  makeForm(){
   
    this.addEditVehicleForm = this.fb.group({
      VehicleID:['0'],
      AccountID:[this.accountId,[Validators.required,]],
      MarkedPolicyID:[this.MarkedPolicyId,[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID,[Validators.required,]],
      EndorsementID:[this.EndorsementID],
      Year:[''],
      Make:[''],
      Model:[''],
      BodyType:[''],
      Camera:[''],
      TeleMatic:[''],
      VIN:[''],
      // VIN:['', [
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(17),
      // ],],
      OwnerShipType:[''],
      VehicleType:[''],
      Value:[''],
     
       EnteredBy: [`${this.userName}\n${this.ExpirationDate}`],
      UpdatedBy:['']
      
    });
  }

  changeOwnerShipType(){
    this.OwnerShipType
    
  }
  load(){
    this.VehicleID = this.data.VehicleID ;
    if(this.VehicleID == undefined) {

    }
    else {

      
    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
    this.submitcheckRequest = false;
     this.showButtonOnUpdateTime = true
    this.addEditVehicleForm.controls['VehicleID'].setValue(obj.VehicleID)
    this.addEditVehicleForm.controls['AccountID'].setValue(obj.AccountID)
   
    
    this.addEditVehicleForm.controls['MarkedPolicyID'].setValue(obj.MarkedPolicyID)
    this.addEditVehicleForm.controls['ChildPolicyID'].setValue(obj.ChildPolicyID)
    
    this.addEditVehicleForm.controls['EndorsementID'].setValue(this.EndorsementID)
    this.addEditVehicleForm.controls['Year'].setValue(obj.Year)
    this.addEditVehicleForm.controls['Make'].setValue(obj.Make)
    
    this.addEditVehicleForm.controls['TeleMatic'].setValue(obj.TeleMatic)
    this.addEditVehicleForm.controls['Camera'].setValue(obj.Camera)
    this.OwnerShipType =obj.OwnerShipType
 
    this.addEditVehicleForm.controls['OwnerShipType'].setValue(obj.OwnerShipType)

     
    this.Model =obj.Model;
  
    this.addEditVehicleForm.controls['Model'].setValue(this.Model)
    this.addEditVehicleForm.controls['BodyType'].setValue(obj.BodyType)
    this.VIN = obj.VIN
    this.addEditVehicleForm.controls['VIN'].setValue(this.VIN)
    this.addEditVehicleForm.controls['VehicleType'].setValue(obj.VehicleType)
    this.addEditVehicleForm.controls['Value'].setValue(obj.Value)
    // this.addEditVehicleForm.controls['Action'].setValue(obj.Action)
   
    // this.addEditVehicleForm.controls['Description'].setValue(obj.Description)
   
    this.userName = sessionStorage.getItem('UserName')
   
    this.addEditVehicleForm.controls['UpdatedBy'].setValue(
  `${this.userName}\n${this.ExpirationDate}`
);
   }
   
  }

  checkVehilceIsExistOrNot(){
   
    this.messageSuccess = false;
     if(this.VehicleID == undefined){
      this.Model = this.Model?.trim(); // Remove leading and trailing spaces
      this.VIN = this.VIN?.trim();
      if(this.Model ==='' ||this.VIN === ''){
        this.submitcheckRequest = true;
        this.messageSuccess = true;
        this.toastr.error('Please Enter Model and  Vin No','' ,{
          timeOut: 3000,
        });
      }
      else{
        this.messageSuccess = false
        this.submitcheckRequest = false
        this.http.getAllDataByTwoId(ApiUrl.isExistVehicle,this.Model,this.VIN).pipe(this.http.handleError()).subscribe((data:any)=>
          {
          this.messageSuccess = false
          let response  = JSON.stringify(data)
          let obj = JSON.parse(response)
          
          
           let resultResponse = obj.Response 
           this.errorMesssgeVehicleInformation = obj.ErrorMessage
           this.alertMessageVehicleInformation = obj.AlertMessage
         
           if( resultResponse ==0){
          
            this.showHtml = false;
            this.showButtonOnTimer = true
            this.showAccountDetail = obj.Accounts
            console.log(this.showAccountDetail)
    
            this.toastr.error(this.errorMesssgeVehicleInformation, '' ,{
              timeOut: 3000,
              
            });
            this.toastr.info(this.alertMessageVehicleInformation, '' ,{
              timeOut: 3000,
            });
            // this.messageSuccess = true;
  
           }
           else {
          
            this.onSubmit()
         
           }
       
        },
        (error: any) => {
          this.messageSuccess = true;
          this.changeLocation()
          // Fallback error handling here
          console.error('Subscribe caught:', error);
        }
      )
     
      }
    }
    else{
      this.messageSuccess = false;
      this.onSubmit()
    }
   
    
    
  
  }





  onSubmit() {
   this.submit = true ; 
   this.messageSuccess = false;
   this.saveOneClick = false
    if(!this.addEditVehicleForm.valid){
      this.messageSuccess = true;
      this.saveOneClick = true
      
      return
    }
    this.messageSuccess = false;
   let obj = JSON.parse(JSON.stringify(this.addEditVehicleForm.value))

   if(this.VehicleID){
    obj['VehicleID'] = this.VehicleID
  }

    this.http.addEditData(ApiUrl.addEditAllVehicle,obj).pipe(timeout(60000), // 1 minute timeout
    catchError((error) => {
      // Handle timeout or network errors here
      if (error.name === 'TimeoutError') {
        this.errorMessage = 'The request timed out. Please check your internet connection.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
      // this.showSpinner = false; // Hide the spinner
      this.error(); // Show error message
      return throwError(error); // Propagate the error
    })).subscribe(
      data => {
        
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
         

        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
          this.error();
          this.messageSuccess = true;
        
        }
        else{
          if(obj.Data.ErrorMessage == "Existing Record Updated Successfully"){
            this.alertMessage = obj.Data.ErrorMessage;;
            this.updateAlertMessage()
          }
          else{
            this.alertMessage =obj.Data.ErrorMessage;
            this.showSuccess()
            this.showHtml = true;
            let messgae = obj.Data.Renew_Fresh;
            this.Model ='';
            this.VIN ='';
            this.toastr.success(messgae, '' ,{
              timeOut: 3000,
            });
           
          }
          

          
        }
     
        // this.messageSuccess = true
        console.log(obj)
        
      }
    
    )
    // this.messageSuccess = true;
  }


  conFirmSaveFunction(){
    this.onSubmit()
  }


  cancletoSave(){
    // this.showHtml = true
    this.submitcheckRequest = true;
    this.showButtonOnTimer = false

  }






  updateAlertMessage(){
    this.cancleModel()
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    
    this.changeLocation()

  }

  showSuccess() {
    this.cancleModel()
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.messageSuccess = true
 
    this.changeLocation()
    
  } 

  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    
  }
  get f() {
    return this.addEditVehicleForm.controls;
    
  }

  cancleModel(): void {
    this.dialogRef.close();
    this.changeLocation()
   
  }
  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }


  clear(){
    this.addEditVehicleForm = this.fb.group({
      VehicleID:['0'],
      AccountID:[this.accountId,[Validators.required,]],
      MarkedPolicyID:[this.MarkedPolicyId,[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID,[Validators.required,]],
      EndorsementID:[this.EndorsementID],
      Year:[''],
      Make:[''],
      Model:[''],
      BodyType:[''],
      VIN:[''],
      // VIN:['', [
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(17),
      // ],],
      OwnerShipType:[''],
      VehicleType:[''],
      Value:[''],
     
      EnteredBy:[this.userName],
      UpdatedBy:['']
      
    });
  }

 


  


  nextToDriver() {
    this.dialogRef.close();
    this.router.navigate(['/detailLayout/driver'])
   let DriverID =undefined;
    const dialogRef = this.dialog.open(AddEditDriverComponent, {
      width: '800px',
      height: '500px',
      data :{DriverID:DriverID,}
     
      
    });
  
    
  }
}
