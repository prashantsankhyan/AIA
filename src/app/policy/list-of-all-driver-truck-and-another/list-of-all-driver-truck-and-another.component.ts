import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-of-all-driver-truck-and-another',
  standalone: true,
  imports: [CommonModule,MatButtonModule,HttpClientModule,FormsModule],
  templateUrl: './list-of-all-driver-truck-and-another.component.html',
  styleUrl: './list-of-all-driver-truck-and-another.component.scss'
})
export class ListOfAllDriverTruckAndAnotherComponent {
  showEndrosementList = true;
  searchText: string = '';
  ChildPolicyID:any;
  MarkedPolicyID:any;
  EndrosememtId ='0'
  listOfAllData:any =[];
  filteredDrivers: any[] = [];
filteredVehicles: any[] = [];
filteredDeletedDrivers: any[] = [];
filteredDeletedVehicles: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfAllDriverTruckAndAnotherComponent>){}
  ngOnInit(): void {
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID; 
    this.ChildPolicyID = this.data.ChildPolicyID;

    
     this.getListOfAllData()

   }


getListOfAllData(): void {
  this.http.getAllDataByThreId(
    ApiUrl.allEditDeleteUpdatedDataList,
    this.MarkedPolicyID,
    this.ChildPolicyID,
    this.EndrosememtId
  ).subscribe({
    next: (data: any) => {

      console.log('API Response:', data);

      this.listOfAllData = data || {};

      // Active
      this.filteredDrivers = this.listOfAllData.Drivers || [];
      this.filteredVehicles = this.listOfAllData.Vehicles || [];

      // Deleted
      this.filteredDeletedDrivers =
        this.listOfAllData.DeletedDrivers || [];

      this.filteredDeletedVehicles =
        this.listOfAllData.DeletedVehicles || [];

      console.log('Drivers:', this.listOfAllData.Drivers);
      console.log('Deleted Drivers:', this.listOfAllData.DeletedDrivers);

      console.log('Vehicles:', this.listOfAllData.Vehicles);
      console.log('Deleted Vehicles:', this.listOfAllData.DeletedVehicles);

      this.showEndrosementList = false;
    },

    error: (error) => {
      console.error('API Error:', error);

      this.listOfAllData = {};

      this.filteredDrivers = [];
      this.filteredVehicles = [];
      this.filteredDeletedDrivers = [];
      this.filteredDeletedVehicles = [];
    }
  });
}
onSearchChange(): void {

  const search = this.searchText.trim().toLowerCase();

  if (!search) {

    this.filteredDrivers =
      this.listOfAllData?.Drivers || [];

    this.filteredVehicles =
      this.listOfAllData?.Vehicles || [];

    this.filteredDeletedDrivers =
      this.listOfAllData?.DeletedDrivers || [];

    this.filteredDeletedVehicles =
      this.listOfAllData?.DeletedVehicles || [];

    return;
  }

  // ============================
  // ACTIVE DRIVERS
  // ============================

  this.filteredDrivers =
    (this.listOfAllData?.Drivers || []).filter((driver: any) =>
      String(driver.DriverName || '').toLowerCase().includes(search) ||
      String(driver.DriverLicenceNo || '').toLowerCase().includes(search) ||
      String(driver.StateLicenced || '').toLowerCase().includes(search)
    );


  // ============================
  // DELETED DRIVERS
  // ============================

  this.filteredDeletedDrivers =
    (this.listOfAllData?.DeletedDrivers || []).filter((driver: any) =>
      String(driver.DriverName || '').toLowerCase().includes(search) ||
      String(driver.DriverLicenceNo || '').toLowerCase().includes(search) ||
      String(driver.StateLicenced || '').toLowerCase().includes(search)
    );


  // ============================
  // ACTIVE VEHICLES
  // ============================

  this.filteredVehicles =
    (this.listOfAllData?.Vehicles || []).filter((vehicle: any) =>
      String(vehicle.VehicleType || '').toLowerCase().includes(search) ||
      String(vehicle.Year || '').toLowerCase().includes(search) ||
      String(vehicle.Make || '').toLowerCase().includes(search) ||
      String(vehicle.Model || '').toLowerCase().includes(search) ||
      String(vehicle.VIN || '').toLowerCase().includes(search)
    );


  // ============================
  // DELETED VEHICLES
  // ============================

  this.filteredDeletedVehicles =
    (this.listOfAllData?.DeletedVehicles || []).filter((vehicle: any) =>
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
