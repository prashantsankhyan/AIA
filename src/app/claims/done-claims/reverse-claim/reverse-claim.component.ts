import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ClaimsPipe } from '../../add-edit-claims/_searchPipeForClaims/claims.pipe';
import { CommonModule } from '@angular/common';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from '../../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reverse-claim',
  standalone: true,
   imports: [CommonModule,MaterialModule,ReactiveFormsModule ],
  templateUrl: './reverse-claim.component.html',
  styleUrl: './reverse-claim.component.scss'
})
export class ReverseClaimComponent {
  addEditNoteForm!:FormGroup ;
  submit = false ;
  alertMessage =''
  listOfCombineMoveResSub:any =[];
 showButton =  true;

  errorMessage ='';


  messageSuccess = true;

  AccountID=''
  ClaimID:any;

  LoginUserName:any;
 constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService, public dialog: MatDialog,public dialogRef: MatDialogRef<ReverseClaimComponent>) { }
 
   ngOnInit(): void {
    
     this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
     this.LoginUserName = sessionStorage.getItem('UserName');
     this.ClaimID = this.data.ClaimID;
     
     this.makeForm();
    
   }
 
 
 
 
 
 
 
   
   
 
   
 
 
 
 
 
 
 
 
 
 
 
 
 makeForm(){
  
   this.addEditNoteForm = this.fb.group({
     ClaimID:[this.ClaimID],
     Reason:['',[Validators.required,]],
     UserName:[this.LoginUserName],  
   });
 }
 
 onSubmit() {
  
   this.submit = true ; 
   this.showButton = false
  this.messageSuccess = false
   if(!this.addEditNoteForm.valid){
     this.messageSuccess = true;
     this.showButton = true
     return
   }
 
  let obj = JSON.parse(JSON.stringify(this.addEditNoteForm.value))
 
  if(this.ClaimID){
   obj['ClaimID'] = this.ClaimID
 }
 
   this.http.addEditData(ApiUrl.reverseClaim,obj).pipe().subscribe(
     data => {
       let response  = JSON.stringify(data)
       var obj = JSON.parse(response);
      
      
      
       
         this.alertMessage = obj.Data.ErrorMessage
         this.showSuccess()
      
    
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
   return this.addEditNoteForm.controls;
   
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
