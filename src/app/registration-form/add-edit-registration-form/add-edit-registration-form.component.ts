import { Component,  Inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';




import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MaterialModule } from '../../sharingModule/material/material.module';

import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';

@Component({
  selector: 'app-add-edit-registration-form',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-edit-registration-form.component.html',
  styleUrl: './add-edit-registration-form.component.scss'
})
export class AddEditRegistrationFormComponent {
  showSpiner = true
  addEditRegistrationForm!:FormGroup ;
  submit = false ;
  loginId =''
 
  alertMessage =''
  errorMessage ='';
  messageSuccess = true;
  showTeamType = false;
 
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditRegistrationFormComponent>){
 
  }
  ngOnInit(): void {
    this.makeForm();
    this.load()
  
   
  }

  makeForm() {
    this.addEditRegistrationForm = this.fb.group({
      loginId: ['0'],
      Team: ['', [Validators.required]],
      TeamType: [''],
      UserName: [''],
      Password: [''],
      EmailID: [''],
    });
  
    
    // this.addEditRegistrationForm.get('Team')?.valueChanges.subscribe(team => {
      
    //   if (team === "Submission Team") {
    //     this.showTeamType = true;
       
       
    //     this.addEditRegistrationForm.get('TeamType')?.setValidators([Validators.required]);
    //   } else {
    //     this.showTeamType = false;
       
    //     this.addEditRegistrationForm.get('TeamType')?.setValidators(null);
    //   }
      
    //   this.addEditRegistrationForm.get('TeamType')?.updateValueAndValidity();
    // });
  }
  // teamTypeFieldInvalid(): boolean {
  //   const field = this.addEditRegistrationForm.get('TeamType');
  //   return !!field && field.invalid && (field.dirty || field.touched );
  // }

  load(){
    this.loginId = this.data.LoginID
     if(this.loginId == undefined){

     }
     else{
      let data  = this.data;
      let response  = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.addEditRegistrationForm.controls['loginId'].setValue(obj.loginId)
      this.addEditRegistrationForm.controls['Team'].setValue(obj.Team)
      this.addEditRegistrationForm.controls['UserName'].setValue(obj.UserName)
      this.addEditRegistrationForm.controls['Password'].setValue(obj.Password)
      this.addEditRegistrationForm.controls['EmailID'].setValue(obj.EmailID)

     }
  }


  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.addEditRegistrationForm.valid){
      this.messageSuccess = true
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditRegistrationForm.value))
    if(this.loginId){
      obj['loginId'] = this.loginId
     
    }
     
    console.log('objID',obj)
    this.http.addEditData(ApiUrl.addEditLogin,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);

        if(obj.Data.Response == '1'){
          this.alertMessage =obj.Data.ErrorMessage;
          this.showSuccess()
        }
        else{
          this.alertMessage =obj.Data.ErrorMessage;
          this.toastr.error(this.alertMessage, '' ,{
            timeOut: 3000,
          });
          this.messageSuccess = true
          

        }
       
       
        
        

       

       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.messageSuccess = true
    
    this.changeLocation();
    this.cancleModel()
    
  } 

  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    
  }
  get f() {
    return this.addEditRegistrationForm.controls;
    
  }

  cancleModel(): void {
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
