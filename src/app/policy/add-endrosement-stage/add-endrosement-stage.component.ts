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
import { ListOfEndrosementComponent } from '../list-of-endrosement/list-of-endrosement.component';

@Component({
  selector: 'app-add-endrosement-stage',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-endrosement-stage.component.html',
  styleUrl: './add-endrosement-stage.component.scss'
})
export class AddEndrosementStageComponent {
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

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,  private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEndrosementStageComponent>){}
 
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
          this.showSuccess()
        }
     
        this.closeModel()
        console.log(obj)
        
      }
    
    )
  }
  
  listOfEndorsements:any =[];
  getAllEndroesemnt(){
    this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.ChildPolicyID).subscribe(
      data=>{
        let respone  = JSON.stringify(data)
        let obj = JSON.parse(respone)
        
        this.listOfEndorsements = obj.Endorsements
        
        console.log(this.listOfEndorsements)
        
      }
    )
  }



  
  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
   this.closeModel()
   this.getEndrosementList()
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


  getEndrosementList(){
    
    
    this.dialog.open(ListOfEndrosementComponent ,{
      width: '1400px',
      height: '700px',
     data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,}
    });
  }







}
