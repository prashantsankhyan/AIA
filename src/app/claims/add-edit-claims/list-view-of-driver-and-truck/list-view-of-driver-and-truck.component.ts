import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ApiUrl } from '../../../_core/apiUrl';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-list-view-of-driver-and-truck',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    SpinnerComponent
  ],
  templateUrl: './list-view-of-driver-and-truck.component.html',
  styleUrl: './list-view-of-driver-and-truck.component.scss'
})
export class ListViewOfDriverAndTruckComponent {
showEndrosementList = true;
searchText: string = '';
repostingType: any = '';
ChildPolicyID: any;
MarkedPolicyID: any;
EndrosememtId = '0';

listOfAllData: any = {};

filteredDrivers: any[] = [];
filteredVehicles: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ListViewOfDriverAndTruckComponent>){}
  ngOnInit(): void {
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID;
    this.ChildPolicyID = this.data.ChildPolicyID;
    
    
     this.getListOfAllData();
    

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

      // ONLY ACTIVE DRIVERS
      this.filteredDrivers =
        Array.isArray(this.listOfAllData?.Drivers)
          ? this.listOfAllData.Drivers
          : [];

      // ONLY ACTIVE VEHICLES
      this.filteredVehicles =
        Array.isArray(this.listOfAllData?.Vehicles)
          ? this.listOfAllData.Vehicles
          : [];

      console.log('Drivers:', this.filteredDrivers);
      console.log('Vehicles:', this.filteredVehicles);

      this.showEndrosementList = false;
    },

    error: (error) => {

      console.error('API Error:', error);

      this.listOfAllData = {};

      this.filteredDrivers = [];
      this.filteredVehicles = [];
    }

  });
}

 onSearchChange(): void {

  const search = String(this.searchText || '')
    .trim()
    .toLowerCase();

  const drivers = Array.isArray(this.listOfAllData?.Drivers)
    ? this.listOfAllData.Drivers
    : [];

  const vehicles = Array.isArray(this.listOfAllData?.Vehicles)
    ? this.listOfAllData.Vehicles
    : [];

  // Show all active data
  if (!search) {

    this.filteredDrivers = [...drivers];
    this.filteredVehicles = [...vehicles];

    return;
  }

  // ============================
  // ACTIVE DRIVERS ONLY
  // ============================

  this.filteredDrivers = drivers.filter(
    (driver: any) => {

      return [
        driver?.DriverName,
        driver?.DriverLicenceNo,
        driver?.StateLicenced,
        driver?.DriverType,
        driver?.DriverStage,
        driver?.RenewalStatus
      ].some(value =>
        String(value || '')
          .toLowerCase()
          .includes(search)
      );

    }
  );


  // ============================
  // ACTIVE VEHICLES ONLY
  // ============================

  this.filteredVehicles = vehicles.filter(
    (vehicle: any) => {

      return [
        vehicle?.VehicleType,
        vehicle?.Year,
        vehicle?.Make,
        vehicle?.Model,
        vehicle?.VIN,
        vehicle?.VehicleVIN,
        vehicle?.PlateNo,
        vehicle?.LicensePlate,
        vehicle?.State
      ].some(value =>
        String(value || '')
          .toLowerCase()
          .includes(search)
      );

    }
  );

}
exportToExcel(): void {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Policy Details');

  // =====================================================
  // HELPERS
  // =====================================================

  const getAuditDate = (value: any): string => {

    if (!value) {
      return '-';
    }

    const parts = String(value)
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean);

    return parts[1] || '-';
  };


  const formatDate = (value: any): string => {

    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };


  // =====================================================
  // DATA
  // =====================================================

  const drivers =
    Array.isArray(this.listOfAllData?.Drivers)
      ? this.listOfAllData.Drivers
      : [];

  const vehicles =
    Array.isArray(this.listOfAllData?.Vehicles)
      ? this.listOfAllData.Vehicles
      : [];

  const remarks =
    Array.isArray(this.listOfAllData?.Remarks)
      ? this.listOfAllData.Remarks
      : [];


  // =====================================================
  // TITLE
  // =====================================================

  worksheet.mergeCells('A1:I1');

  const titleCell = worksheet.getCell('A1');

  titleCell.value =
    'POLICY DRIVER & VEHICLE DETAILS';

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

  worksheet.mergeCells('A2:I2');

  const policyCell =
    worksheet.getCell('A2');

  policyCell.value =
    `Marked Policy ID: ${this.MarkedPolicyID}`;

  policyCell.font = {
    bold: true,
    size: 11
  };


  // =====================================================
  // POLICY TYPE
  // =====================================================

  worksheet.mergeCells('A3:I3');

  const policyTypeCell =
    worksheet.getCell('A3');

  policyTypeCell.value =
    `Policy Type: ${this.repostingType || '-'}`;

  policyTypeCell.font = {
    bold: true,
    size: 11
  };


  // =====================================================
  // DRIVERS TITLE
  // =====================================================

  worksheet.mergeCells('A5:H5');

  const driverTitle =
    worksheet.getCell('A5');

  driverTitle.value = 'DRIVERS';

  driverTitle.font = {
    bold: true,
    size: 13
  };

  driverTitle.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };


  // =====================================================
  // DRIVER HEADERS
  // =====================================================

  const driverHeaderRow = 6;

  const driverHeaders = [
    'Driver S.NO',
    'Name',
    'Licence Issued',
    'Date of Birth',
    'State Licensed',
    'Licence No',
    'Enter Date',
    'Updated Date'
  ];

  worksheet.getRow(driverHeaderRow).values =
    driverHeaders;

  worksheet.getRow(driverHeaderRow).font = {
    bold: true
  };

  worksheet.getRow(driverHeaderRow).alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };


  // =====================================================
  // DRIVER DATA
  // =====================================================

  let driverRow =
    driverHeaderRow + 1;


  drivers.forEach(
    (driver: any, index: number) => {

      const row =
        worksheet.getRow(driverRow);

      row.values = [

        // S.NO
        `${index + 1} - ${
          driver.EndorsementID === 0
            ? 'By Policy'
            : 'By Endorsement'
        }`,

        // NAME
        driver.DriverName || '-',

        // LICENCE ISSUED
        formatDate(
          driver.YearofLicenceIssued
        ),

        // DOB
        formatDate(
          driver.DateofBirth
        ),

        // STATE
        driver.StateLicenced || '-',

        // LICENCE NO
        driver.DriverLicenceNo || '-',

        // ENTER DATE
        getAuditDate(
          driver.EnteredBy
        ),

        // UPDATED DATE
        getAuditDate(
          driver.UpdatedBy
        )

      ];

      driverRow++;
    }
  );


  // =====================================================
  // VEHICLE SECTION
  // =====================================================

  const vehicleTitleRow =
    driverRow + 2;


  worksheet.mergeCells(
    `A${vehicleTitleRow}:I${vehicleTitleRow}`
  );

  const vehicleTitle =
    worksheet.getCell(
      `A${vehicleTitleRow}`
    );

  vehicleTitle.value =
    'VEHICLES';

  vehicleTitle.font = {
    bold: true,
    size: 13
  };

  vehicleTitle.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };


  // =====================================================
  // VEHICLE HEADERS
  // =====================================================

  const vehicleHeaderRow =
    vehicleTitleRow + 1;

  const vehicleHeaders = [
    'Vehicle S.NO',
    'Type',
    'Year',
    'Make',
    'Model',
    'VIN',
    'Value',
    'Entered Date',
    'Updated Date'
  ];

  worksheet.getRow(
    vehicleHeaderRow
  ).values = vehicleHeaders;

  worksheet.getRow(
    vehicleHeaderRow
  ).font = {
    bold: true
  };

  worksheet.getRow(
    vehicleHeaderRow
  ).alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };


  // =====================================================
  // VEHICLE DATA
  // =====================================================

  let vehicleRow =
    vehicleHeaderRow + 1;


  vehicles.forEach(
    (vehicle: any, index: number) => {

      const row =
        worksheet.getRow(vehicleRow);

      row.values = [

        // S.NO
        `${index + 1} - ${
          vehicle.EndorsementID === 0
            ? 'By Policy'
            : 'By Endorsement'
        }`,

        // TYPE
        vehicle.VehicleType || '-',

        // YEAR
        vehicle.Year || '-',

        // MAKE
        vehicle.Make || '-',

        // MODEL
        vehicle.Model || '-',

        // VIN
        vehicle.VIN ||
        vehicle.VehicleVIN ||
        '-',

        // VALUE
        Number(vehicle.Value || 0),

        // ENTERED DATE
        getAuditDate(
          vehicle.EnteredBy
        ),

        // UPDATED DATE
        getAuditDate(
          vehicle.UpdatedBy
        )

      ];

      // Currency
      row.getCell(7).numFmt =
        '$#,##0.00';

      vehicleRow++;
    }
  );


  // =====================================================
  // REMARKS
  // =====================================================

  if (remarks.length > 0) {

    const remarkStartRow =
      vehicleRow + 2;


    worksheet.mergeCells(
      `A${remarkStartRow}:I${remarkStartRow}`
    );


    const remarkTitleCell =
      worksheet.getCell(
        `A${remarkStartRow}`
      );

    remarkTitleCell.value =
      'REMARKS';

    remarkTitleCell.font = {
      bold: true,
      size: 13
    };

    remarkTitleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };


    let remarkRow =
      remarkStartRow + 1;


    remarks.forEach(
      (remark: any) => {

        worksheet.mergeCells(
          `A${remarkRow}:I${remarkRow}`
        );

        worksheet.getCell(
          `A${remarkRow}`
        ).value =
          remark.Remarks || '-';

        remarkRow++;
      }
    );
  }


  // =====================================================
  // BORDERS + ALIGNMENT
  // =====================================================

  worksheet.eachRow(
    (row) => {

      row.eachCell(
        (cell) => {

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

        }
      );

    }
  );


  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  worksheet.getColumn(1).width = 20;
  worksheet.getColumn(2).width = 28;
  worksheet.getColumn(3).width = 18;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 25;
  worksheet.getColumn(7).width = 18;
  worksheet.getColumn(8).width = 18;
  worksheet.getColumn(9).width = 18;


  // =====================================================
  // FREEZE
  // =====================================================

  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 6
    }
  ];


  // =====================================================
  // DRIVER FILTER
  // =====================================================

  if (drivers.length > 0) {

    worksheet.autoFilter = {
      from: `A${driverHeaderRow}`,
      to: `H${driverRow - 1}`
    };

  }


  // =====================================================
  // VEHICLE FILTER
  // =====================================================

  // Excel allows only one autoFilter per worksheet.
  // Driver filter is kept when both sections exist.

  if (
    vehicles.length > 0 &&
    drivers.length === 0
  ) {

    worksheet.autoFilter = {
      from: `A${vehicleHeaderRow}`,
      to: `I${vehicleRow - 1}`
    };

  }


  // =====================================================
  // PRINT SETTINGS
  // =====================================================

  worksheet.pageSetup = {

    orientation: 'landscape',

    paperSize:
      ExcelJS.PaperSize.A4,

    fitToPage: true,

    fitToWidth: 1,

    fitToHeight: 0,

    horizontalCentered: true

  };


  // =====================================================
  // PRINT AREA
  // =====================================================

  const lastRow =
    worksheet.lastRow?.number || vehicleRow;

  worksheet.pageSetup.printArea =
    `A1:I${lastRow}`;


  // =====================================================
  // DOWNLOAD
  // =====================================================

  workbook.xlsx.writeBuffer()
    .then((buffer: any) => {

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

    })
    .catch((error: any) => {

      console.error(
        'Excel Export Error:',
        error
      );

      this.toastr.error(
        'Unable to export Excel file.'
      );

    });

}
  closeModel(): void {
    this.dialogRef.close();
   
  }
}

