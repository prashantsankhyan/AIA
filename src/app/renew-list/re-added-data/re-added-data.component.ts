import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-re-added-data',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './re-added-data.component.html',
  styleUrl: './re-added-data.component.scss'
})
export class ReAddedDataComponent {
  showSpiner = true
  retoreFormForm!:FormGroup ;
  submit = false ;
  alertMessage ="";
  MarkedPolicyID ='';
  messageSuccess = true;
  dataResponse:any;
  hideSaveButton = true;
  AccountID:any;
  setEffective = new Date(); 
  Effective:any;
  ChildPolicyID:any

  Expiration:any
  LoginUserName:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,private http:AllApiService ,
  private cRouter:ActivatedRoute, private router:Router,
  private toastr: ToastrService,public dialogRef: MatDialogRef<ReAddedDataComponent>) { }
  ngOnInit(): void {
   
    this.AccountID = this.data.AccountID;
    this.MarkedPolicyID =this.data.MarkedPolicyID;
    this.ChildPolicyID = this.data.ChildPolicyID;
      this.LoginUserName = sessionStorage.getItem('UserName');
    this.makeForm()
    this.currentDate()
  }
  currentDate(){
    let dte = new Date(this.setEffective)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.Effective  =month + "/" + day + "/" + year
  }
  changeNextDate(){
    this.Effective
    
    let dte = new Date(this.Effective)
     var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() +1;
     let newdate  =month + "/" + day + "/" + year
     this.Expiration = newdate 
  }


   makeForm(){
     
      this.retoreFormForm = this.fb.group({
        
        AccountID:[this.AccountID ,[Validators.required,]],
        MarkedPolicyID:[this.MarkedPolicyID],
        ChildPolicyID:[this.ChildPolicyID,[Validators.required,]],
        Effective:['',[Validators.required,]],
         Expiration:['',[Validators.required,]],
        CalculteExpiryDay:['No'],
        UpdateExpiryDayStatusBy:[this.LoginUserName],
      });
    }
  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.retoreFormForm.valid){
      this.messageSuccess = true;
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.retoreFormForm.value))

     

    this.http.addEditData(ApiUrl.restoreDeleteData,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
      
        this.alertMessage =obj.ErrorMessage;

       

       
        // this.marketedName =this.listOfData[0].LineShortName
        // alert(this.marketedName)
     
       this.showSuccess();
      
        console.log(obj)
        
      }
    
    )
  }

  get f() {
    return this.retoreFormForm.controls;
    
  }

  showSuccess() {
    this.toastr.success('New Marketd Add Please check and complete next step', '' ,{
      timeOut: 1000,
    });
    
   
    this.onNoClick()
    this.changeLocation()
  
  }

  showError(){
    this.toastr.error(this.alertMessage, ' ', {
   timeOut: 1000,
  });
  }
  changeLocation() {
  
   
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); 
    }); 
  }
  onNoClick(): void {
    this.dialogRef.close();
   
  }
}
