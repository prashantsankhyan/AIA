import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-remarks',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-edit-remarks.component.html',
  styleUrl: './add-edit-remarks.component.scss'
})
export class AddEditRemarksComponent {
  showSpiner = true
  addEditRemarks!:FormGroup ;
  submit = false ;
  accountId =''
  RemarkID =''
  alertMessage ='';
  AuthType ='';
  errorMessage ='';
  messageSuccess = true;
  dataResponse:any;
 
  MarkedPolicyId:any;
  EndorsementID:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any;
 

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditRemarksComponent>){
 
  }
  ngOnInit(): void {
    
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    this.EndorsementID = localStorage.getItem('EndorsementID')
  
    if(this.EndorsementID == null){
      this.EndorsementID = '0'
    }
    else{
      this.EndorsementID = localStorage.getItem('EndorsementID')
    }
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
    this.makeForm();
    this.load()
    
    
   
  }

  load(){
    this.data
    this.RemarkID = this.data.RemarkID
    if(this.RemarkID == undefined) {

    }
   else {

    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
   
    this.addEditRemarks.controls['RemarkID'].setValue(obj.RemarkID)
    this.addEditRemarks.controls['MarkedPolicyID'].setValue(obj.MarkedPolicyID)
   
    this.addEditRemarks.controls['Remarks'].setValue(obj.Remarks)
    this.addEditRemarks.controls['ChildPolicyID'].setValue(obj.ChildPolicyID)
   }
   
  }
  makeForm(){
    this.addEditRemarks = this.fb.group({
      RemarkID:['0'],
      AccountID:[this.accountId ,[Validators.required,]],
      MarkedPolicyID:[this.MarkedPolicyId,[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID],
      Remarks:['',[Validators.required]],
    });
  }

  onSubmit() {
  
  }

  showSuccess() {
    this.toastr.success(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    this.cancleModel()
    this.changeLocation()
  }
  get f() {
    return this.addEditRemarks.controls;
    
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
