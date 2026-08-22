import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-note',
  standalone: true,
   imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './add-edit-note.component.html',
  styleUrl: './add-edit-note.component.scss'
})
export class AddEditNoteComponent {
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
  
   
    

  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService, public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditNoteComponent>) { }

  ngOnInit(): void {
   
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.ClaimID = this.data.ClaimID;
    this.makeForm();
   
  }







  
  

  












makeForm(){
 
  this.addEditNoteForm = this.fb.group({
    ID:['0'],
    ClaimID:[this.ClaimID],
    Notes:['',[Validators.required,]],
    EnteredBy:[this.LoginUserName],
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

  this.http.addEditData(ApiUrl.claimNote,obj).pipe().subscribe(
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
