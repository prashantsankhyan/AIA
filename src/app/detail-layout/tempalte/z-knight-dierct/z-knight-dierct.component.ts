import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { NgxPrintModule } from 'ngx-print';
import * as ExcelJS from 'exceljs';
import 'file-saver';  // Import without types
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

declare var saveAs: any;  // Declare global saveAs if types are missing


@Component({
  selector: 'app-z-knight-dierct',
  standalone: true,
  imports:[CommonModule,MaterialModule,NgxPrintModule,],
  templateUrl: './z-knight-dierct.component.html',
  styleUrl: './z-knight-dierct.component.scss'
})
export class ZKnightDierctComponent {
  accountId: any;
  userName: any;
  MarkedPolicyId: any;
  ChildPolicyID: any;
  showSpiner = true;
  listOfCommodity: any[] = [];
  listOfData: any = {};
  listOfRemarks:any=[];

  constructor(
    private httpClient: HttpClient,
    private http: AllApiService,
    private router: Router,
    private toastr: ToastrService,
  
  ) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('UserName');
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '{}');
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID');
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    this.getListOfData();
    this.getListOfRemarks()
  }
  private formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

  getListOfData() {
    this.http.getAllDataByThreId(ApiUrl.getDataForAttachSmallAccountFile, this.accountId, this.MarkedPolicyId, this.ChildPolicyID).subscribe(data => {
      this.showSpiner = false;
      this.listOfData = data;
      console.log('Business Info:', this.listOfData);
    });
    this.getCommodity();
    
  }

  getCommodity() {
    this.http.getAllDataByTwoId(ApiUrl.GetAllCommodityByChildandMarkedPolicyID, this.MarkedPolicyId, this.ChildPolicyID).subscribe(data => {
      this.listOfCommodity = data.Commodity;
      console.log('Commodity Loaded:', this.listOfCommodity);
    });
  }
    getListOfRemarks() {
  this.http.getAllDataId(ApiUrl.getRemarksById, this.accountId).subscribe({
    next: (res: any) => {
    
      const rawRemarks = res?.Brokers || [];
      this.listOfRemarks = rawRemarks;

    
    },
    error: (err) => {
      console.error('Failed to fetch remarks:', err);
     
    }
  });
}

  async fillExcelTemplate() {
    try {
      const templateBuffer = await firstValueFrom(
        this.httpClient.get('assets/z-Knight.xlsx', { responseType: 'arraybuffer' })
      );

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(templateBuffer);

      const sheet = workbook.getWorksheet('Application Info');
      if (!sheet) {
        console.error('Sheet "Application Info" not found.');
        return;
      }

      // Fill static business info cells
      const infoMap: Record<string, any> = {
          'E07': this.formatDate(new Date()),
           'K07': this.listOfData.EffectiveDate || '',
        'E22': this.listOfData.AccountName || '',
        'E23': this.listOfData.BDA || '',
        'E24': this.listOfData.AccountPrimaryDetail?.[0]?.Name || '',
        'J24': this.listOfData.AccountPrimaryDetail?.[0]?.Title || '',
        'E25': this.listOfData.PhoneNumber || '',
        'J25': this.listOfData.EmailID || '',

        'E27': this.listOfData.GaragingAddress || '',
        'G28': this.listOfData.GaragingCity || '',
        'I28': this.listOfData.GaragingState || 'CA',
        'K28': this.listOfData.GaragingPinCode || '',
        
        'E29': this.listOfData.Description || '',
        'E30': this.listOfData.City || '',
        'I30': this.listOfData.State || '',
        'K30': this.listOfData.ZIP || '',

       'D34': this.listOfData.AccountIdentificationDetail?.[0]?.IdentificationNumber || '',
        'F34': this.listOfData.LookUpCode || '',
        'H34': this.listOfData.MC || '',
        // 'I34': this.listOfData.DateOfAuthority || '',
        // 'J34': this.listOfData.StateID || '',

        'H36': this.listOfData.OperationType || '',
        'L36': this.listOfData.YearInBusiness || ''
      };

      for (const [cell, value] of Object.entries(infoMap)) {
        sheet.getCell(cell).value = value;
      }


// const liabilityValue = this.listOfRemarks[0]?.AutoLiability || 0;
// const liabilityCell = sheet.getCell('E48');

// liabilityCell.value = liabilityValue;
// liabilityCell.numFmt = '"$"#,##0.00';  
const liabilityValue = this.listOfRemarks[0]?.AutoLiability ? Number(this.listOfRemarks[0]?.AutoLiability) : null;  // Only convert if available, else set null
const liabilityCell = sheet.getCell('E48');

if (liabilityValue !== null && !isNaN(liabilityValue)) {
  liabilityCell.value = liabilityValue;  // Set raw number only if valid
  liabilityCell.numFmt = '"$"#,##';  // Format as Currency (e.g., $1,000,000.00)
} else {
  liabilityCell.value = '';  // Leave cell empty if no valid liability value
}

// === Fill General Liability Limits Section from this.listOfRemarks[0] ===
const generalLiabilityData = this.listOfRemarks[0] || {};

const liabilityMap = [
  { cell: 'E71', value: generalLiabilityData.GLC_occurence },       // General Liability Each Occurrence Limit
  { cell: 'E72', value: generalLiabilityData.GLC_GeneralAgg },       // General Aggregate Limit
  { cell: 'E73', value: generalLiabilityData.GLC_Productcomp },      // Products and Completed Operations Aggregate
  { cell: 'E74', value: generalLiabilityData.GLC_PersonalAdv },      // Personal and Advertising Injury Limit
  { cell: 'E75', value: generalLiabilityData.GLC_occurence },        // Each Occurrence Limit (Same as Occurrence)
  { cell: 'E76', value: generalLiabilityData.GLC_DamageToRented },   // Damage to Premises Rented to You
  { cell: 'E77', value: generalLiabilityData.GLC_MedExp },           // Medical Expenses Limit
  // { cell: 'E78', value: generalLiabilityData.GLC_Others }            // Employee Benefits Liability
];

for (const item of liabilityMap) {
  const cell = sheet.getCell(item.cell);
  const numericValue = Number(item.value);
  cell.value = isNaN(numericValue) ? '' : numericValue;
  cell.numFmt = '"$"#,##';  // Currency format
}


 // === Mailing Address "Check if Same" Checkbox (C29:D29) ===
const physicalAddress = (this.listOfData.GaragingAddress || '').trim().toLowerCase();
const mailingAddress = (this.listOfData.MailingAddress || '').trim().toLowerCase();

const checkBoxCell = sheet.getCell('C29');  // Cell for checkbox + text

// Set default value based on Address Comparison
if (physicalAddress === mailingAddress && physicalAddress !== '') {
  checkBoxCell.value = '☑ Check if same';  // Checked
} else {
  checkBoxCell.value = '☐ Check if same';  // Unchecked
}

// Center-align text in the cell (middle)
checkBoxCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

// Add Dropdown Data Validation in C29
checkBoxCell.dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['"☑ Check if same,☐ Check if same"']
};



      // === Entity Marking Logic ===
   const entityHeaderRow = 31;
const checkmarkRow = entityHeaderRow + 1;

const entityColumnsMap: { [entity: string]: number } = {
  'Corporation': 4,           // Column C
  'LLC': 6,                   // Column F
  'Sole Proprietorship': 8,   // Column H
  'Partnership': 10,          // Column J
  'Other': 12                 // Column L
};

let entityToMark = (this.listOfData.EntityType || '').trim().toLowerCase();
const accountName = (this.listOfData.AccountName || '').toLowerCase();

if (accountName.includes('llc')) {
  entityToMark = 'llc';
}

const validEntities = Object.keys(entityColumnsMap).map(e => e.toLowerCase());
if (!validEntities.includes(entityToMark)) {
  entityToMark = 'corporation';  // fallback
}

console.log('Entity to mark:', entityToMark);

for (const [entity, col] of Object.entries(entityColumnsMap)) {
  const header = (sheet.getRow(entityHeaderRow).getCell(col).value || '').toString().trim();
  console.log(`Column ${col} header: "${header}"`);

  if (entity.toLowerCase() === entityToMark) {
    sheet.getRow(checkmarkRow).getCell(col).value = 'Yes';
    console.log(`✓ Marked "${entity}" at column ${col}`);

    if (entity === 'Other' && this.listOfData.OtherEntityDescription) {
      sheet.getRow(checkmarkRow).getCell(col + 1).value = this.listOfData.OtherEntityDescription;
    }

    break;
  }
}



   

      // Fill MotorTruckCargo Table
      const startRow = 63;
      for (let i = 0; i < this.listOfCommodity.length; i++) {
        const item = this.listOfCommodity[i];
        const currentRow = startRow + i;

        sheet.getCell(`C${currentRow}`).value = item?.Type || '';

        const totalCell = sheet.getCell(`E${currentRow}`);
       const totalVal = item?.Total || '';
if (totalVal === '' || totalVal === null) {
  totalCell.value = '';  // Leave the cell empty if null or empty
} else if (typeof totalVal === 'string' && totalVal.includes('%')) {
  totalCell.value = totalVal;  // Keep the string percentage (e.g., "25%")
} else {
  const numericTotal = Number(totalVal);
  totalCell.value = !isNaN(numericTotal) ? numericTotal / 100 : '';
  totalCell.numFmt = '0%';  // Format as percentage without decimal places
}

        const avgCell = sheet.getCell(`F${currentRow}`);
        const avgVal = item?.AvgValue || '';
        const numericAvg = Number(avgVal.toString().replace(/[^0-9.-]+/g, ''));
        avgCell.value = isNaN(numericAvg) ? '' : numericAvg;
        avgCell.numFmt = '"$"#,##0.00';

        const maxCell = sheet.getCell(`G${currentRow}`);
        const maxVal = item?.MaxValue || '';
        const numericMax = Number(maxVal.toString().replace(/[^0-9.-]+/g, ''));
        maxCell.value = isNaN(numericMax) ? '' : numericMax;
        maxCell.numFmt = '"$"#,##0.00';
      }

      const driversSheet = workbook.getWorksheet('Drivers and Vehicles');
if (!driversSheet) {
  console.error('Sheet "Drivers and Vehicles" not found.');
  return;
}

// Fill Drivers Information (Starting from Row 3)
const normalFont = { name: 'Calibri', size: 11, bold: false }; // Standard Excel look
const driversStartRow = 3;
let driverSerialNum = 1; // Start from 1

for (let i = 0; i < this.listOfData.Drivers.length; i++) {
  const driver = this.listOfData.Drivers[i];
  const row = driversSheet.getRow(driversStartRow + i);
   row.getCell('A').value = driverSerialNum++;
  row.getCell('A').font = normalFont;

  const nameParts = (driver.DriverName || '').split(' ');
 

  row.getCell('B').value = nameParts[0] || '';
  row.getCell('B').font = normalFont;

  row.getCell('C').value = '';
  row.getCell('C').font = normalFont;

  row.getCell('D').value = nameParts.slice(1).join(' ') || '';
  row.getCell('D').font = normalFont;

  row.getCell('E').value = driver.DateofBirth ? new Date(driver.DateofBirth) : '';
  row.getCell('E').numFmt = 'mm/dd/yyyy';
  row.getCell('E').font = normalFont;

  row.getCell('F').value = driver.YearofLicenceIssued ? new Date(driver.YearofLicenceIssued) : '';
  row.getCell('F').numFmt = 'mm/dd/yyyy';
  row.getCell('F').font = normalFont;

  row.getCell('H').value = driver.DriverLicenceNo || '';
  row.getCell('H').font = normalFont;

  row.getCell('I').value = driver.StateLicenced || '';
  row.getCell('I').font = normalFont;

  row.getCell('J').value = driver.DriverType || '';
  row.getCell('J').font = normalFont;

  row.getCell('K').value = driver.Experience || '';
  row.getCell('K').font = normalFont;
}

// Commit rows
driversSheet.eachRow({ includeEmpty: false }, (row) => {
  row.commit();
});


// === Fill Vehicle Data ===
// const vehiclesStartRow = 3;
// for (let i = 0; i < this.listOfData.Vehicles.length; i++) {
//   const vehicle = this.listOfData.Vehicles[i];
//   const row = driversSheet.getRow(vehiclesStartRow + i);

//   row.getCell('S').value = vehicle.Year || '';
//   row.getCell('S').font = normalFont;

//   row.getCell('T').value = vehicle.Make || '';
//   row.getCell('T').font = normalFont;

//   row.getCell('U').value = vehicle.Model || '';
//   row.getCell('U').font = normalFont;

//   row.getCell('V').value = vehicle.VIN || '';
//   row.getCell('V').font = normalFont;

//   row.getCell('W').value = vehicle.VehicleType || '';
//   row.getCell('W').font = normalFont;

//   row.getCell('AC').value = vehicle.OwnerShipType || '';
//   row.getCell('AC').font = normalFont;
// }
const normalFontVehicle = { name: 'Calibri', size: 11, bold: false };
const vehiclesStartRow = 3;
let excelRowIndex = 0; // This will control the row position without gaps
let serialNum = 1; 

for (let i = 0; i < this.listOfData.Vehicles.length; i++) {
  const vehicle = this.listOfData.Vehicles[i];

  // Skip trailers
  if ((vehicle.BodyType || '').toLowerCase() === 'trailer') {
    continue;
  }

  const row = driversSheet.getRow(vehiclesStartRow + excelRowIndex);
row.getCell('R').value = serialNum++;
  row.getCell('R').font = normalFontVehicle;
  row.getCell('S').value = vehicle.Year || '';
  row.getCell('S').font = normalFontVehicle;

  row.getCell('T').value = vehicle.Make || '';
  row.getCell('T').font = normalFontVehicle;

  row.getCell('U').value = vehicle.Model || '';
  row.getCell('U').font = normalFontVehicle;

  row.getCell('V').value = vehicle.VIN || '';
  row.getCell('V').font = normalFontVehicle;

  row.getCell('W').value = vehicle.BodyType || '';
  row.getCell('W').font = normalFontVehicle;
   row.getCell('X').value = '33000';
  row.getCell('X').font = normalFontVehicle;
   row.getCell('Z').value = 'CA';
  row.getCell('Z').font = normalFontVehicle;

  row.getCell('AC').value = vehicle.OwnerShipType || '';
  row.getCell('AC').font = normalFontVehicle;
   row.getCell('AD').value = this.listOfData.GaragingPinCode || '';
  row.getCell('AD').font = normalFontVehicle;

  excelRowIndex++; // Move to next Excel row only for non-trailers
}


// Commit vehicle rows
driversSheet.eachRow({ includeEmpty: false }, (row) => {
  row.commit();
});

      

      // Export Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `ZKnight_Export_${new Date().getTime()}.xlsx`);
      this.toastr.success('Excel Exported Successfully!');
    } catch (error) {
      console.error('Error filling Excel:', error);
      this.toastr.error('Failed to generate Excel');
    }
  }

}


