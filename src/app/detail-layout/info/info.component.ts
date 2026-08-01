import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SearchVehiclePipe } from '../../_SearchPipe/search-vehicle.pipe';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { InfoPipe } from './info.pipe';
import { VinYearPipe } from './vin-year.pipe';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AddVehicleByInfoComponent } from './add-vehicle-by-info/add-vehicle-by-info.component';


@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule ,MaterialModule ,HttpClientModule, VinYearPipe,InfoPipe,SpinnerComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  providers: [VinYearPipe] // ✅ Add this line
})
export class InfoComponent {

  
showSpiner = true
listOfInfo:any  =[];
accountId ='';
accountName ='';
lookUpCode:any;

MarkedPolicyId:any;
ChildPolicyID:any;
IsChildPolicyExist:any
EndorsementID:any;
searchTerm: string = '';
listOfAllDeleteVehicle:any =[];
showGetDeleteButton = true;
showAllVehicle = false;
showSaveButtion = true;
UserName:any;
marketedName:any;
alAmountShowZero = true;
bodyTypeCounts: { [key: string]: number } = {};
searchCriteria = {
  InspectionDate: '',
  VIN: '',
  UnitLicenseState: '',
  TotalViolations:'',
  TotalVehicleViolations:'',

 
};
showAllInfo = false;



constructor( private http:AllApiService,private router:Router,private toastr: ToastrService,private vinYearPipe: VinYearPipe,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
  this.http.listen().subscribe((m:any)=>{
    console.log(m)
     this.getAlpInfo()
  })
 }


ngOnInit(): void {
  this.UserName = sessionStorage.getItem('UserName')
  if(this.UserName == null){
    this.router.navigate(['/login'])
   
}
this.lookUpCode = localStorage.getItem('lookUpCode');


  this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
  this.marketedName = localStorage.getItem('marketedName')
 
  if(this.marketedName !== 'AL'){
    this.alAmountShowZero = false
  }
  this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
  
  this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
  
  
  this.EndorsementID = localStorage.getItem('EndorsementID')

  if(this.EndorsementID == null){
    this.EndorsementID = '0'
  }
  else{
    this.EndorsementID = localStorage.getItem('EndorsementID')
  }
  this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')
  if(this.IsChildPolicyExist == 'true'){
    this.showSaveButtion = false
  }
  else{
    this.showSaveButtion = true
  }
  
  this.viewDataOnBaseOfCondition()
  
}

changeLocation(){
  this.showAllInfo = true;
  this.viewDataOnBaseOfCondition()
}
AllViewOnCondtion(){
  this.showAllInfo = false;
  this.viewDataOnBaseOfCondition()
}

viewDataOnBaseOfCondition(){
  if(this.showAllInfo === true){
    this.getAlpInfo()
  }
  else{
    this.getInfoSingle()

  }

}




updateSearchCriteria(criteria: any) {
  this.searchCriteria = { ...this.searchCriteria, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

InspectionDateChange(newInspectionDate: string) {
  this.updateSearchCriteria({ InspectionDate: newInspectionDate });
  
}

onVINChange(newVIN: string) {
  this.updateSearchCriteria({ VIN: newVIN });
}

onUnitLicenseStateChange(newUnitLicenseState: string) {
  this.updateSearchCriteria({ UnitLicenseState: newUnitLicenseState });
}
onTotalViolationsChange(newTotalViolations: string) {
  this.updateSearchCriteria({ TotalViolations: newTotalViolations });
}
onTotalVehicleViolationsChange(newTotalVehicleViolations: string) {
  this.updateSearchCriteria({ TotalVehicleViolations: newTotalVehicleViolations });
}







getAlpInfo() {
  this.showSpiner = true;
  this.http.getAllDataId(ApiUrl.getInfo, this.lookUpCode)
    .pipe(
      catchError(error => {
        this.showSpiner = false;
        console.error('API error:', error);
        this.toastr.error('Failed to load inspection data');
        return of([]); // fallback
      })
    )
    .subscribe((data:any) => {
      this.showSpiner = false;
      this.listOfInfo = data || [];
      console.log('this.listOfInfo',this.listOfInfo)
    });
}


getInfoSingle() {
  this.showSpiner = true;
  this.http.getAllDataId(ApiUrl.getInfoSingleVehicle, this.lookUpCode)
    .pipe(
      catchError(error => {
        this.showSpiner = false;
        console.error('API error:', error);
        this.toastr.error('Failed to load inspection data');
        return of([]); // fallback
      })
    )
    .subscribe((data:any) => {
      this.showSpiner = false;
      this.listOfInfo = data || [];
      console.log('this.listOfInfo',this.listOfInfo)
    });
}
formatDate(dateNum: number): string {
  if (!dateNum || dateNum.toString().length !== 8) return '';

  const dateStr = dateNum.toString();
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10);
  const day = parseInt(dateStr.slice(6, 8), 10);

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US'); // outputs MM/dd/yyyy
}
extractBodyType(unitType: string | undefined | null): string {
  if (!unitType) return 'N/A';
  const words = unitType.trim().split(' ');
  return words[words.length - 1]; // get last word like 'Tractor' or 'Trailer'
}

exportToExcel(): void {
  const dataToExport = this.listOfInfo.map((data:any, index:any) => ({
   
    'Year': this.vinYearPipe.transform(data?.VIN),
    'Make': data?.UnitMake,
    'Model': '',
    
    // 'Unit Number': data?.UnitNumber,
    'BodyType': data?.UnitType,
    'VIN': data?.VIN,
    'VehicleType': '',
    'Value': '',
    'OwnershipType': '',
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const fileName = 'Vehicle_Info.xlsx';

  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(data, fileName);
  }

  getVinYear(vin: string): string {
  const vinYearMap: { [key: string]: string } = {
    A: '2010', B: '2011', C: '2012', D: '2013', E: '2014',
    F: '2015', G: '2016', H: '2017', J: '2018', K: '2019',
    L: '2020', M: '2021', N: '2022', P: '2023', R: '2024',
    S: '2025', T: '2026', V: '2027', W: '2028', X: '2029',
    Y: '2030', 1: '2001', 2: '2002', 3: '2003', 4: '2004',
    5: '2005', 6: '2006', 7: '2007', 8: '2008', 9: '2009'
  };
  const yearCode = vin?.charAt(9).toUpperCase();
  return vinYearMap[yearCode] || 'Unknown';
}



  addVehicleInfo(data:any) {
    const vinYear = this.getVinYear(data.VIN);

   
    const dialogRef = this.dialog.open(AddVehicleByInfoComponent, {
      disableClose: true,
      autoFocus: true,
      width: '750px',
      // height: '530px',
     data: {
      AccountID: this.accountId,
      VehicleID: data.VehicleID,
      ChildPolicyID: data.ChildPolicyID,
      EndorsementID: data.EndorsementID,
      MarkedPolicyID: data.MarkedPolicyID,
      Year: vinYear, // Set year extracted from VIN
      Make: data.UnitMake,
      Model: data.Model,
      // BodyType: data.BodyType,
      VIN: data.VIN,
      OwnerShipType: data.OwnerShipType,
      BodyType: data.UnitType,
      Value: data.Value,
      EnteredBy: data.EnteredBy,
      Camera: data.Camera,
      TeleMatic: data.TeleMatic
    }
      
    });
  
    
  }




}
