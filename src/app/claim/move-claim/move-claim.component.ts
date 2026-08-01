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

@Component({
  selector: 'app-move-claim',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,],
  templateUrl: './move-claim.component.html',
  styleUrl: './move-claim.component.scss'
})
export class MoveClaimComponent {
  deleteForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  ClaimID ='';
  driverName ='';
  userPermission:any;
  LoginUserName :any

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<MoveClaimComponent>,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  
    this.LoginUserName = sessionStorage.getItem('UserName');
   
    this.makeForm()
  }
  loadData(){
   
  }


  makeForm(){
    this.data;
    this.ClaimID = this.data.ClaimID;
    
    this.deleteForm = this.fb.group({
      ClaimID:[this.ClaimID],
      UserName:[this.LoginUserName],
      Reason:['',[Validators.required,]],
     
    });
  }

  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.deleteForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.deleteForm.value))

   if(this.ClaimID){
    obj['ClaimID'] = this.ClaimID
  }

    this.http.deleteAddQuery(ApiUrl.moveToConfirem,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
       
        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
         
        
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess();
          this.changeLocation();
          this.closeComponent()
        }
     
       
        console.log(obj)
        
      }
    
    )
  }
  




  deleteRecord(){
    this.closeComponent()
    this.http.delete(ApiUrl.moveToConfirem,this.ClaimID,this.LoginUserName).subscribe(
      data=> {
       
        this.changeLocation()
        let response = JSON.stringify(data)
        this.showSuccess()
        
      }
    )
  }

  
  closeComponent(): void {
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


  showSuccess() {
    this.toastr.success('Delete record  Successfully', '' ,{
      timeOut: 3000,
    });
  }
}
