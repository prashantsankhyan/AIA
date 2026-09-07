import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';

@Component({
  selector: 'app-certs-view-truck-driver',
  standalone: true,
  imports: [CommonModule,MatButtonModule,HttpClientModule,FormsModule],
  templateUrl: './certs-view-truck-driver.component.html',
  styleUrl: './certs-view-truck-driver.component.scss'
})
export class CertsViewTruckDriverComponent {
showEndrosementList = true;
  searchText: string = '';

  MarkedPolicyID:any;
  listOfAllData:any =[];
  filteredDrivers: any[] = [];
filteredVehicles: any[] = [];
ChildPolicyID:any;
repostingType:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<CertsViewTruckDriverComponent>){}
  ngOnInit(): void {
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    this.ChildPolicyID = this.data.ChildPolicyID

    
     this.getListOfAllData();
     this.getData();

   }

    getData() {

  this.http
    .getAllDataId(
      ApiUrl.getPolicyStatus,
      this.ChildPolicyID
    )
    .subscribe((data: any) => {

      const obj =
        typeof data === 'string'
          ? JSON.parse(data)
          : data;

      if (obj?.Reposting?.length > 0) {

        const repostingData = obj.Reposting[0];

        this.repostingType = repostingData.RepostingType;
        const enteredBy = repostingData.EnteredBy;

        console.log('RepostingType:', this.repostingType);
        console.log('EnteredBy:', enteredBy);

      }

    });

}
   

   getListOfAllData(){
    this.http.getAllDataId(ApiUrl.getAllDetailForPolicyAndAnoter,this.MarkedPolicyID).subscribe(
      data=>{
     
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfAllData = obj.servSummary;
         this.filteredDrivers = this.listOfAllData.Drivers || [];
    this.filteredVehicles = this.listOfAllData.Vehicles || [];
        this.showEndrosementList = false

        // var obj  = JSON.parse(response)servSummary
        
      
  
      }
    )   
  }

  onSearchChange(): void {

  const search = this.searchText.trim().toLowerCase();

  if (!search) {
    this.filteredDrivers = this.listOfAllData.Drivers || [];
    this.filteredVehicles = this.listOfAllData.Vehicles || [];
    return;
  }

  // Driver search
  this.filteredDrivers = (this.listOfAllData.Drivers || []).filter((driver: any) =>
    String(driver.DriverName || '').toLowerCase().includes(search) ||
    String(driver.DriverLicenceNo || '').toLowerCase().includes(search) ||
    String(driver.StateLicenced || '').toLowerCase().includes(search)
  );

  // Vehicle search
  this.filteredVehicles = (this.listOfAllData.Vehicles || []).filter((vehicle: any) =>
    String(vehicle.VehicleType || '').toLowerCase().includes(search) ||
    String(vehicle.Year || '').toLowerCase().includes(search) ||
    String(vehicle.Make || '').toLowerCase().includes(search) ||
    String(vehicle.Model || '').toLowerCase().includes(search) ||
    String(vehicle.VIN || '').toLowerCase().includes(search)
  );
}
exportToExcel(): void {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Policy Details');

  // =====================================================
  // TITLE
  // =====================================================

  worksheet.mergeCells('A1:G1');

  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'POLICY DRIVER & VEHICLE DETAILS';
  titleCell.font = {
    bold: true,
    size: 16
  };
  titleCell.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  worksheet.getRow(1).height = 28;

  // =====================================================
  // POLICY INFORMATION
  // =====================================================

  worksheet.mergeCells('A2:G2');

  const policyCell = worksheet.getCell('A2');
  policyCell.value = `Marked Policy ID: ${this.MarkedPolicyID}`;
  policyCell.font = {
    bold: true,
    size: 11
  };

  // =====================================================
  // DRIVERS TITLE
  // =====================================================

  worksheet.mergeCells('A4:F4');

  const driverTitle = worksheet.getCell('A4');
  driverTitle.value = 'DRIVERS';
  driverTitle.font = {
    bold: true,
    size: 13
  };
  driverTitle.alignment = {
    horizontal: 'center'
  };

  // =====================================================
  // DRIVER HEADERS
  // =====================================================

  const driverHeaders = [
    'Driver S.NO',
    'Name',
    'Licence Issued',
    'Date of Birth',
    'State Licenced',
    'Licence No'
  ];

  worksheet.getRow(5).values = driverHeaders;

  worksheet.getRow(5).font = {
    bold: true
  };

  worksheet.getRow(5).alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  // =====================================================
  // DRIVER DATA
  // =====================================================

  let driverRow = 6;

  (this.listOfAllData?.Drivers || []).forEach(
    (driver: any, index: number) => {

      const row = worksheet.getRow(driverRow);

      row.values = [
        `${index + 1} - ${
          driver.EndorsementID === 0
            ? 'By Policy'
            : 'By Endorsement'
        }`,
        driver.DriverName || '',
        driver.YearofLicenceIssued
          ? new Date(driver.YearofLicenceIssued)
          : '',
        driver.DateofBirth
          ? new Date(driver.DateofBirth)
          : '',
        driver.StateLicenced || '',
        driver.DriverLicenceNo || ''
      ];

      row.getCell(3).numFmt = 'mm/dd/yyyy';
      row.getCell(4).numFmt = 'mm/dd/yyyy';

      driverRow++;
    }
  );

  // =====================================================
  // VEHICLE SECTION
  // =====================================================

  const vehicleTitleRow = driverRow + 2;

  worksheet.mergeCells(
    `A${vehicleTitleRow}:G${vehicleTitleRow}`
  );

  const vehicleTitle =
    worksheet.getCell(`A${vehicleTitleRow}`);

  vehicleTitle.value = 'VEHICLES';

  vehicleTitle.font = {
    bold: true,
    size: 13
  };

  vehicleTitle.alignment = {
    horizontal: 'center'
  };

  // =====================================================
  // VEHICLE HEADERS
  // =====================================================

  const vehicleHeaderRow = vehicleTitleRow + 1;

  const vehicleHeaders = [
    'Vehicle S.NO',
    'Type',
    'Year',
    'Make',
    'Model',
    'VIN',
    'Value'
  ];

  worksheet.getRow(vehicleHeaderRow).values =
    vehicleHeaders;

  worksheet.getRow(vehicleHeaderRow).font = {
    bold: true
  };

  worksheet.getRow(vehicleHeaderRow).alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  // =====================================================
  // VEHICLE DATA
  // =====================================================

  let vehicleRow = vehicleHeaderRow + 1;

  (this.listOfAllData?.Vehicles || []).forEach(
    (vehicle: any, index: number) => {

      const row = worksheet.getRow(vehicleRow);

      row.values = [
        `${index + 1} - ${
          vehicle.EndorsementID === 0
            ? 'By Policy'
            : 'By Endorsement'
        }`,
        vehicle.VehicleType || '',
        vehicle.Year || '',
        vehicle.Make || '',
        vehicle.Model || '',
        vehicle.VIN || '',
        Number(vehicle.Value || 0)
      ];

      row.getCell(7).numFmt = '$#,##0.00';

      vehicleRow++;
    }
  );

  // =====================================================
  // REMARKS
  // =====================================================

  const remarkStartRow = vehicleRow + 2;

  worksheet.mergeCells(
    `A${remarkStartRow}:G${remarkStartRow}`
  );

  worksheet.getCell(`A${remarkStartRow}`).value =
    'REMARKS';

  worksheet.getCell(`A${remarkStartRow}`).font = {
    bold: true,
    size: 13
  };

  let remarkRow = remarkStartRow + 1;

  (this.listOfAllData?.Remarks || []).forEach(
    (remark: any) => {

      worksheet.mergeCells(
        `A${remarkRow}:G${remarkRow}`
      );

      worksheet.getCell(`A${remarkRow}`).value =
        remark.Remarks || '';

      remarkRow++;
    }
  );

  // =====================================================
  // BORDERS
  // =====================================================

  worksheet.eachRow((row) => {

    row.eachCell((cell) => {

      cell.border = {
        top: {
          style: 'thin'
        },
        left: {
          style: 'thin'
        },
        bottom: {
          style: 'thin'
        },
        right: {
          style: 'thin'
        }
      };

      cell.alignment = {
        vertical: 'middle'
      };

    });

  });

  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  worksheet.getColumn(1).width = 20;
  worksheet.getColumn(2).width = 25;
  worksheet.getColumn(3).width = 18;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 25;
  worksheet.getColumn(7).width = 18;

  // =====================================================
  // FREEZE
  // =====================================================

  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 5
    }
  ];

  // =====================================================
  // FILTER DRIVER TABLE
  // =====================================================

  if ((this.listOfAllData?.Drivers || []).length > 0) {

    worksheet.autoFilter = {
      from: 'A5',
      to: `F${driverRow - 1}`
    };

  }

  // =====================================================
  // FILTER VEHICLE TABLE
  // =====================================================

  if ((this.listOfAllData?.Vehicles || []).length > 0) {

    worksheet.autoFilter = {
      from: `A${vehicleHeaderRow}`,
      to: `G${vehicleRow - 1}`
    };

  }

  // =====================================================
  // DOWNLOAD
  // =====================================================

  workbook.xlsx.writeBuffer().then((buffer: any) => {

    const blob = new Blob(
      [buffer],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    saveAs(
      blob,
      `Policy_Driver_Vehicle_${this.MarkedPolicyID}.xlsx`
    );

  });
}
  closeModel(): void {
    this.dialogRef.close();
   
  }
}

