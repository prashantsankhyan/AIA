import { ChangeDetectorRef, Component } from '@angular/core';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SearchVehiclePipe } from '../../../_SearchPipe/search-vehicle.pipe';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditVehcileSupportComponent } from './add-edit-vehcile-support/add-edit-vehcile-support.component';
import { SupprtVehicleByExcelComponent } from './supprt-vehicle-by-excel/supprt-vehicle-by-excel.component';
@Component({
  selector: 'app-add-vehicle-support',
  standalone: true,
   imports: [CommonModule,MatButtonModule,FormsModule,SearchVehiclePipe ,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './add-vehicle-support.component.html',
  styleUrl: './add-vehicle-support.component.scss'
})
export class AddVehicleSupportComponent {



  showSpiner = true
  listOfAllVehilce:any =[];
  accountId ='';
  accountName ='';
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
    Year: '',
    VIN: '',
    BodyType: '',
    Model:'',
  };
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
       this.getAllVehicleList()
    })
   }
  
   
   ngOnInit(): void {
    this.UserName = sessionStorage.getItem('UserName')
    if(this.UserName == null){
      this.router.navigate(['/login'])
     
  }
  
  
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    this.getAllVehicleList()
    
  }
  
  
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }
  
  onYearChange(newYear: string) {
    this.updateSearchCriteria({ Year: newYear });
    
  }
  
  onVINChange(newVIN: string) {
    this.updateSearchCriteria({ VIN: newVIN });
  }
  
  onBodyTypeChange(newBodyType: string) {
    this.updateSearchCriteria({ BodyType: newBodyType });
  }
  onModelChange(newModel: string) {
    this.updateSearchCriteria({ Model: newModel });
  }
  
  
  
  
  


  
  getAllVehicleList(){
    
    this.http.getAllDataId(ApiUrl.getSupportAndReportTeamVehicle,this.accountId).subscribe(
      data=>{
        this.showSpiner  = false ;
        let response  = JSON.stringify(data)
        let obj = JSON.parse(response)
       this.listOfAllVehilce =  data?.Vehicles || [];;
     
  
      }
    )
  }

  
  openDialog(data:any) {
    
   
   
    const dialogRef = this.dialog.open(AddEditVehcileSupportComponent, {
      disableClose: true,
      autoFocus: true,
      width: '400px',
     
      data: {VehicleID:data.VehicleID,
       
      }
      
    });
  
    
  }

   addDataByExcel(data:any) {
    
   
   
    const dialogRef = this.dialog.open(SupprtVehicleByExcelComponent, {
      disableClose: true,
      autoFocus: true,
      width: '450px',
     
      data: {VehicleID:data.VehicleID,
       
      }
      
    });
  
    
  }
  


exportAsExcel() {
  const currencyFormatter = new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD' 
});
  const exportData = this.listOfAllVehilce.map((data: any, index: number) => ({
    'S.No': index + 1,
     'Unit': data?.Unit || '',
    'Year': data?.Year || '',
    'Make': data?.Make || '',
    'Model': data?.Model || '',
    'Body Type': data?.BodyType || '',
    'VIN': data?.VIN || '',
    'Policy Number': data?.PolicyNumber || '',
    'Option': data?.Option || '',
      'Value': currencyFormatter.format(data?.Value || 0), // ✅
    'Enter Date': data?.EnterDate ? this.formatDate(data.EnterDate) : '',
    'Description': data?.Description || '',
    'Entered By': data?.EnterBy || '',
    'Current Date': data?.CurrentDate ? this.formatDate(data.CurrentDate) : ''
  }));

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  // Auto column widths
  const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...exportData.map((row: any) => (row[key] ? row[key].toString().length : 0))
    ) + 2
  }));
  ws['!cols'] = colWidths;

  // Header Style: bold, 14pt, black, centered
  const headerKeys = Object.keys(exportData[0] || {});
  headerKeys.forEach((_, colIndex) => {
    const headerCellRef = XLSX.utils.encode_cell({ c: colIndex, r: 0 });
    if (ws[headerCellRef]) {
      ws[headerCellRef].s = {
        font: { bold: true, sz: 14, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  });

  // Row styling for Option = 'DELETE'
  exportData.forEach((row: any, rowIndex: number) => {
    if (row['Option'] && row['Option'].toString().toLowerCase() === 'delete') {
      headerKeys.forEach((_, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex + 1 });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { color: { rgb: "FF0000" }, bold: true },
            fill: { fgColor: { rgb: "FFC7CE" } } // light red background highlight
          };
        }
      });
    }
  });

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Vehicle List');

  const excelBuffer: any = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true
  });

  saveAs(
    new Blob([excelBuffer], { type: 'application/octet-stream' }),
    `Vehicle_List_${new Date().getTime()}.xlsx`
  );
}

// Helper for MM/dd/yyyy
formatDate(dateString: string): string {
  const dateObj = new Date(dateString);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${month}/${day}/${year}`;
}



  
 
  
  

}
