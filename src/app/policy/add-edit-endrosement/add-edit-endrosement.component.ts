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
import { AddEditDriverComponent } from '../../detail-layout/driver/add-edit-driver/add-edit-driver.component';
import { AddEditVehicleComponent } from '../../detail-layout/vehicle/add-edit-vehicle/add-edit-vehicle.component';
import { ListOfEndrosementComponent } from '../list-of-endrosement/list-of-endrosement.component';

@Component({
  selector: 'app-add-edit-endrosement',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-edit-endrosement.component.html',
  styleUrl: './add-edit-endrosement.component.scss'
})
export class AddEditEndrosementComponent {
  addEndorsementForm!:FormGroup ;
  submit = false ;
  MarkedPolicyID ='' ;
  alertMessage =''
  ID:any
  DateReceived =new Date();
  date = new Date()
  messageSuccess = true;
  userPermission:any;
  accountName:any;
  updateID ='';
  AccountID='';
  ChildPolicyID ='';
  
  serEffectiveDateChange = new Date(); 
  EffectiveDateChange:any
  updateBy =''
  LoginUserName:any;
  listOfData:any;
  EndorsementID:any;
  MarkedPolicyId:any;
  EndorsementType:any;
  IsChildPolicyExist = false;
  userName:any;
  LineShortName:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditEndrosementComponent>){}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
    this.data;
   
    this.MarkedPolicyID = this.data.MarkedPolicyID ;

    this.AccountID = this.data.AccountID;
    this.ChildPolicyID = this.data.ChildPolicyID;
    this.LineShortName = this.data.LineShortName
    this.clearLocalStorage()
    this.makeForm();
    this.load();
    this.currentDate()
    
    
   
   
  }
  currentDate(){
    let dte = new Date(this.serEffectiveDateChange)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.EffectiveDateChange  =month + "/" + day + "/" + year
  }
  load(){
    let data = this.data ;
    this.ID = data.EndorsementID ;
    if(this.ID == undefined) {

    }
    else {
    let data  = this.data
    let response  = JSON.stringify(data)
    let obj  = JSON.parse(response)
    this.addEndorsementForm.controls['ID'].setValue(obj.EndorsementID)
    this.addEndorsementForm.controls['Description'].setValue(obj.Description)
    this.addEndorsementForm.controls['EndorsementType'].setValue(obj.EndorsementType)
    let EffectiveDateChange = obj.EffectiveDateChange
    this.EffectiveDateChange = new Date(EffectiveDateChange)
    this.addEndorsementForm.controls['EffectiveDateChange'].setValue(this.EffectiveDateChange)
    this.addEndorsementForm.controls['Code'].setValue(obj.Code)
    this.addEndorsementForm.controls['UpdatedBy'].setValue(this.userName)
   
    
   }
   
  }

  makeForm(){
   
    this.addEndorsementForm = this.fb.group({
      ID:["0"],
      MarkedPolicyID:[this.MarkedPolicyID,[Validators.required]],
      AccountID:[this.AccountID,[Validators.required,]],
      EffectiveDateChange:['',[Validators.required,]],
      EndorsementType:['',[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID ,[Validators.required,]],
      Description:['',[Validators.required,]],
      Code:[''],
      EnteredBy:[this.userName],
      UpdatedBy:['']
   
      
      
    });
  }


  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
  
    if (!this.addEndorsementForm.valid) {
      this.messageSuccess = true;
      return;
    }
  
    let obj = JSON.parse(JSON.stringify(this.addEndorsementForm.value));
  
    if (this.ID) {
      obj['_id'] = this.ID;
    }
  
    this.http.addEditData(ApiUrl.addEditEndorsement, obj).pipe().subscribe(
      data => {
        let response = JSON.stringify(data);
        let obj = JSON.parse(response);
  
        // Ensure that Endorsements exists and is an array
        if (obj.Data && obj.Data.Endorsements && Array.isArray(obj.Data.Endorsements) && obj.Data.Endorsements.length > 0) {
          this.listOfData = obj.Data.Endorsements;
          this.alertMessage = obj.Data.ErrorMessage;
  
          this.EndorsementID = this.listOfData[0].ID;
          this.ChildPolicyID = this.listOfData[0].ChildPolicyID;
          this.MarkedPolicyID = this.listOfData[0].MarkedPolicyID;
          this.EndorsementType = this.listOfData[0].EndorsementType;
  
          if (this.EndorsementType === 'Driver') {
            this.router.navigate(['/detailLayout/driver']);
            this.addDriverByEndrosement();
  
            localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID);
            localStorage.setItem('ChildPolicyID', this.ChildPolicyID);
            localStorage.setItem('EndorsementID', this.EndorsementID);
            localStorage.setItem('IsChildPolicyExist', 'false');
          } else if (this.EndorsementType === 'Truck' || this.EndorsementType === 'Trailer') {
            this.router.navigate(['/detailLayout/vehicle']);
            this.addUnitByEndrosement();
  
            localStorage.setItem('MarkedPolicyID', this.MarkedPolicyID);
            localStorage.setItem('ChildPolicyID', this.ChildPolicyID);
            localStorage.setItem('EndorsementID', this.EndorsementID);
            localStorage.setItem('IsChildPolicyExist', 'false');
          }
  
          localStorage.setItem("EndorsementID", this.EndorsementID);
          localStorage.setItem("ChildPolicyID", this.ChildPolicyID);
          localStorage.setItem("MarkedPolicyID", this.MarkedPolicyID);
        } else {
          
          this.toastr.success('Update Data ', '', { timeOut: 3000 });
          
          this.dialog.open(ListOfEndrosementComponent ,{
             width: '1400px',
             height: '700px',
            data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,LineShortName:this.LineShortName}
           });
        }
  
        this.showSuccess();
        this.cancleModel();
        console.log(obj);
      },
      error => {
        // Handle error
        this.toastr.error('Error occurred while submitting data', '', { timeOut: 3000 });
      }
    );
  }
  

  addDriverByEndrosement(){
    this.dialog.open(AddEditDriverComponent ,{
      width: '800px',
      // height: '500px',
     data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
    });
  }
  addUnitByEndrosement(){
    this.dialog.open(AddEditVehicleComponent ,{
      width: '800px',
      // height: '500px',
     data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
    });
  }
  showSuccess() {
    this.toastr.success(this.alertMessage, 'Done' ,{
      timeOut: 3000,
    });
   
   
  }
  get f() {
    return this.addEndorsementForm.controls;
    
  }

  cancleModel(): void {
    this.dialogRef.close();
   
  }


  clearLocalStorage(){
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('MarkedPolicyID');
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('MarkedPolicyID')
   
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('IsChildPolicyExist')
  }


    



  changeLocation() {

  
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); 
    }); 
  }





}
