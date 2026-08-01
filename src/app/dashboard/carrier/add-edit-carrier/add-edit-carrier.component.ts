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
  selector: 'app-add-edit-carrier',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,NgbAlertModule,],
  templateUrl: './add-edit-carrier.component.html',
  styleUrl: './add-edit-carrier.component.scss'
})
export class AddEditCarrierComponent {
  showSpiner = true;
  submit = false ;
  
  alertMessage =''
  addEditCarrierForm!:FormGroup;
  carrierId:any;
  LoginUserName:any;
  messageSuccess = true;
  CarrierName ='';
  listCarrierName :any=[]
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditCarrierComponent>){}
 
 
  ngOnInit(): void {
    this.data;
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.carrierId = this.data.carrierId ;
    this.makeForm()
    if(this.carrierId == undefined) { 
     
   }
   else{
    this.updateCarrier()
      }
   }

   onChangeAccountName(){
    this.CarrierName;
   
   
   }
   updateCarrier(){
    this.http.getAllDataId(ApiUrl.getCarrierById,this.carrierId).subscribe(data=>
      {
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
      this.listCarrierName = obj.Carrier;  
      
      this.addEditCarrierForm.controls['ID'].setValue(this.listCarrierName[0].ID)
      this.addEditCarrierForm.controls['CarrierName'].setValue(this.listCarrierName[0].CarrierName)
      this.addEditCarrierForm.controls['AccountName'].setValue(this.listCarrierName[0].AccountName)
      this.addEditCarrierForm.controls['LookUpCode'].setValue(this.listCarrierName[0].LookUpCode)
      this.addEditCarrierForm.controls['Phone'].setValue(this.listCarrierName[0].Phone)
      this.addEditCarrierForm.controls['NAIC'].setValue(this.listCarrierName[0].NAIC)
      this.addEditCarrierForm.controls['Address'].setValue(this.listCarrierName[0].Address)
      this.addEditCarrierForm.controls['Website'].setValue(this.listCarrierName[0].Website)
      this.addEditCarrierForm.controls['Description'].setValue(this.listCarrierName[0].Description)

      
      this.addEditCarrierForm.controls['ID'].setValue(this.listCarrierName[0].ID)

    

      })
      
    

   }

   makeForm(){
   
    this.addEditCarrierForm = this.fb.group({
      ID:['0'],
    
      AccountName:[''],
      CarrierName:['',[Validators.required,]],
      LookUpCode:[''],
      TypeofCompany:['',],
      Phone:['',],
      EmailID:['',],
      FaxNo:['',],
      Country:['',],
      State:[''],
      City:[''],
      ZIP:[''],
      Description:[''],
      Comments:[''],
      NAIC:[''],
      Address:[''],
      Website:[''],
      EnteredBy:[this.LoginUserName],
      IsDeleted:[''],
      UpdatedBy:[''],
      CarrierPrimaryDetail:this.fb.array([this.moreEmployeeDetails()]),
      
      
      
    });
  }
  moreEmployeeDetails() {
    return this.fb.group({
      Name:[''],
      Designation:[''],
      PhoneNo:[''],
      EmailID:['']
    })

  }
  CarrierPrimaryDetail =[];
  employeeList:any =[]
  loadEmployeeDetails() {
    const control = <FormArray>this.addEditCarrierForm.get('CarrierPrimaryDetail');
    for ( this.employeeList of this.CarrierPrimaryDetail) {
      const grp = this.fb.group({
        Name: [this.employeeList.Name],
        Designation: [this.employeeList.Designation],
        PhoneNo: [this.employeeList.PhoneNo],
        EmailID: [this.employeeList.EmailID],
      
      });
      control.push(grp);
    }
  }
 

 
  get employeeFormArr() {
    return this.addEditCarrierForm.get('CarrierPrimaryDetail') as FormArray;
   }

  addEmployeeDetailsRow(): void {
   const array =  (this.addEditCarrierForm.get('CarrierPrimaryDetail') as FormArray);
   array.push(this.moreEmployeeDetails());
     console.log(this.addEditCarrierForm.get('CarrierPrimaryDetail'));
   }
 
   removeEmployee(index:any){
    if(index >=1){
      const control = <FormArray>this.addEditCarrierForm.controls['CarrierPrimaryDetail'];
     control.removeAt(index)
    }
    else{
      
    }
     
  }
  onSubmit() {
    this.submit = true ; 
   this.messageSuccess = false;
    if(!this.addEditCarrierForm.valid){
      this.messageSuccess= true
      
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditCarrierForm.value))

   if(this.carrierId){
    obj['carrierId'] = this.carrierId
  }

    this.http.addEditData(ApiUrl.addEditCarrier,obj).pipe().subscribe(
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
    return this.addEditCarrierForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }

   
}
