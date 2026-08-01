import { Component, Inject } from '@angular/core';
import { ApiUrl } from '../../../_core/apiUrl';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-endorsement-stage',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './update-endorsement-stage.component.html',
  styleUrl: './update-endorsement-stage.component.scss'
})
export class UpdateEndorsementStageComponent {
 showSpiner = true
  updateForm!:FormGroup ;
  submit = false ;
  userName:any;
  accountId ='';
  EndorsementID:any;
  alertMessage ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
  MarkedPolicyID:any;
  ChildPolicyID:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,
  private toastr: ToastrService,  private cRouter:ActivatedRoute,private router: Router,
  public dialog: MatDialog,public dialogRef: MatDialogRef<UpdateEndorsementStageComponent>){}
 
  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
   
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.data

    this.EndorsementID = this.data.EndorsementID
    
    this.MarkedPolicyID = this.data.MarkedPolicyID
    this.ChildPolicyID = this.data.ChildPolicyID
   
   this.makeForm()
   
   }


   makeForm(){
    this.updateForm = this.fb.group({
      ID:[this.EndorsementID],
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

   if(this.EndorsementID){
    obj['EndorsementID'] = this.EndorsementID
  }

    this.http.addEditData(ApiUrl.updateEndroesement,obj).pipe().subscribe(
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
          this.changeLocation()
          this.showSuccess()
        }
     
       
        console.log(obj)
        
      }
    
    )
  }
  
 



  
  showSuccess() {
   this.changeLocation()
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
   
   
  } 

  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
  }
  get f() {
    return this.updateForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
   
  }

  changeLocation() {
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
    this.closeModel()
   
  }


 



}
