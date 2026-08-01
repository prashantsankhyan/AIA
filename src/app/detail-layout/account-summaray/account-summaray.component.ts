import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-account-summaray',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,ReactiveFormsModule ,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './account-summaray.component.html',
  styleUrl: './account-summaray.component.scss'
})
export class AccountSummarayComponent {
  showSpiner = true;
  accountSummaryForm!: FormGroup;
  accountId: any;
  ChildPolicyID: any;
  userPermission: any;
  LoginUserName: any;
  AccountSummaryID = '';
  MarkedPolicyID: any;
  submit = false;
  messageSuccess = true;
  alertMessage = '';
  savedData: any;
  IsChildPolicyExist:any;
  showSaveButtion = true;
  userName:any;
  marketedName:any;
  hideAl = false
  hidePd = false
  hideMTC = false
  constructor(
    private fb: FormBuilder,
    private http: AllApiService,
    private cRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {
    // this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    // this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    // this.MarkedPolicyID = localStorage.getItem('MarkedPolicyID');
    // this.loadDataFromApi()
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('UserName')
    this.marketedName = localStorage.getItem('marketedName')
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}')
    if (this.marketedName === 'AL') {
      this.hideAl = false;
      this.hidePd = true;
      this.hideMTC = true
      
    } else if ( this.marketedName === 'Physial Damage' ||
  this.marketedName === 'Physical Damage') {
      this.hideAl = true;
      this.hidePd = false;
      this.hideMTC = true
    
    } else if (this.marketedName === 'Motor Truck Cargo') {
      this.hideAl = true;
      this.hidePd = true;
      this.hideMTC = false
      
    } else {
      
      console.warn('Unknown marketedName:', this.marketedName);
    }
    if(this.userName == null){
      this.router.navigate(['/login'])
      
  }
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
   
   
    // this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
   
    this.userPermission = localStorage.getItem('userPermissiondetail');
    this.LoginUserName = localStorage.getItem('LoginUserName');
    // this.MarkedPolicyID = localStorage.getItem('MarkedPolicyID');
  
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
    if(this.IsChildPolicyExist == 'true'){
    this.showSaveButtion = false
    }
   else{
    this.showSaveButtion = true
   }

    this.makeForm();
    this.loadDataFromApi()
   
   
     
  }

  loadDataFromApi(){
    this.http.getAllDataId(ApiUrl.getAccountSummary,this.accountId).subscribe(
      (data) => {
        this.savedData = data;
        this.showSpiner = false;

        if (this.savedData.Response == 0) {
          this.accountId = JSON.parse(localStorage.getItem('disableValue') || '{}');
          // this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
          // this.MarkedPolicyID = localStorage.getItem('MarkedPolicyID');
        } else {
          this.accountSummaryForm.patchValue(this.savedData);
          this.cdr.detectChanges(); // Ensure UI updates
          this.loadDataIntoForm(this.savedData);
        }
      },
      (error) => {
        console.error('Error loading data from API:', error);
      }
    );
  }
  

  makeForm() {
    this.accountSummaryForm = this.fb.group({
      AccountSummaryID: ['0'],
      AccountID: [this.accountId, [Validators.required]],
      // MarkedPolicyID: [this.MarkedPolicyID, [Validators.required]],
      Liability: [''],
      // ChildPolicyID: [this.ChildPolicyID],
    
      LossRunSummaray:this.fb.array([]),
      AutoLiability:this.fb.array([]),
      AutoPhysicalDamage:this.fb.array([]),
      MoterTruckCargo: this.fb.array([]),
    });
    const rowCounts: { [key: string]: number } = {
      LossRunSummaray: 8,
      AutoLiability: 8,
      AutoPhysicalDamage: 8,
      MoterTruckCargo: 8,
      
    };

    this.initializeFormArrays(rowCounts);
  }
  initializeFormArrays(rowCounts: { [key: string]: number }) {
    Object.keys(rowCounts).forEach(formArrayName => {
      this.initializeFormArray(formArrayName, rowCounts[formArrayName]);
    });
  }
  
  initializeFormArray(formArrayName: string, count: number) {
    const array = this.accountSummaryForm.get(formArrayName) as FormArray;
    for (let i = 0; i < count; i++) {
      array.push(this.addNewLine(formArrayName,i));
    }
  }

  getClinetSummaryFormControls(formArrayName: string): FormArray {
    return this.accountSummaryForm.get(formArrayName) as FormArray;
  }

  loadDataIntoForm(savedData: any) {
    if (savedData) {
      this.accountSummaryForm.patchValue(savedData);
      this.cdr.detectChanges();
      
    }
  }
  addNewLine(formArrayName: string ,rowIndex: number) {
    let additionalControls: any = {};

    switch (formArrayName) {
      case 'LossRunSummaray':
        additionalControls = {
          ID: ['0'],
          AccountSummaryID: ['0'],
          Term: this.getlossRunSummarayValue(rowIndex),
          TIV: [''],
          APDDeductible: [''],
          MTCDeductible: [''],
          AutoLiabilityDeductible: [''],
          GrossRevenue: [''],
          MTCDeduUnitsatBindctible: [''],
          MaxNumberofUnits: [''],
          UnitsatRenewal: [''],
          Mileage: [''],
        };
        break;
      case 'AutoLiability':
        additionalControls = {
          ID: ['0'],
          AccountSummaryID: ['0'],
          Carrier: this.getautoLiabilityValue(rowIndex),
          PolicyNumber: [''],
          PolicyInception: [''],
          PolicyExpiration: [''],
          OpenClaims: [''],
          ClosedClaims: [''],
          TotalNoofClaims: [''],
          Reserve:[''],
          Paid:[''],
          TotalIncurred:['']
        };
        break;
        case 'AutoPhysicalDamage':
          additionalControls = {
            ID :['0'],
            AccountSummaryID:['0'],
            Carrier: this.getautoPhysicalDamageValue(rowIndex),
            PolicyNumber: [''],
            PolicyInception: [''],
            PolicyExpiration: [''],
            OpenClaims:[''],
            ClosedClaims:[''],
            TotalNoofClaims:[''],
            Reserve:[''],
            Paid:[''],
            TotalIncurred:['']
          };
          break;
        case 'MoterTruckCargo':
          additionalControls = {
            ID :['0'],
            AccountSummaryID:['0'],
            Carrier: this.getmoterTruckCargoValue(rowIndex),
            PolicyNumber: [''],
            PolicyInception: [''],
            PolicyExpiration: [''],
            OpenClaims: [''],
            ClosedClaims: [''],
            TotalNoofClaims: [''],
            Reserve: [''],
            Paid: [''],
            TotalIncurred: [''],

          };
          break;
      
    }

    return this.fb.group(additionalControls);
  }
  getlossRunSummarayValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return '';
    } else if (rowIndex === 1) {
      return '';
    } else if (rowIndex === 2) {
      return '';
    } else if (rowIndex === 3) {
       return ''
    }
    else if (rowIndex === 4) {
      return ''
   }
     else {
      // Set a default value for additional rows if needed
      return '';
    }
  }

  getautoLiabilityValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return '';
    } else if (rowIndex === 1) {
      return '';
    } else if (rowIndex === 2) {
      return '';
    } else if (rowIndex === 3) {
       return ''
    }
    else if (rowIndex === 4) {
      return ''
   }
     else {
      // Set a default value for additional rows if needed
      return '';
    }
  }
  getautoPhysicalDamageValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return '';
    } else if (rowIndex === 1) {
      return '';
    } else if (rowIndex === 2) {
      return '';
    } else if (rowIndex === 3) {
       return ''
    }
    else if (rowIndex === 4) {
      return ''
   }
     else {
      // Set a default value for additional rows if needed
      return '';
    }
  }
  getmoterTruckCargoValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return '';
    } else if (rowIndex === 1) {
      return '';
    } else if (rowIndex === 2) {
      return '';
    } else if (rowIndex === 3) {
       return ''
    }
    else if (rowIndex === 4) {
      return ''
   }
     else {
      // Set a default value for additional rows if needed
      return '';
    }
  }
  addNewLineRow(formArrayName: string) {
    const array = this.accountSummaryForm.get(formArrayName) as FormArray;
    
    if (!array) {
      console.error(`FormArray '${formArrayName}' not found.`);
      return;
    }
  
    // Remove the first row if at least one row exists
    if (array.length > 0) {
      array.removeAt(0);
    }
  
    // Add a new row
    const rowIndex = array.length; // Get the new row index
    array.push(this.addNewLine(formArrayName, rowIndex));
  
    this.cdr.markForCheck(); // Update the UI
  }
  clearAllRows(formArrayName: string) {
    const array = this.accountSummaryForm.get(formArrayName) as FormArray;
    while (array.length > 0) {
      array.removeAt(0);
    }
    this.cdr.markForCheck();
  }
  
  clearAndResetAutoLiability() {
    this.clearAllRows('AutoLiability');
    this.initializeFormArray('AutoLiability', 8); // Re-add 8 default rows
  }

  clearAndResetPhysicalDamage() {
    this.clearAllRows('AutoPhysicalDamage');
    this.initializeFormArray('AutoPhysicalDamage', 8); // Re-add 8 default rows
  }

  clearMTC() {
    this.clearAllRows('MoterTruckCargo');
    this.initializeFormArray('MoterTruckCargo', 8); // Re-add 8 default rows
  }
   
  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
    if (!this.accountSummaryForm.valid) {
      this.messageSuccess = true;
      return;
    }

    let obj = { ...this.accountSummaryForm.value };
    if (this.AccountSummaryID) {
      obj.AccountSummaryID = this.AccountSummaryID;
    }

    this.http.addEditData(ApiUrl.addEditAccountSummary,obj).subscribe((data) => {
      let response = JSON.stringify(data);
      var obj = JSON.parse(response);
     
 
      this.alertMessage = obj.Data.ErrorMessage;
      if (obj.Data.Response == 0) {
        this.showError();
      } else {
        this.showSuccess();
     
      }

      console.log(obj);
    });
  }
  showSuccess() { 
    
    this.loadDataFromApi()
     
    this.cdr.detectChanges();
    this.changeLocation()
    this.toastr.success(this.alertMessage, '', { timeOut: 3000 });
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  //  this.router.navigate(['/detailLayout/accountSummaray'])
  }

  showError() {
    this.toastr.error(this.alertMessage, ' ', { timeOut: 3000 });
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
