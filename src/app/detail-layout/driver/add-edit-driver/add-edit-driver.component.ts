import { ChangeDetectorRef, Component,  Inject, OnInit  } from '@angular/core';
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
import { dateValidator } from '../validator';
import { AddEditRemarksComponent } from '../../remarks/add-edit-remarks/add-edit-remarks.component';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-add-edit-driver',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './add-edit-driver.component.html',
  styleUrl: './add-edit-driver.component.scss'
})
export class AddEditDriverComponent {
  showSpiner = true
  addEditMarkedForm!:FormGroup ;
  submit = false ;
  showHtml = true;
  confirmToSaveExtraDate = true;
  showButtonOnTimer = false
  accountId =''
  DriverID =''
  alertMessage ='';
  AuthType ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  OwnerShipType ='';
  MarkedPolicyId:any;
  EndorsementID:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any;
  DateofBirth = new Date('MM/dd/YYYY')
  DateofAdded = new Date('MM/dd/YYYY');
  MailReceived = new Date('MM/dd/YYYY');
  EffectiveDate = new Date('MM/dd/YYYY');
  YearofLicenceIssued = new Date('MM/dd/YYYY');
  showSaveButtion = true;
  DriverName='';
  DriverLicenceNo='';
  submitcheckRequest = true;
  showAccountDetail:any =[];
  showButtonOnUpdateTime =false;
  errorMesssgeVehicleInformation:any;
  alertMessageVehicleInformation:any;
  userName:any;
  DriverStage: string = '';  // Store selected value
  hideDateOfHire = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,private cdRef: ChangeDetectorRef,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditDriverComponent>){
 
  }
  ngOnInit(): void {
    
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')

    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    this.EndorsementID = localStorage.getItem('EndorsementID')
    this.userName = sessionStorage.getItem('UserName')
    
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

 
  changeDate(event: any): void {
    const selectedValue = event.target.value;
    console.log('Selected Driver Stage:', selectedValue);
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    // Example: clear or enable date input
    if (selectedValue === 'MM/dd/yyyy' || datePattern.test(selectedValue)) {
      this.DriverStage
      this.hideDateOfHire = true;
      // Do something like: this.showDateInput = true;
    } else {
      this.hideDateOfHire = false;
      // this.showDateInput = false;
    }
  }

 
  normalizeForRadio(value: string): string {
  if (!value) return '';

  const normalized = value.trim().toLowerCase();

  if (['authorize', 'authorized', 'Authorized'].includes(normalized)) {
    return 'authorize';
  }

  if (['non-authorize', 'Non-Authorized', 'Non-authorized', 'Non-Authorize',  'Un-Authorize', 'Un-Authorized','un-authorize','nonauthorize','unauthorize','unauthorized','Unauthorized','unauthorize'].includes(normalized)) {
    return 'non-authorize';
  }

  return '';
}
  
  makeForm(){
    this.addEditMarkedForm = this.fb.group({
      DriverID:['0'],
      AccountID:[this.accountId ,[Validators.required,]],
      MarkedPolicyID:[this.MarkedPolicyId],
      ChildPolicyID:[this.ChildPolicyID],
      DriverName:[''],
      AuthType:[''],
      YearofLicenceIssued: ['', [Validators.required, dateValidator()]],
      DateofBirth:['',[Validators.required, this.dateValidator]],
      StateLicenced:['',[Validators.required,]],
      DateofAdded:['',],
      DriverStage:[''],
      EndorsementID:[this.EndorsementID],
      DriverLicenceNo:[''],
      Action:[''],
      Description:[''],
      MailReceived:[''],
      DriverType:[''],
      
      Gender:[''],
      MartialStatus:[''],
      EffectiveDate:[''],
      EnteredBy:[this.userName],
      UpdatedBy:[''],
    });
  }
  load(){
    let data = this.data ;
    
    
    this.DriverID = data.DriverID ;
   
    
  
    if(this.DriverID == undefined) {

    }
   else {
    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
    this.submitcheckRequest = false;
    this.showButtonOnUpdateTime = true

    this.addEditMarkedForm.controls['DriverID'].setValue(obj.DriverID)
    this.addEditMarkedForm.controls['AccountID'].setValue(obj.AccountID)
    this.addEditMarkedForm.controls['MarkedPolicyID'].setValue(obj.MarkedPolicyID)
    this.addEditMarkedForm.controls['ChildPolicyID'].setValue(obj.ChildPolicyID)
    this.AuthType = this.normalizeForRadio(obj.AuthType);
   
    
    this.addEditMarkedForm.controls['AuthType'].setValue(this.AuthType)
    this.DriverName = obj.DriverName
    
    this.addEditMarkedForm.controls['DriverName'].setValue(this.DriverName)
    let YearofLicenceIssued = new Date(obj.YearofLicenceIssued);
    let month = (YearofLicenceIssued.getUTCMonth() + 1).toString().padStart(2, '0'); // months from 01-12
    let day = YearofLicenceIssued.getUTCDate().toString().padStart(2, '0');
    let year = YearofLicenceIssued.getUTCFullYear();
    
    let licenceIssued = month + "/" + day + "/" + year;
    this.addEditMarkedForm.controls['YearofLicenceIssued'].setValue(licenceIssued);
    
    let dte = new Date(obj.DateofBirth);
    month = (dte.getUTCMonth() + 1).toString().padStart(2, '0'); // months from 01-12
    day = dte.getUTCDate().toString().padStart(2, '0');
    year = dte.getUTCFullYear();
    
    let dateOfBirth = month + "/" + day + "/" + year;
    this.addEditMarkedForm.controls['DateofBirth'].setValue(dateOfBirth);
    this.DriverLicenceNo =obj.DriverLicenceNo
    this.addEditMarkedForm.controls['DriverLicenceNo'].setValue(this.DriverLicenceNo)
    this.addEditMarkedForm.controls['EndorsementID'].setValue(this.EndorsementID)
   
    
    this.addEditMarkedForm.controls['StateLicenced'].setValue(obj.StateLicenced)
    this.DateofAdded = obj.DateofAdded ;
    this.DateofAdded = new Date(this.DateofAdded)
    this.addEditMarkedForm.controls['DateofAdded'].setValue(obj.DateofAdded)
   
   

    this.addEditMarkedForm.controls['MailReceived'].setValue(obj.MailReceived)
    this.addEditMarkedForm.controls['Action'].setValue(obj.Action)
    this.addEditMarkedForm.controls['Gender'].setValue(obj.Gender)
    this.addEditMarkedForm.controls['MartialStatus'].setValue(obj.MartialStatus)
    let DriverType = obj.DriverType;
   
    
    this.addEditMarkedForm.controls['DriverType'].setValue(obj.DriverType)
    this.DriverStage =obj.DriverStage
   
    if (['Blank','Appointed', 'Excluded', 'Pending'].includes(this.DriverStage)) {
      this.hideDateOfHire = false;
    } else {
      this.hideDateOfHire = true;
    }
    this.addEditMarkedForm.controls['DriverStage'].setValue(this.DriverStage)
    
    this.addEditMarkedForm.controls['Description'].setValue(obj.Description)
     this.EffectiveDate = obj.EffectiveDate;
   
   
    this.EffectiveDate = new Date(this.EffectiveDate);
   
    
    this.addEditMarkedForm.controls['EffectiveDate'].setValue(this.EffectiveDate)
    this.addEditMarkedForm.controls['UpdatedBy'].setValue(this.userName)
   }
   
  }

  checkVehilceIsExistOrNot(){
    this.messageSuccess = false;
    if(this.DriverID ==undefined){
      this.DriverName = this.DriverName?.trim(); // Remove leading and trailing spaces
      this.DriverLicenceNo = this.DriverLicenceNo?.trim();
     
      if(this.DriverName ==='' ||this.DriverLicenceNo === ''||this.isDefaultDate(this.f['YearofLicenceIssued'].value)){
       this.submitcheckRequest = true;
       this.messageSuccess = true
       this.toastr.error('Please Enter Driver and  Lincence No','' ,{
         timeOut: 3000,
       });
     }
     else{
      this.messageSuccess = false
       this.submitcheckRequest = false;
       this.messageSuccess = false;
      this.submitcheckRequest = false;

      let slowNetworkTimeout = setTimeout(() => {
        this.toastr.warning('Network seems slow. This may take a while...', '', {
          timeOut: 5000,
        });
      }, 35000); // Show warning if response takes more than 3 seconds

       this.http.getAllDataByTwoId(ApiUrl.isExistDriver,this.DriverName,this.DriverLicenceNo).pipe(this.http.handleError()).subscribe((data:any)=>
        {
          clearTimeout(slowNetworkTimeout);
        this.messageSuccess = false
        let response  = JSON.stringify(data)
         let obj = JSON.parse(response)
         
          let resultResponse = obj.Response 
          this.errorMesssgeVehicleInformation = obj.ErrorMessage
          this.alertMessageVehicleInformation = obj.AlertMessage
   
          if( resultResponse ==0){
           this.showHtml = false;
           this.showButtonOnTimer = true
           this.showButtonOnTimer = true
           this.showAccountDetail = obj.Accounts
           console.log(this.showAccountDetail)
   
           this.toastr.error(this.errorMesssgeVehicleInformation, '' ,{
             timeOut: 3000,
           });
           this.toastr.info(this.alertMessageVehicleInformation, '' ,{
             timeOut: 3000,
           });
          this.messageSuccess = true;
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

  autoFillDateOfBirthDate(inputValue: string): void {
    if (inputValue && /^\d{4}$/.test(inputValue)) {
      // If the user enters only a year
      const fullDate = `01/01/${inputValue}`;
      this.addEditMarkedForm.get('DateofBirth')?.setValue(fullDate);
    }
  }
 autoFDriverStage(inputValue: string): void {
  let fullDate = '';

  // Case: MMDDYYYY e.g. 01012025
  if (/^(\d{2})(\d{2})(\d{4})$/.test(inputValue)) {
    const month = inputValue.slice(0, 2);
    const day = inputValue.slice(2, 4);
    const year = inputValue.slice(4, 8);
    fullDate = `${month}/${day}/${year}`;
  } 
  // Case: YYYY only
  else if (/^\d{4}$/.test(inputValue)) {
    fullDate = `01/01/${inputValue}`;
  } 
  // Case: Short or full MM/DD/YYYY or M/D/YYYY
  else if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(inputValue)) {
    const match = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      const year = match[3];
      fullDate = `${month}/${day}/${year}`;
    }
  }

  // Set the result
  this.DriverStage = fullDate || '';
}



  autoDateOfBirth(inputValue: string): void {
  let fullDate = '';

  // Match MMDDYYYY like 01012025
  if (/^(\d{2})(\d{2})(\d{4})$/.test(inputValue)) {
    const month = inputValue.slice(0, 2);
    const day = inputValue.slice(2, 4);
    const year = inputValue.slice(4, 8);
    fullDate = `${month}/${day}/${year}`;
  } 
  // Match year only
  else if (/^\d{4}$/.test(inputValue)) {
    fullDate = `01/01/${inputValue}`;
  } 
  // Match short date like 1/1/2025 or 01/01/2025
  else if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(inputValue)) {
    const match = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      const year = match[3];
      fullDate = `${month}/${day}/${year}`;
    }
  }

  // Update form control
  this.addEditMarkedForm.get('DateofBirth')?.setValue(fullDate || '');
}


  

  
  autoFillYearOfLicenceIssuedDate(inputValue: string): void {
  let fullDate = '';

  // MMDDYYYY e.g. 01012025
  if (/^(\d{2})(\d{2})(\d{4})$/.test(inputValue)) {
    const month = inputValue.slice(0, 2);
    const day = inputValue.slice(2, 4);
    const year = inputValue.slice(4, 8);
    fullDate = `${month}/${day}/${year}`;
  }
  // Only year e.g. 2025
  else if (/^\d{4}$/.test(inputValue)) {
    fullDate = `01/01/${inputValue}`;
  }
  // Short or full MM/DD/YYYY or M/D/YYYY
  else if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(inputValue)) {
    const match = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      const year = match[3];
      fullDate = `${month}/${day}/${year}`;
    }
  }

  // Update form control with normalized date or clear if invalid
  this.addEditMarkedForm.get('YearofLicenceIssued')?.setValue(fullDate || '');
}

  

  dateValidator(control: any) {
    // Custom validator to check if the input is a valid date
    const value = control.value;
    if (value && isNaN(Date.parse(value))) {
      return { invalidDate: true };
    }
    return null;
  }
  isDefaultDate(value: string): boolean {
    return value === 'MM/dd/YYYY';
  }

  defaultDateValidator(control:any) {
    return control.value === 'MM/dd/YYYY' ? { invalidDate: true } : null;
  }


  
  onSubmit() {
    this.submit = true ; 
   this.messageSuccess = false;
   this.confirmToSaveExtraDate = false
    if(!this.addEditMarkedForm.valid){
      this.messageSuccess = true
      this.submitcheckRequest = true
      return
    }

   let obj = JSON.parse(JSON.stringify(this.addEditMarkedForm.value))

   if(this.DriverID){
    obj['DriverID'] = this.DriverID
  }

 


    this.http.addEditData(ApiUrl.addEditDriver,obj).pipe(timeout(60000), // 1 minute timeout
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
          this.submitcheckRequest = true
          this.errorMessage = obj.Data.ErrorMessage
          this.error()
        
        }
        else{
          if(obj.Data.ErrorMessage == "Existing Record Updated Successfully"){
            this.alertMessage = obj.Data.ErrorMessage;;
            this.updateAlertMessage()
            
          }
          else{
            this.alertMessage =obj.Data.ErrorMessage;
            this.showSuccess()
            
            let messgae = obj.Data.Renew_Fresh;
            this.addEditMarkedForm.reset();
            this.showHtml = true;
            
            this.submitcheckRequest = true
            this.toastr.success(messgae, '' ,{
              timeOut: 3000,
            });
            
           
          }
          

          
        }
     
       
        console.log(obj)
        
      }
    
    )
  }
  cancletoSave(){
   
    this.messageSuccess = true
   
  

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
   
    // this.changeLocation()
    
  } 

  error() {
    
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    
  }
  get f() {
    return this.addEditMarkedForm.controls;
    
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
    
    this.addEditMarkedForm.reset();
    this.addEditMarkedForm.markAsPristine();
    this.addEditMarkedForm.markAsUntouched();
    this.addEditMarkedForm.updateValueAndValidity();
 
    this.addEditMarkedForm.controls['AuthType'].setValue('');
    this.addEditMarkedForm.controls['DriverName'].setValue('');
   this.addEditMarkedForm.controls['DriverLicenceNo'].setValue('');
    this.cdRef.detectChanges();
    
  }
  nextToRemarks() {
    this.dialogRef.close();
    this.router.navigate(['/detailLayout/remarks'])
   let RemarkID =undefined;
    const dialogRef = this.dialog.open(AddEditRemarksComponent, {
      width: '600px',
      height: '460px',
      data :{RemarkID:RemarkID,}
     
      
    });
  }
 
}
