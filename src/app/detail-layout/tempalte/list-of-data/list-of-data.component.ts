import { Component } from '@angular/core';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-list-of-data',
  standalone: true,
   imports: [CommonModule,NgxPrintModule,FormsModule],
  templateUrl: './list-of-data.component.html',
  styleUrl: './list-of-data.component.scss'
})
export class ListOfDataComponent {
 emailLink ='motorcarrier@amtrustgroup.com'
  showSpiner = true
 
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
  TotalVehiclesTractor:any;
  effectiveDate: string = '';
  userName:any;
  accountId:any;
  MarkedPolicyId:any;
  vehicleDetails:any=[];
  driverDetails:any=[];
  today: Date = new Date();
  ClientSummary:any=[];
  Detail:any=[];
  LossRunSummaray:any=[];
  AutoLiability:any=[];
  AutoPhysicalDamage:any=[];
  MoterTruckCargo:any=[];
  Coverage:any =[];
  Personnel:any=[];
  
  setEffective = new Date(); 
  Expiration:any
 Effective:any
  constructor(
 
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
  getListOfData(){
    this.http.getAllDataByThreId(ApiUrl.getDataForAttachSmallAccountFile,this.accountId,this.MarkedPolicyId,this.ChildPolicyID).subscribe(data =>{
      this.showSpiner = false
      let response = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.listOfData = obj;
      this.vehicleDetails = obj.Vehicles;
      // this.driverDetails = obj.Drivers;
      this.driverDetails = obj.Drivers.map((driver: any) => ({
        ...driver,
        Experience: this.getDriverExperience(driver.YearofLicenceIssued) // Calculate experience dynamically
      }));

      this.ClientSummary =obj.ClientSummary;
      this.TotalVehiclesTractor = [obj.Detail]; 
      this.LossRunSummaray = obj.ClientSummary.LossRunSummaray;

      this.AutoLiability= obj.ClientSummary[0].Liabilities;
      this.AutoPhysicalDamage=obj.ClientSummary[0].PhysicalDamage
      this.MoterTruckCargo = obj.ClientSummary[0].MotorTruckCargo;
      this.Coverage = obj.ClientSummary[0].Coverage;
      
     this.Personnel =obj.ClientSummary[0].Personnel;
      console.log("Vehicle Details:", this.vehicleDetails);
      console.log("Driver Details:", this.driverDetails);
      console.log(Array.isArray(this.listOfData));
      
      
    })
    this.getCommodity()
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
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
        this.listOfCommodity = data.Commodity.filter((commodity: any) => this.hasData(commodity));
        console.log('Filtered listOfCommodity', this.listOfCommodity);
        console.log('this.listOfCommodity',this.listOfCommodity)
      
      
  
      
      },
     
    );
  }
  hasData(commodity: any): boolean {
    return (
      commodity.AvgValue !== '' ||
      commodity.MajorShipper !== '' ||
      commodity.MaxValue !== '' ||
      commodity.Total !== '' ||
      commodity.Type !== ''
    );
  }
  selectedOption: string = 'Corporation'; // Default selected option

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

  exportToExcel() {
    const element = document.getElementById('print-section');
    if (!element) return;
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'exported-file.xlsx');
  }
  exportToExcelFromJson(data: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'data.xlsx');
  }
}
