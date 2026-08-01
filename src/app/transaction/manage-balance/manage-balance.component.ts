import { Component, Inject,OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";



import { ToastrService } from 'ngx-toastr';



import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-balance',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterOutlet,RouterModule,RouterLink,ReactiveFormsModule,FormsModule ,SpinnerComponent,],
  templateUrl: './manage-balance.component.html',
  styleUrl: './manage-balance.component.scss'
})
export class ManageBalanceComponent {
  addEditForm!:FormGroup ;
  TransactionID:any;
  OpeningBalance:any;
  reciveBalacne:any;
  submit = false ;
  AccountID=''
  listOfCombineMoveResSubPolicy:any =[];
  listOfPolicyLine:any =[];
  listOfServicePolicy:any =[];

  markedPolicyID ='';
 
  Flag='';
  Id =''

  showPolicyAndService = false;
  toggle = true;
  status = 'Enable';
  userPermission:any ;
  userPermissionList:any =[];
  IsSaveAllowed= true;
  alertMessage =''
 
  dataResponse:any;
  errorMessage ='';
  DateofBirth = new Date()
  DateofHired = new Date();

  messageSuccess = true;
  listTransationCode:any =[]
  InvoiceID:any;
  LoginUserName:any;
  
  constructor( @Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService ,public dialog: MatDialog,public dialogRef: MatDialogRef<ManageBalanceComponent>,) {
  
  }

 ngOnInit(): void {
   this.data;
   this.InvoiceID = this.data.InvoiceID
  this.AccountID = this.data.AccountID;
  this.TransactionID = this.data.TransactionID
  this.LoginUserName = localStorage.getItem('LoginUserName');
 
   this.makeForm()
 }


 makeForm(){
   
  this.addEditForm = this.fb.group({
    TransactionID:[this.TransactionID],
    // AccountID:[this.AccountID],
    ReceiveAmount:[''],
    Notes:[''],
    UserName:[this.LoginUserName],

  });
}



onSubmit() {
  this.submit = true ; 
  this.messageSuccess = false;
  if(!this.addEditForm.valid){
    this.messageSuccess = true
    
    return
  }
 

 let obj = JSON.parse(JSON.stringify(this.addEditForm.value))

 if(this.InvoiceID){
  obj['InvoiceID'] = this.InvoiceID
}

  this.http.addEditData(ApiUrl.manageBalance,obj).pipe().subscribe(
    data => {
      let response  = JSON.stringify(data)
      var obj = JSON.parse(response);
      this.dataResponse =obj.ErrorMessage;
      
     
      if(this.dataResponse == '0'){
        this.errorMessage = obj.ErrorMessage
        this.error()
      
      }
      else{
        this.alertMessage = obj.ErrorMessage
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
getService(data:any){

}

error() {
  this.toastr.error(this.errorMessage, '' ,{
    timeOut: 3000,
  });
  this.changeLocation()
}
get f() {
  return this.addEditForm.controls;
  
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
