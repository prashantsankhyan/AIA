import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiUrl } from '../../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';

@Component({
  selector: 'app-add-vehicle-by-info',
  standalone: true,
   imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-vehicle-by-info.component.html',
  styleUrl: './add-vehicle-by-info.component.scss'
})
export class AddVehicleByInfoComponent {
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
    Year:any
    Make:any;
    BodyType:any;
    errorMesssgeVehicleInformation:any;
    alertMessageVehicleInformation:any;
    submitcheckRequest = true;
    showAccountDetail:any =[];
    showButtonOnUpdateTime =false
   
   
  
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddVehicleByInfoComponent>){
   
    }
    ngOnInit(): void {
     let response = JSON.stringify(this.data)
     let info = JSON.parse(response)
    
    
     this.Year = info.Year;
      this.VIN = info.VIN;
      this.Make = info.Make;
      this.Model = info.Model;
      this.BodyType = info.BodyType?.split(' ').pop();
    
     this.userName = sessionStorage.getItem('UserName')
      this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
      this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
      this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
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
        Year:[this.Year],
        Make:[this.Make],
        Model:[''],
        BodyType:[this.BodyType],
        Camera:[''],
        TeleMatic:[''],
        VIN:[this.VIN],
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
     
      this.addEditVehicleForm.controls['UpdatedBy'].setValue(this.userName)
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
  
   
  
  
    
  
  
    

}
