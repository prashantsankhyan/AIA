import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-qa-claim',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './qa-claim.component.html',
  styleUrl: './qa-claim.component.scss'
})
export class QaClaimComponent {
  QAForm!:FormGroup ;
  submit = false ;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  userPermission:any;
  ClaimID ='';
  LoginUserName:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<QaClaimComponent>,private router:Router,private toastr: ToastrService) { }

  

  ngOnInit(): void {
    this.LoginUserName = sessionStorage.getItem('UserName')
   
    this.makeForm()
  }
  makeForm(){
    this.data;
    this.data;
    this.ClaimID = this.data.ClaimID;
    this.QAForm = this.fb.group({
      ClaimID:[this.ClaimID],
      UserName:[this.userPermission],
     
     
    });
  }

  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.QAForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.QAForm.value))

   if(this.ClaimID){
    obj['ClaimID'] = this.ClaimID
  }

    this.http.addEditData(ApiUrl.confirmClaim,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
       
        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
         
        
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage;
          
          this.showSuccess();
          this.changeLocation();
          this.closeComponent()
        }
     
       
        console.log(obj)
        
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
   
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
  }


}
