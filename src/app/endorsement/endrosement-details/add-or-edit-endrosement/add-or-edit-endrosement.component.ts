import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-or-edit-endrosement',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-or-edit-endrosement.component.html',
  styleUrl: './add-or-edit-endrosement.component.scss'
})
export class AddOrEditEndrosementComponent {
 addEndorsementForm!:FormGroup ;
  submit = false ;
 
  alertMessage =''
  ID:any
  DateReceived =new Date();
  date = new Date()
  messageSuccess = true;
  userPermission:any;
  accountName:any;
  updateID ='';
  AccountID:any;
  ChildPolicyID:any;
  
  serEffectiveDateChange = new Date(); 
  EffectiveDateChange:any
  updateBy =''
  LoginUserName:any;
  listOfData:any;
  EndorsementID:any;
  MarkedPolicyID:any;
  EndorsementType:any;
  IsChildPolicyExist = false;
  userName:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddOrEditEndrosementComponent>){}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
    this.data;
   
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyID = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID')
    this.userName = sessionStorage.getItem('UserName')
 
    if(this.userName == null){
      this.router.navigate(['/login'])
     
  }

   
  this.currentDate()
    this.makeForm();
    this.load();
  
    
    
   
   
  }
  currentDate(){
    // let dte = new Date(this.serEffectiveDateChange)
    // var month = dte.getUTCMonth() + 1; 
    //  var day = dte.getUTCDate();
    //  var year = dte.getUTCFullYear() ;
    
    //  this.EffectiveDateChange  =month + "/" + day + "/" + year
      this.EffectiveDateChange = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date());
  }
  load(){
    let data = this.data;

   
    this.ID = data.EndorsementID ;
   
    if(this.ID == undefined) {

    }
    else {
    
    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
    
    this.addEndorsementForm.controls['ID'].setValue(obj.EndorsementID)
    this.addEndorsementForm.controls['Description'].setValue(obj.Description)
    this.addEndorsementForm.controls['EndorsementType'].setValue(obj.EndorsementType)
    this.EffectiveDateChange = obj.EffectiveDateChange
    
    let dte = new Date(this.EffectiveDateChange)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.EffectiveDateChange  =month + "/" + day + "/" + year
    
    this.addEndorsementForm.controls['EffectiveDateChange'].setValue(this.EffectiveDateChange)
    this.addEndorsementForm.controls['Code'].setValue(obj.Code)
    this.addEndorsementForm.controls['UpdatedBy'].setValue(this.userName)
    
   
    
   }
   
  }

getCaliforniaCurrentDate(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const year = parts.find(p => p.type === 'year')?.value;

  return `${month}/${day}/${year}`;
}
  makeForm(){
   
    this.addEndorsementForm = this.fb.group({
      ID:["0"],
      MarkedPolicyID:[this.MarkedPolicyID,[Validators.required]],
      AccountID:[this.AccountID,[Validators.required,]],
        EffectiveDateChange: [this.getCaliforniaCurrentDate(), [Validators.required]],
      EndorsementType:['',[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID ,[Validators.required,]],
      Description:['',[Validators.required,]],
      Code:[''],
      EnteredBy:[this.userName],
      UpdatedBy:['']
   
      
      
    });
  }


  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
  
    if (!this.addEndorsementForm.valid) {
      this.messageSuccess = true;
      return;
    }
  
    let obj = JSON.parse(JSON.stringify(this.addEndorsementForm.value));
  
    if (this.ID) {
      obj['_id'] = this.ID;
    }
  
    this.http.addEditData(ApiUrl.addEditEndorsement, obj).pipe().subscribe(
      data => {
        let response = JSON.stringify(data);
        let obj = JSON.parse(response);
  
        // Ensure that Endorsements exists and is an array
        if (obj.Data && obj.Data.Endorsements && Array.isArray(obj.Data.Endorsements) && obj.Data.Endorsements.length > 0) {
          this.listOfData = obj.Data.Endorsements;
          this.alertMessage = obj.Data.ErrorMessage;
  
          this.EndorsementID = this.listOfData[0].ID;
          this.ChildPolicyID = this.listOfData[0].ChildPolicyID;
          this.MarkedPolicyID = this.listOfData[0].MarkedPolicyID;
          this.EndorsementType = this.listOfData[0].EndorsementType;
  
          if (this.EndorsementType === 'Driver') {
            // this.router.navigate(['/detailLayout/driver']);
           
  
            localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID);
            localStorage.setItem('ChildPolicyID', this.ChildPolicyID);
            localStorage.setItem('EndorsementID', this.EndorsementID);
            localStorage.setItem('IsChildPolicyExist', 'false');
          } else if (this.EndorsementType === 'Truck' || this.EndorsementType === 'Trailer') {
            // this.router.navigate(['/detailLayout/vehicle']);
           
  
            localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID);
            localStorage.setItem('ChildPolicyID', this.ChildPolicyID);
            localStorage.setItem('EndorsementID', this.EndorsementID);
            localStorage.setItem('IsChildPolicyExist', 'false');
          }
  
          localStorage.setItem("EndorsementID", this.EndorsementID);
          localStorage.setItem("ChildPolicyID", this.ChildPolicyID);
          localStorage.setItem("MarkedPolicyID", this.MarkedPolicyID);
        } else {
          
          this.toastr.success('Update Data ', '', { timeOut: 3000 });
          
        
        }
  
        this.showSuccess();
        this.cancleModel();
        console.log(obj);
      },
      error => {
        // Handle error
        this.toastr.error('Error occurred while submitting data', '', { timeOut: 3000 });
      }
    );
  }
  


  showSuccess() {
    this.toastr.success(this.alertMessage, 'Done' ,{
      timeOut: 3000,
    });
    this.cancleModel()
   
   
  }
  get f() {
    return this.addEndorsementForm.controls;
    
  }

  cancleModel(): void {
    this.dialogRef.close();
    this.changeLocation()
   
  }


 


    



  changeLocation() {

  
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); 
    }); 
  }





}
