import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [CommonModule,NgxPrintModule,FormsModule],
  templateUrl: './generic.component.html',
  styleUrl: './generic.component.scss'
})
export class GenericComponent {
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
  TotalVehiclesTractor:any ={};
  effectiveDate: string = '';
  userName:any;
  accountId:any;
  MarkedPolicyId:any;
  vehicleDetails:any=[];
  driverDetails:any=[];
  today: Date = new Date();
  ClientSummary:any=[];
  setEffective = new Date(); 
  Expiration:any
 Effective:any;
 primacryName:any =[];
 fixedVehicleRows: any[] = [];
 fixedDriverRows: any[] = [];
 Individual = false;
 Corporation = false;
 Partnership = false;
 LLC = false;
 Other = false;
 vehicleRowOptions = [1,2,3,4,5,6,7,8];  // Options for dropdown
selectedVehicleRowCount = 10;    // Default selected value

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
    this.currentDate()

  }

  currentDate(){
    let dte = new Date(this.setEffective)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.Effective  =month + "/" + day + "/" + year
     this.changeNextDate()
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

   while (this.fixedVehicleRows.length < this.selectedVehicleRowCount) {
   this.fixedVehicleRows.push({ ...emptyVehicle });
   }
   this.updateVehicleRows();
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

    this.fixedDriverRows = [...this.driverDetails];
    while (this.fixedDriverRows.length < 8) {
      this.fixedDriverRows.push({ ...emptyDriver });
    }

    this.ClientSummary = obj.ClientSummary;
    this.TotalVehiclesTractor = obj.Detail;

    console.log("Vehicle Details:", this.vehicleDetails);
    console.log("Driver Details:", this.driverDetails);
    this.calculateGap();
  });

  this.getCommodity();
}

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  calculateGap(): string {
    const len = this.driverDetails?.length || 0;
    const maxGap = 150;
    const minGap = 10;
    const maxRows = 10;
  
    // The fewer the rows, the larger the gap
    const gap = Math.max(minGap, maxGap - len * 15); 
    return `${gap}px`;
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
   
  toggleVehicleSelection(index: number) {
  this.vehicleDetails[index].selected = !this.vehicleDetails[index].selected;
}


get visibleVehicleRows() {
  return this.fixedVehicleRows.filter(row => !row.hidden);
}
hideRowByData(row: any) {
  row.hidden = true;
}

displaySelectedVehicles(): void {
  const selected = this.vehicleDetails.filter((vehicle:any) => vehicle.selected);

  this.fixedVehicleRows = [...selected].map(vehicle => ({
    ...vehicle,
    hidden: false  // Initialize each vehicle with a visible state
  }));

  while (this.fixedVehicleRows.length < this.selectedVehicleRowCount) {
    this.fixedVehicleRows.push({
      Year: '',
      Make: '',
      BodyType: '',
      Value: null,
      VIN: '',
      hidden: false
    });
  }
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
  while (this.fixedVehicleRows.length < 10) {
    this.fixedVehicleRows.push({ ...emptyVehicle });
  }
}




  updateVehicleRows() {
  const emptyVehicle = {
    Year: '',
    Make: '',
    BodyType: '',
    Value: null,
    VIN: ''
  };

  // Slice the original vehicleDetails array to the selected count
  const limitedVehicles = this.vehicleDetails.slice(0, this.selectedVehicleRowCount);

  this.fixedVehicleRows = [...limitedVehicles];

  // Fill empty rows if fewer than selectedVehicleRowCount
  while (this.fixedVehicleRows.length < this.selectedVehicleRowCount) {
    this.fixedVehicleRows.push({ ...emptyVehicle });
  }
}

displaySelectedDrivers() {
  const selectedDrivers = this.driverDetails.filter((d:any) => d.selected);
  const emptyDriver = {
    DriverName: '',
    DriverLicenceNo: '',
    StateLicenced: '',
    Experience: ''
  };

  this.fixedDriverRows = [...selectedDrivers];

  while (this.fixedDriverRows.length < 8) {
    this.fixedDriverRows.push({ ...emptyDriver });
  }
}
resetDriverList() {
  const emptyDriver = {
    Name: '',
    DOB: '',
    LicenseNumber: '',
    YearofLicenceIssued: '',
    Experience: ''
  };

  this.fixedDriverRows = [...this.driverDetails];
  while (this.fixedDriverRows.length < 8) {
    this.fixedDriverRows.push({ ...emptyDriver });
  }
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

  selectedTransport: string = 'Interstate'; // Default selected option

  toggleTransport(option: string) {
    this.selectedTransport = this.selectedTransport === option ? '' : option;
  }

  isTransportChecked(option: string): boolean {
    return this.selectedTransport === option;
  }

  refuseChecked: boolean = true;
  propertyChecked: boolean = false;

  toggleCheckbox(option: string) {
    if (option === 'Refuse') {
      this.refuseChecked = !this.refuseChecked;
    } else if (option === 'Property') {
      this.propertyChecked = !this.propertyChecked;
    }
  }

  selectedOptions: { [key: string]: boolean } = {
    HazardousLow: true,
    HazardousHigh: false
  };

  toggleCheckbox1(option: string) {
    this.selectedOptions[option] = !this.selectedOptions[option];
  }
  

  isFirstChecked: boolean = false;

  toggleCheckbox2() {
    this.isFirstChecked = !this.isFirstChecked;
  }
  isFirstChecked3: boolean = false;

  toggleCheckbox3() {
    this.isFirstChecked3 = !this.isFirstChecked3;
  }

  isFirstChecked4: boolean = false;

  toggleCheckbox4() {
    this.isFirstChecked4 = !this.isFirstChecked4;
  }

  isFirstChecked5: boolean = false;

  toggleCheckbox5() {
    this.isFirstChecked5 = !this.isFirstChecked5;
  }
  isFirstChecked6: boolean = false;

  toggleCheckbox6() {
    this.isFirstChecked6 = !this.isFirstChecked6;
  }

  isFirstChecked7: boolean = false;

  toggleCheckbox7() {
    this.isFirstChecked7 = !this.isFirstChecked7;
  }
  isFirstChecked8: boolean = false;

  toggleCheckbox8() {
    this.isFirstChecked8 = !this.isFirstChecked8;
  }
  isFirstChecked9: boolean = false;

  toggleCheckbox9() {
    this.isFirstChecked9 = !this.isFirstChecked9;
  }

  isFirstChecked10: boolean = false;

  toggleCheckbox10() {
    this.isFirstChecked10 = !this.isFirstChecked10;
  }
  isFirstChecked11: boolean = false;

  toggleCheckbox11() {
    this.isFirstChecked11 = !this.isFirstChecked11;
  }
  isFirstChecked12: boolean = false;

  toggleCheckbox12() {
    this.isFirstChecked12 = !this.isFirstChecked12;
  }
  isFirstChecked13: boolean = false;

  toggleCheckbox13() {
    this.isFirstChecked13 = !this.isFirstChecked13;
  }
  isFirstChecked14: boolean = false;

  toggleCheckbox14() {
    this.isFirstChecked14 = !this.isFirstChecked14;
  }
 
  isCoverageChecked: boolean = true; // Default checked

  toggleCoverage() {
    this.isCoverageChecked = !this.isCoverageChecked;
  }

  isCoverageMoter: boolean = true; // Default checked

  toggleMoter() {
    this.isCoverageMoter = !this.isCoverageMoter;
  }
  isCoveragePd: boolean = false; // Default checked

  togglePd() {
    this.isCoveragePd = !this.isCoveragePd;
  }
  isCoverageGl: boolean = false; // Default checked

  toggleGl() {
    this.isCoverageGl = !this.isCoverageGl;
  }
  isDeductiblesMTC: boolean = true; // Default checked

  toggleDeductiblesMTC() {
    this.isDeductiblesMTC = !this.isDeductiblesMTC;
  }
  isDeductiblesPD: boolean = false; // Default checked

  toggleDeductiblesPD() {
    this.isDeductiblesPD = !this.isDeductiblesPD;
  }
}
