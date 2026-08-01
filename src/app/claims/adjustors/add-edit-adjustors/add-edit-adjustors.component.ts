import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-adjustors',
  standalone: true,
   imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-edit-adjustors.component.html',
  styleUrl: './add-edit-adjustors.component.scss'
})
export class AddEditAdjustorsComponent {
showSpiner = true
  addEditAdjusterdForm!:FormGroup ;
  submit = false ;
  AccountID =''
  ClaimId ='';
  AdjustID =''
  alertMessage =''
  listOfCombineMoveResSub:any =[];
  dataResponse:any;
  errorMessage ='';
  messageSuccess = true;
  userPermission:any ;
  userPermissionList:any =[];
  MarkedPolicyId:any;
  EndorsementID:any;
  LoginUserName:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService,public dialogRef: MatDialogRef<AddEditAdjustorsComponent>) { }

  ngOnInit(): void {
    this.data ;
    this.ClaimId = this.data.ClaimId
    
   
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.makeForm()
    this.load()

  }

  load(){
    let data = this.data ;
    
    
    this.AdjustID = data.AdjustID ;
  
    
  
    if(this.AdjustID == undefined) {

    }
   else {
    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
 

    this.addEditAdjusterdForm.controls['AdjustID'].setValue(obj.AdjustID)
    this.addEditAdjusterdForm.controls['ClaimId'].setValue(obj.ClaimId)
    this.addEditAdjusterdForm.controls['AdjustName'].setValue(obj.AdjustName)
   
   
    this.addEditAdjusterdForm.controls['Business'].setValue(obj.Business)
    
    this.addEditAdjusterdForm.controls['City'].setValue(obj.City)
    this.addEditAdjusterdForm.controls['State'].setValue(obj.State)
   
   
    this.addEditAdjusterdForm.controls['Country'].setValue(obj.Country)
    
    this.addEditAdjusterdForm.controls['Phone'].setValue(obj.Phone)
    this.addEditAdjusterdForm.controls['Email'].setValue(obj.Email)
    
    this.addEditAdjusterdForm.controls['Fax'].setValue(obj.Fax)
    this.addEditAdjusterdForm.controls['Comments'].setValue(obj.Comments)
   
   
    
   
    this.addEditAdjusterdForm.controls['EnteredBy'].setValue(obj.EnteredBy)
   }
   
  }


  makeForm(){
    this.addEditAdjusterdForm = this.fb.group({
      AdjustID:['0'],
      ClaimId:[this.ClaimId ,[Validators.required,]],
      AdjustName:['',[Validators.required,]],
      Business:[''],
      City:['',],
      State:['',],
      Country:['',],
      Phone:['',[Validators.required]],
      Email:[''],
      Fax:[''],
      Comments:[''],
      
      EnteredBy:[this.LoginUserName],
      UpdatedBy:[''],
    });
  }


  clickTimer(){
    this.messageSuccess = true;
    this.messageSuccess = true
  }

  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.addEditAdjusterdForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.addEditAdjusterdForm.value))

   if(this.AdjustID){
    obj['AdjustID'] = this.AdjustID
  }

    this.http.addEditData(ApiUrl.addEditAdjuster,obj).pipe().subscribe(
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
    return this.addEditAdjusterdForm.controls;
    
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
