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

getAuditName(value: any): string {
  if (!value) {
    return '-';
  }

  return String(value)
    .split(/\r?\n/)[0]
    ?.trim() || '-';
}


getAuditDate(value: any): string {
  if (!value) {
    return '';
  }

  const parts = String(value)
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);

  return parts.slice(1).join(' ').trim();
}


/**
 * Use this when API returns user/date separately.
 */
getAuditDateFromObject(
  item: any,
  userField: string,
  dateFields: string[] = []
): string {

  // First check separate date fields
  for (const field of dateFields) {

    if (item?.[field]) {

      const date = new Date(item[field]);

      if (!isNaN(date.getTime())) {

        return date.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

      }

    }

  }

  // Otherwise check date inside User field
  return this.getAuditDate(item?.[userField]);
}


async exportToExcel(): Promise<void> {

  try {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'ATA';
    workbook.created = new Date();


    // =========================================================
    // WORKSHEET
    // =========================================================

    const worksheet = workbook.addWorksheet(
      'Driver Vehicle Details'
    );


    // =========================================================
    // PAGE SETTINGS
    // =========================================================

    worksheet.pageSetup = {
      ...worksheet.pageSetup,

      orientation: 'landscape',

      paperSize: 9, // A4

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 0,

      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2
      }
    };


    // =========================================================
    // FOOTER
    // =========================================================

    worksheet.headerFooter.oddFooter =
      '&CDriver & Vehicle Details&RPage &P of &N';


    // =========================================================
    // COLUMN WIDTHS
    // =========================================================

    const widths = [
      14, // A
      22, // B
      18, // C
      18, // D
      16, // E
      24, // F
      22, // G
      22, // H
      20, // I
      22, // J
      20, // K
      22, // L
      20, // M
      22  // N
    ];

    widths.forEach(
      (width: number, index: number) => {

        worksheet.getColumn(index + 1).width =
          width;

      }
    );


    // =========================================================
    // COMMON FUNCTIONS
    // =========================================================

    const getAuditUser = (
      value: any
    ): string => {

      if (!value) {
        return '';
      }

      return this.getAuditName(value) || '';

    };


    const getAuditDateExcel = (
      item: any,
      userField: string,
      dateFields: string[]
    ): string => {

      // No audit user = no audit date
      if (!item?.[userField]) {
        return '';
      }


      // First check separate date fields
      for (const field of dateFields) {

        const value =
          item?.[field];

        if (value) {

          const date =
            new Date(value);

          if (!isNaN(date.getTime())) {

            return date.toLocaleString(
              'en-US',
              {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }
            );

          }

          return String(value);

        }

      }


      // Otherwise date may be inside
      // EnteredBy / UpdatedBy / DeletedBy

      return this.getAuditDate(
        item[userField]
      ) || '';

    };


    const formatDate = (
      value: any
    ): string => {

      if (!value) {
        return '';
      }

      const date =
        new Date(value);

      if (isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleDateString(
        'en-US'
      );

    };


    const formatCurrency = (
      value: any
    ): string => {

      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {

        return '';

      }

      const number =
        Number(value);

      if (isNaN(number)) {
        return String(value);
      }

      return number.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD'
        }
      );

    };


    // =========================================================
    // TITLE
    // =========================================================

    worksheet.mergeCells(
      'A1:N1'
    );

    const titleCell =
      worksheet.getCell('A1');

    titleCell.value =
      'Driver & Vehicle Details';

    titleCell.font = {
      bold: true,
      size: 18,
      color: {
        argb: 'FFFFFF'
      }
    };

    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: '1F4E78'
      }
    };

    worksheet.getRow(1).height =
      32;


    // =========================================================
    // SUB TITLE
    // =========================================================

    worksheet.mergeCells(
      'A2:N2'
    );

    const subTitleCell =
      worksheet.getCell('A2');

    subTitleCell.value =
      'Policy drivers, vehicles and activity history';

    subTitleCell.font = {
      italic: true,
      size: 11,
      color: {
        argb: '666666'
      }
    };

    subTitleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    worksheet.getRow(2).height =
      22;


    // =========================================================
    // SECTION HEADER
    // =========================================================

    const addSectionHeader = (
      rowNumber: number,
      title: string,
      description: string
    ): number => {

      worksheet.mergeCells(
        `A${rowNumber}:N${rowNumber}`
      );

      const cell =
        worksheet.getCell(
          `A${rowNumber}`
        );

      cell.value =
        `${title}  |  ${description}`;

      cell.font = {
        bold: true,
        size: 13,
        color: {
          argb: 'FFFFFF'
        }
      };

      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle'
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '2F75B5'
        }
      };

      worksheet.getRow(
        rowNumber
      ).height = 26;

      return rowNumber + 1;

    };


    // =========================================================
    // TABLE HEADER
    // =========================================================

    const addTableHeader = (
      rowNumber: number,
      headers: string[]
    ): number => {

      headers.forEach(
        (
          header: string,
          index: number
        ) => {

          const cell =
            worksheet.getCell(
              rowNumber,
              index + 1
            );

          cell.value =
            header;

          cell.font = {
            bold: true,
            size: 10,
            color: {
              argb: 'FFFFFF'
            }
          };

          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true
          };

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: '5B9BD5'
            }
          };

          cell.border = {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            }
          };

        }
      );

      worksheet.getRow(
        rowNumber
      ).height = 30;

      return rowNumber + 1;

    };


    // =========================================================
    // DATA ROW
    // =========================================================

    const addDataRow = (
      rowNumber: number,
      values: any[],
      rowType:
        | 'normal'
        | 'updated'
        | 'endorsement'
        | 'deleted' = 'normal'
    ): number => {

      values.forEach(
        (
          value: any,
          index: number
        ) => {

          const cell =
            worksheet.getCell(
              rowNumber,
              index + 1
            );

          cell.value =
            value === null ||
            value === undefined
              ? ''
              : value;


          cell.alignment = {
            vertical: 'middle',
            wrapText: true
          };


          cell.border = {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            }
          };


          // =====================================================
          // 🔴 DELETED ROW
          // =====================================================

          if (
            rowType === 'deleted'
          ) {

            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'F4CCCC'
              }
            };

            cell.font = {
              color: {
                argb: '9C0006'
              }
            };

          }


          // =====================================================
          // 🟡 UPDATED / ENDORSEMENT ROW
          // =====================================================

          else if (
            rowType === 'updated' ||
            rowType === 'endorsement'
          ) {

            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'FFF2CC'
              }
            };

            cell.font = {
              color: {
                argb: '7F6000'
              }
            };

          }

        }
      );


      worksheet.getRow(
        rowNumber
      ).height = 25;

      return rowNumber + 1;

    };


    // =========================================================
    // SPACE
    // =========================================================

    const addSpace = (
      rowNumber: number
    ): number => {

      worksheet.getRow(
        rowNumber
      ).height = 8;

      return rowNumber + 1;

    };


    // =========================================================
    // START ROW
    // =========================================================

    let row = 4;


    // =========================================================
    // ACTIVE DRIVERS
    // =========================================================

    row = addSectionHeader(
      row,
      'Active Drivers',
      'Current drivers assigned to the policy'
    );


    row = addTableHeader(
      row,
      [
        'Driver',
        'Name',
        'Licence Issued',
        'Date of Birth',
        'State',
        'Licence No',
        'Entered By',
        'Entered Date',
        'Updated By',
        'Updated Date',
        '',
        '',
        '',
        ''
      ]
    );


    (this.filteredDrivers || [])
      .forEach(
        (
          driver: any,
          index: number
        ) => {

          // ===================================================
          // DETERMINE ROW TYPE
          // ===================================================

          let driverRowType:
            | 'normal'
            | 'updated'
            | 'endorsement';

          if (
            Number(driver.EndorsementID) !== 0
          ) {

            driverRowType =
              'endorsement';

          }
          else if (
            driver.UpdatedBy
          ) {

            driverRowType =
              'updated';

          }
          else {

            driverRowType =
              'normal';

          }


          row = addDataRow(
            row,
            [

              // DRIVER
              `${index + 1} - ${
                driver.EndorsementID === 0
                  ? 'Policy'
                  : 'Endorsement'
              }`,

              // NAME
              driver.DriverName || '',

              // LICENCE ISSUED
              formatDate(
                driver.YearofLicenceIssued
              ),

              // DOB
              formatDate(
                driver.DateofBirth
              ),

              // STATE
              driver.StateLicenced || '',

              // LICENCE NO
              driver.DriverLicenceNo || '',

              // ENTERED BY
              getAuditUser(
                driver.EnteredBy
              ),

              // ENTERED DATE
              getAuditDateExcel(
                driver,
                'EnteredBy',
                [
                  'EnteredDate',
                  'EntryDate',
                  'CreatedDate'
                ]
              ),

              // UPDATED BY
              getAuditUser(
                driver.UpdatedBy
              ),

              // UPDATED DATE
              getAuditDateExcel(
                driver,
                'UpdatedBy',
                [
                  'UpdatedDate',
                  'UpdateDate',
                  'ModifiedDate'
                ]
              ),

              '',
              '',
              '',
              ''

            ],
            driverRowType
          );

        }
      );


    // =========================================================
    // DELETED DRIVERS
    // =========================================================

    row = addSpace(row);


    row = addSectionHeader(
      row,
      'Deleted Drivers',
      'Removed drivers and deletion history'
    );


    row = addTableHeader(
      row,
      [
        'Driver',
        'Name',
        'Licence Issued',
        'Date of Birth',
        'State',
        'Licence No',
        'Delete Reason',
        'Entered By',
        'Entered Date',
        'Updated By',
        'Updated Date',
        'Deleted By',
        'Deleted Date',
        ''
      ]
    );


    (this.filteredDeletedDrivers || [])
      .forEach(
        (
          driver: any,
          index: number
        ) => {

          row = addDataRow(
            row,
            [

              // DRIVER
              index + 1,

              // NAME
              driver.DriverName || '',

              // LICENCE ISSUED
              formatDate(
                driver.YearofLicenceIssued
              ),

              // DOB
              formatDate(
                driver.DateofBirth
              ),

              // STATE
              driver.StateLicenced || '',

              // LICENCE NO
              driver.DriverLicenceNo || '',

              // DELETE REASON
              driver.DeleteReason || '',

              // ENTERED BY
              getAuditUser(
                driver.EnteredBy
              ),

              // ENTERED DATE
              getAuditDateExcel(
                driver,
                'EnteredBy',
                [
                  'EnteredDate',
                  'EntryDate',
                  'CreatedDate'
                ]
              ),

              // UPDATED BY
              getAuditUser(
                driver.UpdatedBy
              ),

              // UPDATED DATE
              getAuditDateExcel(
                driver,
                'UpdatedBy',
                [
                  'UpdatedDate',
                  'UpdateDate',
                  'ModifiedDate'
                ]
              ),

              // DELETED BY
              getAuditUser(
                driver.DeletedBy
              ),

              // DELETED DATE
              getAuditDateExcel(
                driver,
                'DeletedBy',
                [
                  'DeletedDate',
                  'DeleteDate',
                  'DeletedOn'
                ]
              ),

              ''

            ],
            'deleted'
          );

        }
      );


    // =========================================================
    // ACTIVE VEHICLES
    // =========================================================

    row = addSpace(row);


    row = addSectionHeader(
      row,
      'Active Vehicles',
      'Current vehicles assigned to the policy'
    );


    row = addTableHeader(
      row,
      [
        'Vehicle',
        'Type',
        'Year',
        'Make',
        'Model',
        'VIN',
        'Value',
        'Entered By',
        'Entered Date',
        'Updated By',
        'Updated Date',
        '',
        '',
        ''
      ]
    );


    (this.filteredVehicles || [])
      .forEach(
        (
          vehicle: any,
          index: number
        ) => {

          // ===================================================
          // DETERMINE ROW TYPE
          // ===================================================

          let vehicleRowType:
            | 'normal'
            | 'updated'
            | 'endorsement';

          if (
            Number(vehicle.EndorsementID) !== 0
          ) {

            vehicleRowType =
              'endorsement';

          }
          else if (
            vehicle.UpdatedBy
          ) {

            vehicleRowType =
              'updated';

          }
          else {

            vehicleRowType =
              'normal';

          }


          row = addDataRow(
            row,
            [

              // VEHICLE
              `${index + 1} - ${
                vehicle.EndorsementID === 0
                  ? 'Policy'
                  : 'Endorsement'
              }`,

              // TYPE
              vehicle.VehicleType || '',

              // YEAR
              vehicle.Year || '',

              // MAKE
              vehicle.Make || '',

              // MODEL
              vehicle.Model || '',

              // VIN
              vehicle.VIN || '',

              // VALUE
              formatCurrency(
                vehicle.Value
              ),

              // ENTERED BY
              getAuditUser(
                vehicle.EnteredBy
              ),

              // ENTERED DATE
              getAuditDateExcel(
                vehicle,
                'EnteredBy',
                [
                  'EnteredDate',
                  'EntryDate',
                  'CreatedDate'
                ]
              ),

              // UPDATED BY
              getAuditUser(
                vehicle.UpdatedBy
              ),

              // UPDATED DATE
              getAuditDateExcel(
                vehicle,
                'UpdatedBy',
                [
                  'UpdatedDate',
                  'UpdateDate',
                  'ModifiedDate'
                ]
              ),

              '',
              '',
              ''

            ],
            vehicleRowType
          );

        }
      );


    // =========================================================
    // DELETED VEHICLES
    // =========================================================

    row = addSpace(row);


    row = addSectionHeader(
      row,
      'Deleted Vehicles',
      'Removed vehicles and deletion history'
    );


    row = addTableHeader(
      row,
      [
        'Vehicle',
        'Type',
        'Year',
        'Make',
        'Model',
        'VIN',
        'Value',
        'Delete Reason',
        'Entered By',
        'Entered Date',
        'Updated By',
        'Updated Date',
        'Deleted By',
        'Deleted Date'
      ]
    );


    (this.filteredDeletedVehicles || [])
      .forEach(
        (
          vehicle: any,
          index: number
        ) => {

          row = addDataRow(
            row,
            [

              // VEHICLE
              index + 1,

              // TYPE
              vehicle.VehicleType || '',

              // YEAR
              vehicle.Year || '',

              // MAKE
              vehicle.Make || '',

              // MODEL
              vehicle.Model || '',

              // VIN
              vehicle.VIN || '',

              // VALUE
              formatCurrency(
                vehicle.Value
              ),

              // DELETE REASON
              vehicle.DeleteReason || '',

              // ENTERED BY
              getAuditUser(
                vehicle.EnteredBy
              ),

              // ENTERED DATE
              getAuditDateExcel(
                vehicle,
                'EnteredBy',
                [
                  'EnteredDate',
                  'EntryDate',
                  'CreatedDate'
                ]
              ),

              // UPDATED BY
              getAuditUser(
                vehicle.UpdatedBy
              ),

              // UPDATED DATE
              getAuditDateExcel(
                vehicle,
                'UpdatedBy',
                [
                  'UpdatedDate',
                  'UpdateDate',
                  'ModifiedDate'
                ]
              ),

              // DELETED BY
              getAuditUser(
                vehicle.DeletedBy
              ),

              // DELETED DATE
              getAuditDateExcel(
                vehicle,
                'DeletedBy',
                [
                  'DeletedDate',
                  'DeleteDate',
                  'DeletedOn'
                ]
              )

            ],
            'deleted'
          );

        }
      );


    // =========================================================
    // FREEZE
    // =========================================================

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 3
      }
    ];


    // =========================================================
    // PRINT AREA
    // =========================================================

    worksheet.pageSetup.printArea =
      `A1:N${row - 1}`;


    // =========================================================
    // PRINT SETTINGS
    // =========================================================

    worksheet.pageSetup.horizontalDpi =
      300;

    worksheet.pageSetup.verticalDpi =
      300;


    // =========================================================
    // WRITE FILE
    // =========================================================

    const buffer =
      await workbook.xlsx.writeBuffer();


    const blob =
      new Blob(
        [buffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      );


    // =========================================================
    // FILE NAME
    // =========================================================

    const date =
      new Date()
        .toISOString()
        .slice(0, 10);


    saveAs(
      blob,
      `Driver_Vehicle_Details_${date}.xlsx`
    );


  }
  catch (error) {

    console.error(
      'Excel export error:',
      error
    );

  }

}



  closeModel(): void {
    this.dialogRef.close();
   
  }
}
