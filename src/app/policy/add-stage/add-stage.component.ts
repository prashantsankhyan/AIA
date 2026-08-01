import { CommonModule } from '@angular/common';
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
  selector: 'app-add-stage',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-stage.component.html',
  styleUrl: './add-stage.component.scss'
})
export class AddStageComponent {
  showSpiner = true
  updateForm!:FormGroup ;
  submit = false ;
  accountId ='';
  ChildPolicyID:any;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  userName:any

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,  private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddStageComponent>){}
 
  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.data

    this.ChildPolicyID = this.data.ChildPolicyID
   
   this.makeForm()
   
   }


   makeForm(){
    this.updateForm = this.fb.group({
      ChildPolicyID:[this.ChildPolicyID],
      StageType:['' ,[Validators.required,]],
      StageChangedBy:[this.userName,[Validators.required,]],
       UpdatedBy:[this.userName,],
      
    });
  }

  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.updateForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.updateForm.value))

   if(this.ChildPolicyID){
    obj['ChildPolicyID'] = this.ChildPolicyID
  }

    this.http.addEditData(ApiUrl.updateStage,obj).pipe().subscribe(
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
     
        this.closeModel()
        console.log(obj)
        
      }
    
    )
  }
  


  
  showSuccess() {
    this.changeLocation()
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
    return this.updateForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
    this.http.filter('5555555555555555555555555555555555555')
   
  }



  changeLocation() {
this.closeModel()
    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/policy']); // navigate to same route
    }); 
  }

}
