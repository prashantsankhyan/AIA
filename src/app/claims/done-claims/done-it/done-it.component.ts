import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-done-it',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './done-it.component.html',
  styleUrl: './done-it.component.scss'
})
export class DoneItComponent {
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
    selectedOption: any;
options = [
  { label: 'Claim Confirm ', value: 'Claim Confirm' },
  // { label: 'Option 2', value: 'option2' },
  // { label: 'Option 3', value: 'option3' }
];


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<DoneItComponent>,private router:Router,private toastr: ToastrService) { }

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
    this.toastr.success('Claim Confirm By You ', '' ,{
      timeOut: 3000,
    });
  }
}
