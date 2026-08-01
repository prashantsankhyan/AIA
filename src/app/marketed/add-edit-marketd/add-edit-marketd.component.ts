import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CommonModule, JsonPipe } from '@angular/common';
import { AllApiService } from '../../_service/all-api.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { DatePipe } from '@angular/common';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-edit-marketd',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgbDatepickerModule, NgbAlertModule, SpinnerComponent],
  templateUrl: './add-edit-marketd.component.html',
  styleUrl: './add-edit-marketd.component.scss',
  providers: [DatePipe]
})
export class AddEditMarketdComponent {
  showSpiner = true
  addEditMarkedForm!:FormGroup ;
  submit = false ;
  alertMessage ="";
  getAllProfleName:any =[];
  getAllLineCode:any =[];
  getAllLineLocation:any =[];
  getAllLineName:any =[];
  dateObj = new Date();
  setEffective = new Date(); 
  Effective:any
  
  clicked = false;
  MarkedPolicyID ='';
  Expiration:any
  upExpiration :any
  listOfMarkedPolicyById:any =[];
  messageSuccess = true;
  Department='Commercial Line';
  Type ="Commercial Line"
  accountId:any;
  accountName:any;
  LineNameID ='';
  alDeductible = false
  pdDeductible = false
  coverageDeductible = false;
  listOfData:any;
  IsChildPolicyExist:any;
  marketedName:any;
  Yard_Address:any;
  No_of_Unit:any;
  No_of_Driver:any;
  PolicyType:any;
  userName:any;
  editTime:any;

  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private datepipe: DatePipe ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditMarketdComponent>){}


  ngOnInit(): void {
    this.clearLocalStorage()
    
    this.MarkedPolicyID =this.data.MarkedPolicyID;
    this.Yard_Address = localStorage.getItem('Yard_Address');
   
    this.No_of_Unit =localStorage.getItem('No_of_Unit');
    
    this.No_of_Driver =localStorage.getItem('No_of_Driver');
    this.PolicyType =localStorage.getItem('PolicyType');
 
   
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    console.log('accountId', this.accountId)
    if(Object.keys(this.accountId).length === 0 && this.accountId.constructor === Object){
      this.router.navigate(['/login'])
      this.dialogRef.close();
    }
    
    this.accountName = localStorage.getItem('accountName');
    this.userName = sessionStorage.getItem('UserName')
  


if (this.userName === null || this.userName === undefined || this.userName === '') {
  // when username is null or empty
  this.closeModel()
  return;
} else {
  // when username has value
  this.editTime = this.userName;
}


    //  this.userName = ' '
    // alert(this.userName)
   
    
   
    if(this.userName == null){
      // this.router.navigate(['/login'])
      // this.dialogRef.close();
  }
    this.makeForm();
    this.load();
    this.getAllProfileCenter();
    this.getAllloaction();
    this.getAllLineOfCode();
    this.getAllLineOfName();
    this.currentDate()
  }

  currentDate(){
    let dte = new Date(this.setEffective)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.Effective  =month + "/" + day + "/" + year
  }
  changeNextDate(){
    this.Effective
    
    let dte = new Date(this.Effective)
     var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() +1;
     let newdate  =month + "/" + day + "/" + year
     this.Expiration = newdate 
  }
  load(){
   
    
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    if(this.MarkedPolicyID == '0'){
      this.showSpiner =false
    }
    else{
      this.http.getAllDataId(ApiUrl.getMarkedPolicyById,this.MarkedPolicyID).subscribe(data=>{
        let response  = JSON.stringify(data)
        let obj = JSON.parse(response);
        this.showSpiner =false
        this.listOfMarkedPolicyById = obj.MarkedPolicy;  
        this.MarkedPolicyID =  this.listOfMarkedPolicyById[0].MarkedPolicyID
       
        this.addEditMarkedForm.controls['MarkedPolicyID'].setValue(this.MarkedPolicyID);
        this.addEditMarkedForm.controls['AccountID'].setValue(this.listOfMarkedPolicyById[0].AccountID)
        this.addEditMarkedForm.controls['Name'].setValue(this.listOfMarkedPolicyById[0].Name)
        this.Effective =this.listOfMarkedPolicyById[0].Effective;
        this.Effective = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Effective), 'MM/dd/yyyy')
     
        this.addEditMarkedForm.controls['Effective'].setValue(this.Effective)
        this.Expiration = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Expiration), 'MM/dd/yyyy')
      
        this.addEditMarkedForm.controls['Cargo_Limit'].setValue(this.listOfMarkedPolicyById[0].Cargo_Limit)
        this.addEditMarkedForm.controls['Physical_Damage_Deductible'].setValue(this.listOfMarkedPolicyById[0].Physical_Damage_Deductible)
        this.addEditMarkedForm.controls['Physical_Damage_Combined_Deductible'].setValue(this.listOfMarkedPolicyById[0].Physical_Damage_Combined_Deductible)
        this.addEditMarkedForm.controls['Cargo_Deductible'].setValue(this.listOfMarkedPolicyById[0].Cargo_Deductible)
        this.addEditMarkedForm.controls['Cargo_Type'].setValue(this.listOfMarkedPolicyById[0].Cargo_Type)
        this.addEditMarkedForm.controls['AL_Deductible'].setValue(this.listOfMarkedPolicyById[0].AL_Deductible)




        this.addEditMarkedForm.controls['Expiration'].setValue(this.Expiration)
        this.addEditMarkedForm.controls['Source'].setValue(this.listOfMarkedPolicyById[0].Source)
        this.addEditMarkedForm.controls['Department'].setValue(this.listOfMarkedPolicyById[0].Department)
        this.addEditMarkedForm.controls['Type'].setValue(this.listOfMarkedPolicyById[0].Type)
        
        this.addEditMarkedForm.controls['EnteredBy'].setValue(this.editTime)
        
      
        this.MarkedPolicyDetail = obj.MarkedPolicyDetail;
        this.MarkedPolicyDetail.forEach((element:any) => {
          this.LineNameID = element.LineNameID;
          console.log("Account ID:", this.LineNameID);
          this.loadNewLine();
          this.MarkedPolicyDetail.length = 0;
          this.getlineIdToHideAndClose();
          const control = <FormArray>this.addEditMarkedForm.get('MarkedPolicyDetail');
          control.removeAt(element);
        
       });
      
  
       
       
    
      })
     }
   
   
    
   
   
  }

  getlineIdToHideAndClose(){
    this.LineNameID;
    if(this.LineNameID =='10'){
     this.alDeductible = true;
     this.pdDeductible  = false;
     this.coverageDeductible = false
    }
    else if (this.LineNameID == '16'){
      this.alDeductible = false;
      this.pdDeductible = true;
      this.coverageDeductible = false
      
    }
    else if (this.LineNameID == '14'){
      this.alDeductible = false;
      this.pdDeductible = false;
      this.coverageDeductible = true
      
    
     
    }
    else{

    }
   

  }
  makeForm(){
   
    this.addEditMarkedForm = this.fb.group({
      MarkedPolicyID:['0'],
      AccountID:[this.accountId ,[Validators.required,]],
      Name:[this.accountName,[Validators.required,]],
      Effective:['',[Validators.required,]],
      Expiration:['',[Validators.required,]],
      Source:['',[Validators.required,]],
      Department:['',[Validators.required]],
      Type:['',[Validators.required,]],
      Cargo_Limit:[''],
      Physical_Damage_Deductible :[''],
      Physical_Damage_Combined_Deductible:[''],
      Cargo_Deductible:[''],
      Cargo_Type:[''],
      AL_Deductible:[''],
      EnteredBy:[this.userName],
      MarkedPolicyDetail:this.fb.array([this.addNewLine()]),
     
    });
  }
  addNewLine() {
    return this.fb.group({
      LineNameID:['',[Validators.required,]],
      LineCodeID:['',[Validators.required,]],
      ProfileCenterID:['',[Validators.required,]],
      LocationID:['',[Validators.required,]]
    })

  }
  MarkedPolicyDetail =[];
  newLineList:any =[]
  loadNewLine() {
    const control = <FormArray>this.addEditMarkedForm.get('MarkedPolicyDetail');
    for ( this.newLineList of this.MarkedPolicyDetail) {
      const grp = this.fb.group({
        LineNameID: [this.newLineList.LineNameID],
        LineCodeID: [this.newLineList.LineCodeID],
        ProfileCenterID: [this.newLineList.ProfileCenterID],
        LocationID: [this.newLineList.LocationID],

      
      });
      control.push(grp);
    }
  }
  
  get formArr() {
    return this.addEditMarkedForm.get('MarkedPolicyDetail') as FormArray;
   }

  addnewLineRow(): void {
   const array =  (this.addEditMarkedForm.get('MarkedPolicyDetail') as FormArray);
   array.push(this.addNewLine());
     console.log(this.addEditMarkedForm.get('MarkedPolicyDetail'));
   }
 
   remove(index:any){
    if(index >=1){
      const control = <FormArray>this.addEditMarkedForm.controls['MarkedPolicyDetail'];
     control.removeAt(index)
    }
    else{
      
    }
     
  }
onSubmit() {
  this.submit = true;
  this.messageSuccess = false;

  if (!this.addEditMarkedForm.valid) {
    this.messageSuccess = true;
    return;
  }

  const obj = { ...this.addEditMarkedForm.value };

  // ❌ If EnteredBy is null / empty / blank / 'null' → DO NOT SAVE
  if (
    obj.EnteredBy === null ||
    obj.EnteredBy === undefined ||
    (typeof obj.EnteredBy === 'string' &&
      (obj.EnteredBy.trim() === '' ||
       obj.EnteredBy.trim().toLowerCase() === 'null'))
  ) {
    // optional message
    this.alertMessage = 'Entered By is required';
    this.closeModel()
    return; // ⛔ stop here — API NOT called
  }

  // ✅ Call API only when EnteredBy is valid
  this.http.addEditData(ApiUrl.addEditMarkedPolicy, obj).subscribe({
    next: (res: any) => {
      this.listOfData = res.Data.MarkedPolicy;
      this.alertMessage = res.Data.ErrorMessage;

      this.MarkedPolicyID = this.listOfData[0].MarkedPolicyID;
      this.IsChildPolicyExist = this.listOfData[0].IsChildPolicyExist;

      this.showSuccess();
      this.closeModel();
      
    },
    error: (err) => {
      console.error(err);
    }
  });
}


  getAllProfileCenter(){
    this.http.getAllData(ApiUrl.getAllProfileCenter).subscribe(
      data=>{
        let response  = JSON.stringify(data);
        let obj  = JSON.parse(response)
        this.getAllProfleName = obj.ProfileCenters
      }
    )
  }

  getAllLineOfName(){
    this.http.getAllData(ApiUrl.getAllLineName).subscribe(
      data=>{
        let response  = JSON.stringify(data);
        let obj  = JSON.parse(response)
        this.getAllLineName = obj.LineNames
      }
    )
  }
  getAllLineOfCode(){
    this.http.getAllData(ApiUrl.getAllLineCode).subscribe(
      data=>{
        let response  = JSON.stringify(data);
        let obj  = JSON.parse(response)
        this.getAllLineCode = obj.LineCodes
      }
    )
  }
  getAllloaction(){
    this.http.getAllData(ApiUrl.getAllLocation).subscribe(
      data=>{
        let response  = JSON.stringify(data);
        let obj  = JSON.parse(response)
        this.getAllLineLocation = obj.IssuingLocations
      }
    )
  }
  
  showSuccess() {
    this.changeLocation()
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
   
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
    return this.addEditMarkedForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }
  completeNextStep(){
  
    let ChildPolicyID = '0';
    let EndorsementID ='0';
   
    localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID)
    localStorage.setItem('ChildPolicyID', ChildPolicyID)
    localStorage.setItem('EndorsementID', EndorsementID)
    localStorage.setItem('marketedName', this.marketedName)
    localStorage.setItem('IsChildPolicyExist', this.IsChildPolicyExist)
    
    // this.router.navigate(['/detailLayout'])
    
  }

  clearLocalStorage(){
    // localStorage.removeItem('MarkedPolicyID')
    // localStorage.removeItem('ChildPolicyID')
    // localStorage.removeItem('EndorsementID')
    // localStorage.removeItem('IsChildPolicyExist')
  }




}
