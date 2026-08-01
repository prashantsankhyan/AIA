import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
import { SearchDriverPipe } from '../../../_SearchPipe/search-driver.pipe';
import { SearchVehiclePipe } from '../../../_SearchPipe/search-vehicle.pipe';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-list-of-all-edit-by-endrosement',
  standalone: true,
   imports: [CommonModule,MaterialModule,SpinnerComponent,SearchDriverPipe,SearchVehiclePipe],
  templateUrl: './list-of-all-edit-by-endrosement.component.html',
  styleUrl: './list-of-all-edit-by-endrosement.component.scss'
})
export class ListOfAllEditByEndrosementComponent {
  showSpiner = true;
  AccountID:any;
  ChildPolicyID:any;
  MarkedPolicyID:any;
  EndorsementID:any;
  // listOfAllDriver:any =[];
  // listOfAllVehicle:any =[];
  listOfRemarks:any =[];
  driverLength:any;
  EndorsementType:any;
  showDriver = false;
  showVehicle = false;
  showRemarks  = false;
  searchCriteriaDrvier = {
    DriverName: '',
    DateofBirth: '',
    StateLicenced: '',
    DriverLicenceNo:'',
  };

   ListOfAllDriver:any=[];
  ListOfAllVehicle:any=[];
  searchCriteriaVehicle = {
    Year: '',
    VIN: '',
    BodyType: '',
    Model:'',
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private cdr: ChangeDetectorRef,private router:Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfAllEditByEndrosementComponent>) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      // this.getDriver()
    })
  }
  ngOnInit(): void {
    this.data; 
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    this.ChildPolicyID = this.data.ChildPolicyID;
    this.EndorsementID = this.data.EndorsementID;
    this.EndorsementType = this.data.EndorsementType

    if(this.EndorsementType === 'Driver'){
       this.showDriver  = true;
      
    }else  if(this.EndorsementType === 'Truck'){
      this.showVehicle = true;
     

    }else  if(this.EndorsementType === 'Trailer'){
      this.showVehicle = true;
     
    }else  if(this.EndorsementType === 'Other'){
      this.showRemarks = true;

    }

   

  
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    // this.getDriver();
    // this.getVehicle();
    this.getResultData();
   
   
 }
 updateSearchCriteriaDrivers(criteria: any) {
  this.searchCriteriaDrvier = { ...this.searchCriteriaDrvier, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onAttachmentDateChange(newAttachmentDate: string) {
  this.updateSearchCriteriaDrivers({ AttachmentDate: newAttachmentDate });
  
}

onDriverNameChange(newDriverName: string) {
  this.updateSearchCriteriaDrivers({ DriverName: newDriverName });
}

onDateofBirthChange(newDateofBirth: string) {
  this.updateSearchCriteriaDrivers({ DateofBirth: newDateofBirth });
}
onStateLicencedChange(newStateLicenced: string) {
  this.updateSearchCriteriaDrivers({ StateLicenced: newStateLicenced });
}

onDriverLicenceNoChange(newDriverLicenceNo: string) {
  this.updateSearchCriteriaDrivers({ DriverLicenceNo: newDriverLicenceNo });
}

//  getDriver() {
//   this.http.getAllDataByThreId(ApiUrl.getAllDriverRecord,this.MarkedPolicyID,this.ChildPolicyID,this.EndorsementID).subscribe(
//     data => {
//       this.showSpiner  = false ;
//       let response  = JSON.stringify(data)
//       let obj = JSON.parse(response)
//      this.listOfAllDriver = obj.Drivers
//      this.driverLength = this.listOfAllDriver.length
//     }
//   );
// }

    getResultData() {
    this.http.getAllDataByTwoId(ApiUrl.submitChangeRequestForDriverAndVehicle, this.AccountID, this.EndorsementID)
      .subscribe(data => {
        const obj = JSON.parse(JSON.stringify(data));
        this.ListOfAllDriver = obj.Drivers || [];
        this.ListOfAllVehicle = obj.Vehicles || [];
         this.showSpiner  = false ;
      });
  }


updateSearchCriteriaVehicles(criteria: any) {
  this.searchCriteriaVehicle = { ...this.searchCriteriaVehicle, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onYearChange(newYear: string) {
  this.updateSearchCriteriaVehicles({ Year: newYear });
  
}

onVINChange(newVIN: string) {
  this.updateSearchCriteriaVehicles({ VIN: newVIN });
}

onBodyTypeChange(newBodyType: string) {
  this.updateSearchCriteriaVehicles({ BodyType: newBodyType });
}
onModelChange(newModel: string) {
  this.updateSearchCriteriaVehicles({ Model: newModel });
}


// getVehicle() {
//   this.http.getAllDataByThreId(ApiUrl.getAllVehicleRecords,this.MarkedPolicyID,this.ChildPolicyID,this.EndorsementID).subscribe(
//     data => {
//       this.showSpiner  = false ;
//       let response  = JSON.stringify(data)
//       let obj = JSON.parse(response)
//      this.listOfAllVehicle =  data?.Vehicles;
//    });}


exportDataToExcel() {
  const workbook = new ExcelJS.Workbook();

  // --- Drivers Sheet ---
  const driverSheet = workbook.addWorksheet('Drivers');

  const driverHeaders = ['Driver Name', 'Driver Stage', 'Date Of Birth', 'Issued Year', 'State', 'Licence No', 'Age', 'Experience', 'Status', 'Entered By'];
  driverSheet.addRow(driverHeaders);

  this.ListOfAllDriver.forEach((driver: any) => {
    const row = driverSheet.addRow([
      driver.DriverName || '',
      driver.DriverStage || '',
      driver.DateofBirth ? this.formatDate(driver.DateofBirth) : '',
      driver.YearofLicenceIssued ? this.formatDate(driver.YearofLicenceIssued) : '',
      driver.StateLicenced || '',
      driver.DriverLicenceNo || '',
      driver.Age || '',
      driver.Experience || '',
      driver.Status || '',
      driver.EnteredBy || driver.UpdatedBy || ''
    ]);

    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', wrapText: true };  // Wrap text in cell
    });
  });

  // Freeze header row
  driverSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Auto-fit Driver Sheet Columns
  driverHeaders.forEach((header, index) => {
    const column = driverSheet.getColumn(index + 1);
    let maxLength = 10;  // Minimum width
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });
    column.width = maxLength + 2;  // Add padding
  });

  // --- Vehicles Sheet ---
  const vehicleSheet = workbook.addWorksheet('Vehicles');
  const vehicleHeaders = ['Year', 'Make', 'Model', 'VIN', 'OwnerShipType', 'Vehicle Type', 'BodyType', 'Value', 'Status', 'EnteredBy'];
  vehicleSheet.addRow(vehicleHeaders);

  this.ListOfAllVehicle.forEach((vehicle: any) => {
    const row = vehicleSheet.addRow([
      vehicle.Year || '',
      vehicle.Make || '',
      vehicle.Model || '',
      vehicle.VIN || '',
      vehicle.OwnerShipType || '',
      vehicle.VehicleType || '',
      vehicle.BodyType || '',
      vehicle.Value != null ? vehicle.Value : '',
      vehicle.Status || '',
      vehicle.EnteredBy || vehicle.UpdatedBy || ''
    ]);

    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', wrapText: true };  // Wrap text in cell
    });
  });

  // Freeze header row in Vehicle sheet
  vehicleSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Auto-fit Vehicle Sheet Columns
  vehicleHeaders.forEach((header, index) => {
    const column = vehicleSheet.getColumn(index + 1);
    let maxLength = 10;  // Minimum width
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });
    column.width = maxLength + 2;  // Add padding
  });

  // Export File
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'EnterDataByEndrosement.xlsx');
  });
}

// --- Date Formatter Helper ---
formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}






   cancleModel(): void {
    this.dialogRef.close();
    
   
  }
}
