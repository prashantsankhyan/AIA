import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-extra-vehicle-details',
  standalone: true,
   imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './extra-vehicle-details.component.html',
  styleUrl: './extra-vehicle-details.component.scss'
})
export class ExtraVehicleDetailsComponent {

  showButton = true
  addEditHolderForm!:FormGroup ;
    submit = false ;
   
    alertMessage =''
  
    dataResponse:any;
    errorMessage ='';
    listOfCarrier:any =[];
   
    messageSuccess = true;
    showSpiner = true;
   
    AccountID:any;
    LoginUserName:any;
    HoldingID:any;
    EnteredDateTime:any;
    EnteredBy:any;
    HoldingDetails:any;
   
   
     
  
    constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService, public dialog: MatDialog,public dialogRef: MatDialogRef<ExtraVehicleDetailsComponent>) { }
  
    ngOnInit(): void {
      // this.userPermission = localStorage.getItem('userPermissiondetail')
      this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
      this.LoginUserName = sessionStorage.getItem('UserName');
      this.HoldingID = this.data.HoldingID
    
      this.makeForm();
    
     
      
     
     
    }
   
  
  
  
  
  
  load(){
    let data = this.data ;
    this.HoldingID = data.HoldingID ;
    this.AccountID = data.AccountID;
    this.EnteredBy = data.EnteredBy;
    this.HoldingDetails = data.HoldingDetails;
    this.EnteredDateTime = data.EnteredDateTime;
   
  
    
  
    
  
    if(this.HoldingID === undefined) {
  
    }
   else {
    this.showSpiner = false
    
      this.addEditHolderForm.controls['HoldingID'].setValue(this.HoldingID)
      this.addEditHolderForm.controls['AccountID'].setValue(this.AccountID)
      this.addEditHolderForm.controls['HoldingDetails'].setValue(this.HoldingDetails)
      this.addEditHolderForm.controls['EnteredDateTime'].setValue(this.EnteredDateTime)
      this.addEditHolderForm.controls['EnteredBy'].setValue(this.EnteredBy)
      
   
   }
   
  }
  
  makeForm(){
    
    this.addEditHolderForm = this.fb.group({
      HoldingID:[this.HoldingID],
    
      Input:['',[Validators.required,]],
     
      EnteredBy:[this.LoginUserName],  
    });
  }
  
  onSubmit() {
   
    this.submit = true ; 
    this.showButton = false;
   this.messageSuccess = false
    if(!this.addEditHolderForm.valid){
      this.showButton = true;
      this.messageSuccess = true
      return
    }
  
   let obj = JSON.parse(JSON.stringify(this.addEditHolderForm.value))
  
   if(this.HoldingID){
    obj['HoldingID'] = this.HoldingID
  }
  
    this.http.addEditData(ApiUrl.addFakeVehicle,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
       
        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
          this.error()
        
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess()
        }
     
        this.onNoClick1()
        console.log(obj)
        
      }
    
    )
  }
  
  
  rowClicked:any
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
  
  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
  } 
  
  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
  }
  get f() {
    return this.addEditHolderForm.controls;
    
  }
  onNoClick1(): void {
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


}
