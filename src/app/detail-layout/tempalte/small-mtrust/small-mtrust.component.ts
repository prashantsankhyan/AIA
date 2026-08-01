import { Component } from '@angular/core';
import { NgxPrintModule } from 'ngx-print';
import { TemolateNaveComponent } from '../temolate-nave/temolate-nave.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';



@Component({
  selector: 'app-small-mtrust',
  standalone: true,
  imports:[CommonModule,MaterialModule,NgxPrintModule,],
  templateUrl: './small-mtrust.component.html',
  styleUrl: './small-mtrust.component.scss'
})
export class SmallMtrustComponent {
  emailLink ='motorcarrier@amtrustgroup.com'
  showSpiner = true
  accountSummaryForm!: FormGroup;
  AccountID: any;
  ChildPolicyID: any;
  userPermission: any;
  LoginUserName: any;
  AccountSummaryID = '';
  MarkedPolicyID: any;
  submit = false;
  messageSuccess = true;
  alertMessage = '';
  savedData: any;
  listOfData:any =[];
  ownerShip ='100%'
  listOfCommodity:any =[];
  effectiveDate: string = '';
  userName:any;
  accountId:any;
  MarkedPolicyId:any;
  vehicleDetails:any=[];
  driverDetails:any=[];
  today: Date = new Date();
  ClientSummary:any=[];
  fixedVehicleRows: any[] = [];
 fixedDriverRows: any[] = [];
  primacryName:any =[];
  TotalVehiclesTractor:any ={};
  vehicleRowOptions = [1,2,3,4,5,6,7,8];  // Options for dropdown
  selectedVehicleRowCount = 8;
 
  constructor(
    private fb: FormBuilder,
    private http: AllApiService,
    private cRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit() { 
    this.userName = sessionStorage.getItem('UserName')
    
    
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    this.getListOfData()
    // this.getCommodity()
    const currentDate = new Date();

    // Format the date as MM/dd/yyyy
    const formattedDate = this.formatDate(currentDate);

    // Assign the formatted date to the property used in the template
    this.effectiveDate = formattedDate;
    this.makeForm()
   

  }
  makeForm() {

  }
  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
getListOfData() {
  this.http.getAllDataByThreId(
    ApiUrl.getDataForAttachSmallAccountFile,
    this.accountId,
    this.MarkedPolicyId,
    this.ChildPolicyID
  ).subscribe(data => {
    this.showSpiner = false;
    const obj = JSON.parse(JSON.stringify(data));

    this.listOfData = obj;
    const name = this.listOfData?.AccountName?.toLowerCase().trim() || '';
       
    if (name.endsWith('inc')) {
      this.selectedOption = 'Corporation';
    } else if (name.endsWith('llc')) {
      this.selectedOption = 'LLC';
    } else if (name.endsWith('partnership')) {
      this.selectedOption = 'Partnership';
    } else {
      this.selectedOption = 'Individual';
    }
    this.primacryName = obj.AccountPrimaryDetail;

    const vehicles = obj.Vehicles || [];
    this.vehicleDetails = vehicles;

    const emptyVehicle = {
      Year: '',
      Make: '',
      BodyType: '',
      Value: null,
      VIN: ''
    };

   this.fixedVehicleRows = [...vehicles];
  
// this.updateVehicleRows();

   this.driverDetails = (obj.Drivers || []).map((driver: any) => ({
  ...driver,
  Experience: this.getDriverExperience(driver.YearofLicenceIssued),
  selected: false // Add selection flag
}));

    const emptyDriver = {
      Name: '',
      DOB: '',
      LicenseNumber: '',
      YearofLicenceIssued: '',
      Experience: ''
    };

   const limitedDrivers = this.driverDetails.slice(0);

  this.fixedDriverRows = [...limitedDrivers];

 

    this.ClientSummary = obj.ClientSummary;
    this.TotalVehiclesTractor = obj.Detail;

    console.log("Vehicle Details:", this.vehicleDetails);
    console.log("Driver Details:", this.driverDetails);
   
  });

  this.getCommodity();
}
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

    toggleVehicleSelection(index: number) {
   this.vehicleDetails[index].selected = !this.vehicleDetails[index].selected;
   }

    resetVehicleList() {
     const emptyVehicle = {
    Year: '',
    Make: '',
    BodyType: '',
    Value: null,
    VIN: '',
    hidden: false
  };

  // Copy real vehicles with `hidden: false`
  this.fixedVehicleRows = this.vehicleDetails.map((vehicle:any) => ({
    ...vehicle,
    hidden: false
  }));

  // Pad with empty rows if needed

  }


get visibleVehicleRows() {
  return this.fixedVehicleRows.filter(row => !row.hidden);
}
hideRowByData(row: any) {
  row.hidden = true;
}

displaySelectedDrivers() {

  const selectedDrivers = this.driverDetails.filter((d: any) => d.selected);
  this.fixedDriverRows = [...selectedDrivers];  // assign only selected drivers
}
  getDriverExperience(issuedDate: string): string {
    if (!issuedDate) return 'N/A';
  
    const issued = new Date(issuedDate);
    const today = new Date();
  
    let years = today.getFullYear() - issued.getFullYear();
    let months = today.getMonth() - issued.getMonth();
    let days = today.getDate() - issued.getDate();
  
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
  
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}`;
  }
  
  getCommodity(){
    this.http.getAllDataByTwoId(ApiUrl.GetAllCommodityByChildandMarkedPolicyID,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
      (data) => {
        this.listOfCommodity = data.Commodity;
        console.log('this.listOfCommodity',this.listOfCommodity)
      
      
  
      
      },
     
    );
  }
  selectedOption: string = ''; // Default selected option

  toggleOption(option: string) {
    this.selectedOption = this.selectedOption === option ? '' : option;
  }

  isChecked(option: string): boolean {
    return this.selectedOption === option;
  }
}
