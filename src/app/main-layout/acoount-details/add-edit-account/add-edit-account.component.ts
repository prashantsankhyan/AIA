import { Component,  Inject, OnInit  } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditMarketdComponent } from '../../../marketed/add-edit-marketd/add-edit-marketd.component';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../spinner/spinner.component';

@Component({
  selector: 'app-add-edit-account',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule, SpinnerComponent],
  templateUrl: './add-edit-account.component.html',
  styleUrl: './add-edit-account.component.scss'
})
export class AddEditAccountComponent {
  showSpiner = true;
  submit = false ;
  messageSuccess = true;
  accountDetailForm!:FormGroup ;
  AccountID ='';
  accountName ='';
  alertMessage:any;
  listOfAccount:any =[];
  listOfDataById:any =[];
  userName:any;
  EffectiveDate ='';
  AccountType ='Prospective';
  Radius ='';
  currentDate = new Date();
  contactData:any =[];
  LookUpCode='';
  patchValueFormLookCode={}
  parsedData:any;
 Name ='';
 PhoneNo ='';
showSpinerDataUpload = true


constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditAccountComponent>){
 
}
ngOnInit(): void { 
 this.AccountID = this.data.AccountId;
 
 this.userName = sessionStorage.getItem('UserName')

 
   
 if(this.userName == null){
   this.router.navigate(['/login'])
   this.dialogRef.close();
}
  this.getAllData()
  this.makeForm();
  this.getDataByAccountId()
  this.clearLocalStorageValue()
  
  

 
}

changeEffectiveDate(selectedValue: string) {
  console.log(selectedValue); // Use the value as needed
  // If you need to do something based on the selected value, you can use it here.
  if(selectedValue === "New Vature") {
    this.EffectiveDate ='New Vature'
    
      // Handle the "Enter Date" selection
  } else  {
    this.EffectiveDate =selectedValue
   
      // Handle the "New Vature" selection
  }
}

changeAccountype(){
  this.AccountType = 'Client'
}





loadContactInfo(): void {
  this.showSpinerDataUpload = false;
  const lookUpCodeValue = this.accountDetailForm.get('LookUpCode')?.value;

  if (!lookUpCodeValue) {
    console.error('LookUpCode is not set');
    return;
  }

 
  this.LookUpCode = lookUpCodeValue;

  this.http.getAllDataId(ApiUrl.getDataByDot, this.LookUpCode).subscribe(data => {
    this.parsedData = JSON.parse(data);  // <- this is necessary
    this.Name = this.parsedData.CompanyRep1
     this.PhoneNo = this.parsedData.CellPhone
    
      this.accountDetailForm.patchValue({
        
        AccountName: this.parsedData.LegalName || '',
        MC: this.parsedData.DocketNo1?.replace(/^MC/i, '') || '',
        EmailID: this.parsedData.EmailAddress || '',
        PhoneNumber: this.parsedData.Phone || '',
        BDA: this.parsedData.DbaName || '',
        FaxNo: this.parsedData.Fax || '',
        Description: this.parsedData.MailAddress || '',
        State: this.parsedData.MailState || '',
        City: this.parsedData.MailCity || '',
        ZIP: this.parsedData.MailZip || '',
        GaragingAddress: this.parsedData.PhyAddress || '',
        GaragingState: this.parsedData.PhyState || '',
        GaragingCity:this.parsedData.PhyCity || '',
        GaragingPinCode:this.parsedData.PhyZip || '',
      });
      this.showSpinerDataUpload = true
      

      
      // alert(this.patchValueFormLookCode)
  })
  


     
   
}








getDataByAccountId(){
   
  if(this.AccountID == '0') {
   
    this.showSpiner = false;
   console.log('no data found')
  }
  else{

    this.showSpiner = true;
   
  

    this.http.getAllDataId(ApiUrl.getAllAccountById,this.AccountID).subscribe(data=>{
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
    
      this.listOfDataById = obj.Accounts;  

      this.AccountID =  this.listOfDataById[0].AccountID
     
      this.accountDetailForm.controls['AccountID'].setValue(this.AccountID);
      this.accountDetailForm.controls['AccountName'].setValue(this.listOfDataById[0].AccountName)
      this.AccountType  = this.listOfDataById[0].AccountType
      
      
      this.accountDetailForm.controls['AccountType'].setValue(this.AccountType)
      this.LookUpCode = this.listOfDataById[0].LookUpCode


      
      this.accountDetailForm.controls['LookUpCode'].setValue(this.LookUpCode)
      this.accountDetailForm.controls['BDA'].setValue(this.listOfDataById[0].BDA)
      this.accountDetailForm.controls['AccountSource'].setValue(this.listOfDataById[0].AccountSource)
      this.accountDetailForm.controls['BusinessType'].setValue(this.listOfDataById[0].BusinessType)
      this.accountDetailForm.controls['PhoneNumber'].setValue(this.listOfDataById[0].PhoneNumber)
      this.accountDetailForm.controls['EmailID'].setValue(this.listOfDataById[0].EmailID)
      this.accountDetailForm.controls['Description'].setValue(this.listOfDataById[0].Description)
      this.accountDetailForm.controls['FaxNo'].setValue(this.listOfDataById[0].FaxNo)
      this.accountDetailForm.controls['Country'].setValue(this.listOfDataById[0].Country)
      this.accountDetailForm.controls['State'].setValue(this.listOfDataById[0].State)
      this.accountDetailForm.controls['City'].setValue(this.listOfDataById[0].City)
      let Yard_Address = this.listOfDataById[0].Yard_Address
   
      this.accountDetailForm.controls['Yard_Address'].setValue(this.listOfDataById[0].Yard_Address)
      this.accountDetailForm.controls['CA'].setValue(this.listOfDataById[0].CA)

     
      this.EffectiveDate = this.listOfDataById[0].EffectiveDate
      this.accountDetailForm.controls['EffectiveDate'].setValue(this.EffectiveDate);
      this.accountDetailForm.controls['YearInBusiness'].setValue(this.listOfDataById[0].YearInBusiness);
      this.accountDetailForm.controls['ZIP'].setValue(this.listOfDataById[0].ZIP);
      this.Radius =this.listOfDataById[0].Radius;
      this.accountDetailForm.controls['Radius'].setValue(this.Radius);
      
      this.accountDetailForm.controls['No_of_Unit'].setValue(this.listOfDataById[0].No_of_Unit);
      this.accountDetailForm.controls['MC'].setValue(this.listOfDataById[0].MC);
      
      this.accountDetailForm.controls['No_of_Driver'].setValue(this.listOfDataById[0].No_of_Driver);
      this.accountDetailForm.controls['PolicyType'].setValue(this.listOfDataById[0].PolicyType);
      this.accountDetailForm.controls['LastPremium'].setValue(this.listOfDataById[0].LastPremium);
      this.accountDetailForm.controls['GaragingAddress'].setValue(this.listOfDataById[0].GaragingAddress);
      this.accountDetailForm.controls['GaragingCity'].setValue(this.listOfDataById[0].GaragingCity);
      this.accountDetailForm.controls['GaragingState'].setValue(this.listOfDataById[0].GaragingState);
      this.accountDetailForm.controls['GaragingPinCode'].setValue(this.listOfDataById[0].GaragingPinCode);
      
      this.accountDetailForm.controls['OperationType'].setValue(this.listOfDataById[0].OperationType);
      this.accountDetailForm.controls['EnteredBy'].setValue(this.listOfDataById[0].EnteredBy);
     
      this.accountDetailForm.controls['UpdatedBy'].setValue(this.userName);

      this.AccountRelationShipDetail = obj.AccountRelationShipDetail;
     
      obj.AccountRelationShipDetail.forEach((element:any) => {
        this.loadRelationShipDetail();
        this.AccountRelationShipDetail.length = 0;
        const control = <FormArray>this.accountDetailForm.get('AccountRelationShipDetail');
        control.removeAt(element);
      
     });

     this.AccountIdentificationDetail = obj.AccountIdentificationDetail ;

     obj.AccountIdentificationDetail.forEach((element:any) => {
      this.loadIdentificationDetail();
      this.AccountIdentificationDetail.length = 0;
      const control = <FormArray>this.accountDetailForm.get('AccountIdentificationDetail');
      control.removeAt(element);
    
   });

   this.AccountPrimaryDetail = obj.AccountPrimaryDetail ;
   this.Name =obj.AccountPrimaryDetail[0].Name
   this.PhoneNo =obj.AccountPrimaryDetail[0].PhoneNo

   obj.AccountPrimaryDetail.forEach((element:any) => {
    this.loadEmployeeDetails();
    this.AccountPrimaryDetail.length = 0;
    const control = <FormArray>this.accountDetailForm.get('AccountPrimaryDetail');
    control.removeAt(element);
  
 });
      
 
     
     
  
    })
  }
  
}

getAllData(){
  this.http.getAllData(ApiUrl.getAllAccountDetail).subscribe(
    data=>{
      this.showSpiner = false
      let response = JSON.stringify(data)
      var obj  = JSON.parse(response)
      this.listOfAccount = obj.Accounts
     
   
    }
  )
}
makeForm(){
  this.accountDetailForm = this.fb.group({
    AccountID:['0'],
    AccountName: ['',[Validators.required,]],
    AccountSource: [''],
    AccountType: ['Prospective'],
   
    BusinessType: [''],
  
    Description: [''],
    Yard_Address:[''],
    EmailID: [''],
    LookUpCode: [''],
    PhoneNumber: [''],
    No_of_Unit: [''],
    No_of_Driver: [''],
    PolicyType: [''],
    LastPremium: [''],
    CA:[''],
    MC:[''],
    BDA: [''],
    Radius: ['',],
    OperationType: ['',],
    City: ['',],
    State: ['',],
    Country: ['',],
    FaxNo: [''],
    ZIP: ['',],
    GaragingAddress:[''],
    GaragingCity:[''],
    GaragingState:[''],
    GaragingPinCode:[''],
    EffectiveDate: ['',[Validators.required,]],
    YearInBusiness: ['',],
    EnteredBy: [this.userName],
    UpdatedBy: [''],
  
    AccountRelationShipDetail:this.fb.array([this.moreRelationships()]),
    AccountIdentificationDetail:this.fb.array([this.moreIdentification()]),
    AccountPrimaryDetail:this.fb.array([this.moreEmployeeDetails()])
  });


}  

 //Employee //
 moreEmployeeDetails() {
  return this.fb.group({
    Name:[''],
    Designation:[''],
    PhoneNo:[''],
    EmailID:['']
  })

}
AccountPrimaryDetail =[];
employeeList:any =[]
loadEmployeeDetails() {
  const control = <FormArray>this.accountDetailForm.get('AccountPrimaryDetail');
  const defaultName = this.Name ||'';
  for ( this.employeeList of this.AccountPrimaryDetail) {
    const grp = this.fb.group({
      Name: [this.employeeList.Name ],
      Designation: [this.employeeList.Designation],
      PhoneNo: [this.employeeList.PhoneNo ],
      EmailID: [this.employeeList.EmailID ],
    });
    control.push(grp);
  }
}



get employeeFormArr() {
  return this.accountDetailForm.get('AccountPrimaryDetail') as FormArray;
 }

addEmployeeDetailsRow(): void {
 const array =  (this.accountDetailForm.get('AccountPrimaryDetail') as FormArray);
 array.push(this.moreEmployeeDetails());
   console.log(this.accountDetailForm.get('AccountPrimaryDetail'));
 }

 removeEmployee(index:any){
  if(index >=1){
    const control = <FormArray>this.accountDetailForm.controls['AccountPrimaryDetail'];
   control.removeAt(index)
  }
  else{
    
  }
   
}



// RelationShip //

moreRelationships() {
  return this.fb.group({
    RelatedAccountID:['',],
    RelationshipType:['',],
    Role:['',]
  })

}
AccountRelationShipDetail =[];
item:any =[]
loadRelationShipDetail() {
  const control = <FormArray>this.accountDetailForm.get('AccountRelationShipDetail');
  for ( this.item of this.AccountRelationShipDetail) {
    const grp = this.fb.group({
      RelatedAccountID: [this.item.RelatedAccountID],
      RelationshipType: [this.item.RelationshipType],
      Role: [this.item.Role],
    
    });
    control.push(grp);
  }
}



get formArr() {
  return this.accountDetailForm.get('AccountRelationShipDetail') as FormArray;
 }

addRelationshipRow(): void {
 const array =  (this.accountDetailForm.get('AccountRelationShipDetail') as FormArray);
 array.push(this.moreRelationships());
   console.log(this.accountDetailForm.get('AccountRelationShipDetail'));
 }

 remove(index:any){
  if(index >=1){
    const control = <FormArray>this.accountDetailForm.controls['AccountRelationShipDetail'];
   control.removeAt(index)
  }
  else{
    
  }
   
}


// Identification //
AccountIdentificationDetail =[]
moreIdentification(){
  return this.fb.group({
    IdentificationType:[''],
    Description:[''],
    IdentificationNumber:['']
  })

}

IdentificationDetail:any =[]
loadIdentificationDetail() {
  const control = <FormArray>this.accountDetailForm.get('AccountIdentificationDetail');
  for ( this.IdentificationDetail of this.AccountIdentificationDetail) {
    const grp = this.fb.group({
      IdentificationType: [this.IdentificationDetail.IdentificationType],
      Description: [this.IdentificationDetail.Description],
      IdentificationNumber: [this.IdentificationDetail.IdentificationNumber],
    
    });
    control.push(grp);
  }
}


get formArrIdentification() {
  return this.accountDetailForm.get('AccountIdentificationDetail') as FormArray;
 }

addIdentification(): void {
 const array =  (this.accountDetailForm.get('AccountIdentificationDetail') as FormArray);
 array.push(this.moreIdentification());
   console.log(this.accountDetailForm.get('AccountIdentificationDetail'));
 }

 removeIdentification(index:any){
  if(index >=1){
    const control = <FormArray>this.accountDetailForm.controls['AccountIdentificationDetail'];
   control.removeAt(index)
  }
  else{
    
  }
   
}

onSubmit() {
  this.submit = true ; 
  this.messageSuccess = false;
  if(!this.accountDetailForm.valid){
    this.messageSuccess = true
    return
  }


 
 let obj = JSON.parse(JSON.stringify(this.accountDetailForm.value))

  if(this.AccountID){
    obj['AccountID'] = this.AccountID
    
  }
   
  
  this.http.addEditData(ApiUrl.addAccountdetail,obj).pipe().subscribe(
    data => {
      let response  = JSON.stringify(data)
      var obj = JSON.parse(response);
     
     
      
      this.alertMessage =obj.Data.ErrorMessage;
    
      if(obj.Data.Response == 0){
         this.showError()
      }
      else{
       
     
        if(this.alertMessage =='Existing Record Updated Successfully') {
        
          this.showSuccess();
         
         }
        
        else {
          this.showSuccess()
          this.AccountID = obj.Data.AccountID
          this.accountName = obj.Data.AccountName
          localStorage.setItem("accountId" ,this.AccountID)
          localStorage.setItem("accountName" ,this.accountName)
          this.pageNavigate()
          
       
        }
      }
   
      this.messageSuccess = true
      console.log(obj)
      
    }
  
  )
}
get f() {
  return this.accountDetailForm.controls;
  
}


showError(){
  this.toastr.error(this.alertMessage, ' ', {
 timeOut: 3000,
});
}

showSuccess() {
  this.closeModel()
  this.toastr.success(this.alertMessage, '' ,{
    timeOut: 3000,
  });   
}

clearLocalStorageValue(){
  // localStorage.removeItem('accountId')
  // localStorage.removeItem('accountName')
  // localStorage.removeItem('AccountID')
}


  


  closeModel(): void {
    

    this.dialogRef.close();
    this.http.filter('Register click') 
  }


  pageNavigate(){
    // this.router.navigateByUrl('/marketed',);
    // this.openMarketd()
   
  }



  openMarketd() {
    this.closeModel()
    let MarkedPolicyID ='0'
    const dialogRef = this.dialog.open(AddEditMarketdComponent, {
      width: '1400px',
      height: '400px',
      data: {MarkedPolicyID:MarkedPolicyID},
      
    });
  }
 
}
