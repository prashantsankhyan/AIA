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
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-client-summaray',
  standalone: true,
  imports: [CommonModule,MatButtonModule ,GoogleMapsModule,FormsModule,ReactiveFormsModule ,MaterialModule ,HttpClientModule,SpinnerComponent ],
  templateUrl: './client-summaray.component.html',
  styleUrl: './client-summaray.component.scss'
})
export class ClientSummarayComponent {
  showSpiner = true
  clinetSummaryForm!: FormGroup;
  AccountID: any;
  ChildPolicyID: any;
  userPermission: any;
  LoginUserName: any;
  MarkedPolicyId: any;
  IsChildPolicyExist:any;
  submit = false;
  alertMessage = '';
  savedData: any;
  messageSuccess = true;
  ClientSummaryID:any;

  display: any;
  center = { lat: 51.678418, lng: 7.809007 };
  zoom = 12;
  searchQuery:any;
  showSaveButtion = true;
  Yard_Address:any;
  userName:any;
  teamName:any;
  accountId:any;

  constructor(
    private fb: FormBuilder,
    private http: AllApiService,
    private cRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}


  
  ngOnInit() {
    
    this.userName = sessionStorage.getItem('UserName')
   this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}')
    
    if(this.userName == null){
      this.router.navigate(['/login'])
     
  }
   
    
   
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    
    
    this.Yard_Address = localStorage.getItem('Yard_Address');
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
   
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID');
    
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
  if(this.IsChildPolicyExist == 'true'){
  this.showSaveButtion = false
  }
 else{
  this.showSaveButtion = true
}
   
    this.makeForm();

    this.http.getAllDataId(ApiUrl.getClinetSummary,this.accountId).subscribe(
      (data) => {
        this.savedData = data;
        this.showSpiner  = false ;
       
        if(this.savedData.Response ==0){
          this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
          this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
          this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID');
   
        }
        else{
          this.loadDataIntoForm(this.savedData);
        }
      
      },
      (error) => {
        console.error('Error loading data from API:', error);
      }
    );
  }


 
 


  makeForm() {
    this.clinetSummaryForm = this.fb.group({
      ClientSummaryID: ['0'],
      AccountID: [this.AccountID,],
      // MarkedPolicyID: [this.MarkedPolicyId,],
      // ChildPolicyID: [this.ChildPolicyID],
      NeededStateFillings: [''],
      ApplicableStates: [''],
      TerminalLocation: [this.Yard_Address],
      Radius0To50Miles: [''],
      Radius51to200Miles: [''],
      Radius201to500Miles: [''],
      Radius501PlusMiles: [''],
      TrailerInterchange: [''],
      LimitRequested: [''],
      Deductible: [''],
      CurrentCarrier: [''],
      ExpiringPremium: '',
      Personnel:this.fb.array([]),
      Commodity:this.fb.array([]),
      Coverage:this.fb.array([]),
      PhysicalDamage: this.fb.array([]),
      MotorTruckCargo: this.fb.array([]),
      Liabilities: this.fb.array([]),
       ClientSummaryContCargo: this.fb.array([]),
       ClientSummaryContLiability: this.fb.array([]), 
       ClientSummaryContXS: this.fb.array([]),
       ClientSummaryNTL: this.fb.array([]), 
       ClientSummaryUmbrella: this.fb.array([]),
       ClientSummaryXS: this.fb.array([]), 
    });
    const rowCounts: { [key: string]: number } = {
      Personnel: 5,
      Commodity: 4,
      Coverage: 5,
      PhysicalDamage: 4,
      MotorTruckCargo: 3,
      Liabilities: 7,
      ClientSummaryContCargo:1,
       ClientSummaryContLiability: 1, 
       ClientSummaryContXS: 1,
       ClientSummaryNTL: 1, 
       ClientSummaryUmbrella: 1,
       ClientSummaryXS: 1, 
      
    };

    this.initializeFormArrays(rowCounts);
   
  }

  

  initializeFormArrays(rowCounts: { [key: string]: number }) {
    Object.keys(rowCounts).forEach(formArrayName => {
      this.initializeFormArray(formArrayName, rowCounts[formArrayName]);
    });
  }
  
  initializeFormArray(formArrayName: string, count: number) {
    const array = this.clinetSummaryForm.get(formArrayName) as FormArray;
    for (let i = 0; i < count; i++) {
      array.push(this.addNewLine(formArrayName,i));
    }
  }

  getClinetSummaryFormControls(formArrayName: string): FormArray {
    return this.clinetSummaryForm.get(formArrayName) as FormArray;
  }

  loadDataIntoForm(savedData: any) {
    if (savedData) {
      this.clinetSummaryForm.patchValue(savedData);
    }
  }

  addNewLine(formArrayName: string ,rowIndex: number) {
    let additionalControls: any = {};
  
    switch (formArrayName) {
      case 'Commodity':
        additionalControls = {
          ID: ['0'],
          ClientSummaryID: ['0'],
          Type: this.getStaticCommodityValue(rowIndex),
          MaxValue: [''],
          AvgValue: [''],
          Total: [''],
          MajorShipper: [''],
        };
        break;
      case 'Coverage':
        additionalControls = {
          ID: ['0'],
          ClientSummaryID: ['0'],
          AutoLiability: this.getStaticCoverageValue(rowIndex),
          LimitRequested: [''],
          Deductible: [''],
          CurrentCarrier: [''],
          ExpiringPremium: [''],
        };
        break;
        case 'PhysicalDamage':
          additionalControls = {
            ID :['0'],
            ClientSummaryID:['0'],
            PhysicalDamage: this.getStaticPhysicalDamageValue(rowIndex),
            Deductible: [''],
            CurrentCarrier: [''],
            ExpiringPremium: [''],
          };
          break;
        case 'MotorTruckCargo':
          additionalControls = {
            ID :['0'],
            ClientSummaryID:['0'],
            MotorTruckCargo: this.getStaticMotorTruckCargoValue(rowIndex),
            LimitRequested: [''],
            Deductible: [''],
            CurrentCarrier: [''],
            ExpiringPremium: [''],
          };
          break;
        case 'Liabilities':
          additionalControls = {
            ID :['0'],
            ClientSummaryID: ['0'],
            MotorTruckCargo: this.getStaticLiabilitiesValue(rowIndex),
            LimitRequested: [''],
            Deductible: [''],
            CurrentCarrier: [''],
            ExpiringPremium: [''],
          };
          break;
          case 'Personnel':
            additionalControls = {
              ID: ['0'],
              ClientSummaryID: ['0'],
              Position: this.getStaticPositionValue(rowIndex),
              Name: [''],
              Years: [''],
              ownerShip: [''],
            };
            break;   
          case 'ClientSummaryContCargo':  // New case for ContCargo
           additionalControls = {
             ID: ['0'],
            ClientSummaryID: ['0'],
            ContCargoLimit: [''],  // ContCargoLimit field
            ContCargoDeductible: [''],  // ContCargoDeductible field
      };
      break;
      case 'ClientSummaryContLiability':
  additionalControls = {
    ID: ['0'],
    ClientSummaryID: ['0'],
    ContLiabilityLimit: [''],
    ContLiabilityDeductible: [''],
  };
  break;

case 'ClientSummaryContXS':
  additionalControls = {
    ID: ['0'],
    ClientSummaryID: ['0'],
    ContXSLimit: [''],
    ContXSDeductible: [''],
  };
  break;

case 'ClientSummaryNTL':
  additionalControls = {
    ID: ['0'],
    ClientSummaryID: ['0'],
    NTLLimit: [''],
    NTLDeductible: [''],
  };
  break;

case 'ClientSummaryUmbrella':
  additionalControls = {
    ID: ['0'],
    ClientSummaryID: ['0'],
    UmbrellaLimit: [''],
    UmbrellaDeductible: [''],
  };
  break;

case 'ClientSummaryXS':
  additionalControls = {
    ID: ['0'],
    ClientSummaryID: ['0'],
    XSLimit: [''],
    XSDeductible: [''],
  };
  break;
      // Add cases for other formArrayNames as needed
    }

    return this.fb.group(additionalControls);
  }
  getStaticCommodityValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Paper/Plastic Products';
    } else if (rowIndex === 1) {
      return 'Canned Goods';
    } else if (rowIndex === 2) {
      return 'Mix Freight';
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

  getStaticCoverageValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Auto Liability';
    } else if (rowIndex === 1) {
      return 'Hired and Non-Owned Auto';
    } else if (rowIndex === 2) {
      return 'Personal Injury Protection';
    } else if (rowIndex === 3) {
       return 'Uninsured Motorists'
    }else if (rowIndex === 4) {
      return 'Medical Payments'
   }
    else if (rowIndex === 4) {
      return 'Insurance Contact'
   }
     else {
      // Set a default value for additional rows if needed
      return 'DefaultPosition';
    }
  }

  getStaticPhysicalDamageValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Comprehensive';
    } else if (rowIndex === 1) {
      return 'Specified Perils';
    } else if (rowIndex === 2) {
      return 'Collision';
    } else if (rowIndex === 3) {
       return 'Total Insured Value of Fleet'
    }
    else if (rowIndex === 4) {
      return 'Insurance Contact'
   }
     else {
      // Set a default value for additional rows if needed
      return 'DefaultPosition';
    }
  }

  getStaticMotorTruckCargoValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Per Vehicle';
    } else if (rowIndex === 1) {
      return 'Catastrophe Limit';
    } else if (rowIndex === 2) {
      return 'Terminal Limit';
    } else if (rowIndex === 3) {
       return 'Total Insured Value of Fleet'
    }
    else if (rowIndex === 4) {
      return 'Insurance Contact'
   }
     else {
      // Set a default value for additional rows if needed
      return 'DefaultPosition';
    }
  }

  getStaticLiabilitiesValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'Aggregate Limit';
    } else if (rowIndex === 1) {
      return 'Per Occurrence Limit';
    } else if (rowIndex === 2) {
      return 'Per Location Limit';
    } else if (rowIndex === 3) {
       return 'Per Policy Limit'
    }else if (rowIndex === 4) {
      return 'Employee Benefits Liability'
   }else if (rowIndex === 5) {
    return 'Payroll other than Driver'
 } else if (rowIndex === 6) {
  return 'Coverage for all locations'
}
    else if (rowIndex === 4) {
      return 'Insurance Contact'
   }
     else {
      // Set a default value for additional rows if needed
      return 'DefaultPosition';
    }
  }
  
  getStaticPositionValue(rowIndex: number): string {
    if (rowIndex === 0) {
      return 'President';
    } else if (rowIndex === 1) {
      return 'Operations Manager';
    } else if (rowIndex === 2) {
      return 'Safety Director';
    } else if (rowIndex === 3) {
       return 'Loss Control Contact'
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
    const array = this.clinetSummaryForm.get(formArrayName) as FormArray;
    const rowIndex = array.length; // Get the current length as the rowIndex
    array.push(this.addNewLine(formArrayName, rowIndex));
  }

  removeRow(formArrayName: string, index: number) {
    const control = this.clinetSummaryForm.get(formArrayName) as FormArray;
    if (index >= 1) {
      control.removeAt(index);
    }
  }
  getNeededStateFillingsValue(): any {
    return this.clinetSummaryForm.get('NeededStateFillings')?.value;
  }

  getApplicableStatesValue():any {
    return this.clinetSummaryForm.get('ApplicableStates')?.value;
  }

  getTerminalLocationValue():any {
    return this.clinetSummaryForm.get('TerminalLocation')?.value;
  }

  getRadius0To50MilesValue():any {
    return this.clinetSummaryForm.get('Radius0To50Miles')?.value;
  }

  getRadius51to200MilesValue():any {
    return this.clinetSummaryForm.get('Radius51to200Miles')?.value;
  }
  getRadius201to500MilesValue():any {
    return this.clinetSummaryForm.get('Radius201to500Miles')?.value;
  }
  getRadius501PlusMilesValue():any {
    return this.clinetSummaryForm.get('Radius501PlusMiles')?.value;
  }

  getTrailerInterchangeValue():any {
    return this.clinetSummaryForm.get('TrailerInterchange')?.value;
  }
  getLimitRequestedValue():any {
    return this.clinetSummaryForm.get('LimitRequested')?.value;
  }

  getDeductibleValue():any {
    return this.clinetSummaryForm.get('Deductible')?.value;
  }
  getCurrentCarrierValue():any {
    return this.clinetSummaryForm.get('CurrentCarrier')?.value;
  }

  getExpiringPremiumValue():any {
    return this.clinetSummaryForm.get('ExpiringPremium')?.value;
  }
  getCommodityValue():any {
    return this.clinetSummaryForm.get('Commodity')?.value;
  }


  onSubmit() {
    this.submit = true;
    this.messageSuccess = false;
    // Validate the form
    if (!this.clinetSummaryForm.valid) {
      this.messageSuccess = true;
     
      return;
    }
  
    // Prepare the data for submission
    const formData = { ...this.clinetSummaryForm.value };
  
    // Set the NeededStateFillings value in the formData
    formData.NeededStateFillings = this.getNeededStateFillingsValue();
    formData.ApplicableStates = this.getApplicableStatesValue();

    formData.TerminalLocation = this.getTerminalLocationValue();
    formData.Radius0To50Miles = this.getRadius0To50MilesValue();
    formData.Radius51to200Miles = this.getRadius51to200MilesValue();
    formData.Radius201to500Miles = this.getRadius201to500MilesValue();
    formData.Radius501PlusMiles = this.getRadius501PlusMilesValue();
    formData.TrailerInterchange = this.getTrailerInterchangeValue();
    formData.LimitRequested = this.getLimitRequestedValue();
    formData.Deductible = this.getDeductibleValue();

    formData.CurrentCarrier = this.getCurrentCarrierValue();
    formData.ExpiringPremium = this.getExpiringPremiumValue();
    formData.Commodity = this.getCommodityValue();
    

  
    // If there is a ClientSummaryID, add it to the formData
    if (this.ClientSummaryID) {
      formData.ClientSummaryID = this.ClientSummaryID;
    }
  
    console.log('Form Data:', formData); // Log the formData for debugging
  
    // Make the HTTP request to add/edit client summary data
    this.http.addEditData(ApiUrl.addEditClientSummary, formData).subscribe(
      (data) => {
        // Process the response
        console.log('Response:', data); // Log the response for debugging
  
        const response = JSON.stringify(data);
        const obj = JSON.parse(response);
  
        this.alertMessage = obj.Data.ErrorMessage;
  
        // Show success or error message based on the response
        if (obj.Data.Response === 0) {
          this.showError();
        } else {
          this.showSuccess();
        }
      },
      (error) => {
        // Handle errors from the HTTP request
        console.error('Error submitting data:', error);
      }
    );
  }
  showSuccess() {
    // this.changeLocation()
    this.router.navigate(['/detailLayout/template'])
    this.toastr.success(this.alertMessage, '', { timeOut: 3000 });
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
