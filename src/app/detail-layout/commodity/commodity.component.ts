import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CommonModule, JsonPipe } from '@angular/common';
import { AllApiService } from '../../_service/all-api.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditVehicleComponent } from '../vehicle/add-edit-vehicle/add-edit-vehicle.component';

@Component({
  selector: 'app-commodity',
  standalone: true,
  imports: [CommonModule ,MaterialModule,ReactiveFormsModule, SpinnerComponent,],
  templateUrl: './commodity.component.html',
  styleUrl: './commodity.component.scss'
})
export class CommodityComponent {
  showSpiner = true
  commodityForm!:FormGroup ;
  submit = false ;
  CommodityID=''
  alertMessage ="";
  accountId:any;
  MarkedPolicyId:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any;
  EndorsementID:any;
  messageSuccess = true;
  
  savedData: any;
  showSaveButtion = true;
  userName:any;

  constructor(private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,){}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('UserName')
    if(this.userName == null){
      this.router.navigate(['/login'])
     
  }
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID')
    // alert(this.ChildPolicyID)
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
    if(this.IsChildPolicyExist == 'true'){
      this.showSaveButtion = true
    }
    else{
      this.showSaveButtion = true
    }
    this.makeForm()
    this.getAllSaveValue()
  
  }


  getAllSaveValue(){
    this.http.getAllDataByTwoId(ApiUrl.GetAllCommodityByChildandMarkedPolicyID,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
      (data) => {
        this.savedData = data;
      
        this.showSpiner = false;
  
        if (this.savedData.Response == 0) {
          this.accountId = JSON.parse(localStorage.getItem('accountId') || '{}');
         
          this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
          this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID');
        } else {
          this.loadDataIntoForm(this.savedData);
        }
      },
      (error) => {
        console.error('Error loading data from API:', error);
      }
    );
  }


  
  makeForm() {
    this.commodityForm = this.fb.group({
      CommodityID: ['0'],
      AccountID: [this.accountId, [Validators.required]],
      MarkedPolicyID: [this.MarkedPolicyId, [Validators.required]],
     
      ChildPolicyID:[this.ChildPolicyID],
    
      Commodity:this.fb.array([]),
     
    });
    const rowCounts: { [key: string]: number } = {
      Commodity: 6,
    
      
    };

    this.initializeFormArrays(rowCounts);
  }
  initializeFormArrays(rowCounts: { [key: string]: number }) {
    Object.keys(rowCounts).forEach(formArrayName => {
      this.initializeFormArray(formArrayName, rowCounts[formArrayName]);
    });
  }
  
  initializeFormArray(formArrayName: string, count: number) {
    const array = this.commodityForm.get(formArrayName) as FormArray;
    for (let i = 0; i < count; i++) {
      array.push(this.addNewLine(formArrayName,i));
    }
  }

  getCommodityFormControls(formArrayName: string): FormArray {
    return this.commodityForm.get(formArrayName) as FormArray;
  }

  loadDataIntoForm(savedData: any) {
    if (savedData) {
      this.commodityForm.patchValue(savedData);
    }
  }
  
  

  addNewLine(formArrayName: string ,rowIndex: number) {
    let additionalControls: any = {};

    switch (formArrayName) {
      case 'Commodity':
        additionalControls = {
         
          Type:this.getCommodityValue(rowIndex),
          MaxValue:[''] ,
          AvgValue: [''],
          Total: [''],
          MajorShipper: [''],
        
        };
        break;
     
    }

    return this.fb.group(additionalControls);
  }
  getCommodityValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Canned Goods';
    } else if (rowIndex === 1) {
      return 'Water Beverages ';
    } else if (rowIndex === 2) {
      return 'Paper/Plastic Products';
    } else if (rowIndex === 3) {
       return 'General freight'
    }
    else if (rowIndex === 4) {
      return 'Insurance Contact'
   }
     else {
      // Set a default value for additional rows if needed
      return 'DefaultPosition';
    }
  }

 
  addNewLineRow(formArrayName: string) {
    const array = this.commodityForm.get(formArrayName) as FormArray;
    const rowIndex = array.length; // Get the current length as the rowIndex
    array.push(this.addNewLine(formArrayName, rowIndex));
  }

  removeRow(formArrayName: string, index: number) {
    const control = this.commodityForm.get(formArrayName) as FormArray;
    if (index >= 1) {
      control.removeAt(index);
    }
  }

 
  
  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
    if (!this.commodityForm.valid) {
      this.messageSuccess = true;
      return;
    }

    let obj = { ...this.commodityForm.value };
    if (this.CommodityID) {
      obj.CommodityID = this.CommodityID;
    }

    this.http.addEditData(ApiUrl.addEditPostNewCommodity, obj).subscribe((data) => {
      let response = JSON.stringify(data);
      var obj = JSON.parse(response);

      this.alertMessage = obj.Data.ErrorMessage;
      if (obj.Data.Response == 0) {
        this.showError();
      } else {
        this.getAllSaveValue()
        this.showSuccess();
      }

      console.log(obj);
    });
  }
  showSuccess() {
   
    this.toastr.success(this.alertMessage, '', { timeOut: 3000 });
    this.nextToVehicle()
  }

  showError() {
    this.toastr.error(this.alertMessage, ' ', { timeOut: 3000 });
  }



  
nextToVehicle() {
  this.router.navigate(['/detailLayout/vehicle'])
 let VehicleID =undefined;
  const dialogRef = this.dialog.open(AddEditVehicleComponent, {
    width: '800px',
    // height: '435px',
    data :{VehicleID:VehicleID,}
   
    
  });

  
}
 

  
 
}
