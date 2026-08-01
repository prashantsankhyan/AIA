import { CommonModule, DatePipe } from '@angular/common';
import { Component,Inject } from '@angular/core';

import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-broker',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,NgbAlertModule,],
  templateUrl: './add-edit-broker.component.html',
  styleUrl: './add-edit-broker.component.scss'
})
export class AddEditBrokerComponent {
  showSpiner = true;
  submit = false ;
  
  alertMessage =''
  addEditBrokerForm!:FormGroup;
  BrokerID:any;
  LoginUserName:any;
  messageSuccess = true;
  CarrierName ='';
  listOfBrokerName:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditBrokerComponent>){}
 
 
  ngOnInit(): void {
    this.data;
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.BrokerID = this.data.BrokerID ;
    this.makeForm()
    if(this.BrokerID == undefined) { 
    
   }
   else{
    this.updateCarrier()
    
      }
   }

   updateCarrier(){
       
   
    this.http.getAllDataId(ApiUrl.getBrokerById,this.BrokerID).subscribe(data=>
      {
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
      this.listOfBrokerName = obj.Brokers;  
      
      this.addEditBrokerForm.controls['BrokerID'].setValue(this.listOfBrokerName[0].BrokerID)
      this.addEditBrokerForm.controls['AccountName'].setValue(this.listOfBrokerName[0].AccountName)
      this.addEditBrokerForm.controls['LookUpCode'].setValue(this.listOfBrokerName[0].LookUpCode)
      this.addEditBrokerForm.controls['Address1'].setValue(this.listOfBrokerName[0].Address1)
      this.addEditBrokerForm.controls['City'].setValue(this.listOfBrokerName[0].City)
      this.addEditBrokerForm.controls['StateCode'].setValue(this.listOfBrokerName[0].StateCode)
      this.addEditBrokerForm.controls['ZipCode'].setValue(this.listOfBrokerName[0].ZipCode)
      this.addEditBrokerForm.controls['PrimaryNumber'].setValue(this.listOfBrokerName[0].PrimaryNumber)
      this.addEditBrokerForm.controls['PrimaryEmailAddress'].setValue(this.listOfBrokerName[0].PrimaryEmailAddress)
      this.addEditBrokerForm.controls['WebsiteAddress'].setValue(this.listOfBrokerName[0].WebsiteAddress)
    

      })
      

   }

   makeForm(){
   
    this.addEditBrokerForm = this.fb.group({
      BrokerID:['0'],
    
      AccountName:['',[Validators.required,]],
      LookUpCode:['',],
      Address1:[''],
      Address2:['',],
      City:['',],
      StateCode:['',],
      ZipCode:['',],
      RegionProvince:['',],
      PrimaryNumber:[''],
      PrimaryEmailAddress:[''],
      WebsiteAddress:[''],
      WebsiteDescription:[''],
    });
  }
  
  onSubmit() {
    this.submit = true ; 
   this.messageSuccess = false;
    if(!this.addEditBrokerForm.valid){
      this.messageSuccess= true
      
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditBrokerForm.value))

   if(this.BrokerID){
    obj['BrokerID'] = this.BrokerID
  }

    this.http.addEditData(ApiUrl.addEditBroker,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);

        if(obj.Data.Response =='1'){
          this.alertMessage =obj.Data.ErrorMessage;
          this.showSuccess()

        }


        
       
       
       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
    this.closeModel()
  }

  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

  get f() {
    return this.addEditBrokerForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }

}
