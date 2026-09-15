import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SearchRenewListPipe } from '../../renew-list/search-renew-list.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';

import { ApiUrl } from '../../_core/apiUrl';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-issue-policy-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SearchRenewListPipe,
    SpinnerComponent,
    FormsModule
  ],
  templateUrl: './issue-policy-detail.component.html',
  styleUrl: './issue-policy-detail.component.scss'
})
export class IssuePolicyDetailComponent {

  showSpiner = true;

  listOfAllData: any[] = [];

  AccountID = '';
  MarkedPolicyID: any;
  ChildPolicyID: any;
  accountId: any;
  accountName: any;
  lookUpCode: any;
  emailID: any;
  phoneNumber: any;
  Yard_Address: any;
  No_of_Driver: any;
  PolicyType: any;
  No_of_Unit: any;

  searchCriteria = {
    Expiration: '',
    LookUpCode: '',
    ExpireInDays: '',
    ChildPolicyName: '',
    AccountName: ''
  };

  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    private http: AllApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  }

  // =========================================================
  // FORMAT DATE FOR API
  // =========================================================
  formatDateForApi(date: Date): string {

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  // =========================================================
  // GET ALL DATA
  // =========================================================
  getAllData(): void {

    if (!this.fromDate || !this.toDate) {
      return;
    }

    const fromDate = this.formatDateForApi(this.fromDate);
    const toDate = this.formatDateForApi(this.toDate);

    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);

    this.showSpiner = true;

    this.http.getAllDataByTwoDate(
      ApiUrl.monthyRepostIssuePolicy,
      fromDate,
      toDate
    ).subscribe({

      next: (data: any) => {

        this.showSpiner = false;

        console.log('Response:', data);

        this.listOfAllData = data?.ChildPolicys ?? [];

      },

      error: (error) => {

        this.showSpiner = false;

        console.error('API Error:', error);

        this.listOfAllData = [];
      }
    });
  }

  // =========================================================
  // TODAY DATE
  // =========================================================
  getTodayDate(): string {

    const date = new Date();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  // =========================================================
  // CONVERT EFFECTIVE DATE TO TIMESTAMP
  // =========================================================
  private getEffectiveDateTime(policy: any): number {

    if (!policy?.Effective) {
      return Number.MAX_SAFE_INTEGER;
    }

    const date = new Date(policy.Effective);

    const time = date.getTime();

    if (isNaN(time)) {
      return Number.MAX_SAFE_INTEGER;
    }

    return time;
  }

  // =========================================================
  // EXPORT TO EXCEL
  // =========================================================
  async exportToExcel(): Promise<void> {

    if (!this.listOfAllData || this.listOfAllData.length === 0) {

      this.toastr.warning(
        'No policy data available to export.'
      );

      return;
    }

    // =======================================================
    // SORT BY EFFECTIVE DATE - ASCENDING
    // =======================================================
    const sortedPolicies = [...this.listOfAllData].sort(
      (a: any, b: any) => {

        const dateA = this.getEffectiveDateTime(a);
        const dateB = this.getEffectiveDateTime(b);

        return dateA - dateB;
      }
    );

    console.log(
      'Sorted Policies:',
      sortedPolicies.map((x: any) => x.Effective)
    );

    // =======================================================
    // CREATE WORKBOOK
    // =======================================================
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
      'Issued Policies'
    );

    // =======================================================
    // TITLE
    // =======================================================

    // IMPORTANT:
    // We have 15 columns A -> O
    worksheet.mergeCells('A1:O1');

    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Issued Policy Details';

    titleCell.font = {
      bold: true,
      size: 16
    };

    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    worksheet.getRow(1).height = 28;

    // =======================================================
    // HEADER
    // =======================================================

    const headers = [
      'Sr. No.',
      'Policy Name',
      'Account Name',
      'Lookup Code',
      'Line',
      'Description',
      'Effective Date',
      'Expiration Date',
      'Bill Type',
      'Stage',
      'Status',
      'Broker',
      'Broker NAIC Code',
      'Issuing Company',
      'NAIC'
    ];

    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(2);

    headerRow.height = 24;

    headerRow.eachCell((cell) => {

      cell.font = {
        bold: true
      };

      cell.alignment = {
        horizontal: 'center',
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
    });

    // =======================================================
    // DATA
    // =======================================================

    sortedPolicies.forEach(
      (policy: any, index: number) => {

        const effectiveDate = policy.Effective
          ? new Date(policy.Effective)
          : null;

        const expirationDate = policy.Expiration
          ? new Date(policy.Expiration)
          : null;

        const row = worksheet.addRow([

          // 1
          index + 1,

          // 2
          policy.ChildPolicyName?.trim() || '',

          // 3
          policy.AccountName?.trim() || '',

          // 4
          policy.LookUpCode || '',

          // 5
          policy.LineName || '',

          // 6
          policy.Description || '',

          // 7
          effectiveDate || '',

          // 8
          expirationDate || '',

          // 9
          policy.BillType || '',

          // 10
          policy.StageType || '',

          // 11
          policy.Policy_Status || '',

          // 12
          policy.BrokerName || '',

          // 13
          policy.Broker_LookUpCode?.trim() || '',

          // 14
          policy.IssuingCompanyName || '',

          // 15
          policy.NAIC || ''
        ]);

        row.height = 22;

        // ===================================================
        // CELL BORDER + ALIGNMENT
        // ===================================================

        row.eachCell((cell) => {

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
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
        });

        // ===================================================
        // CENTER COLUMNS
        // ===================================================

        const centerColumns = [
          1, 4, 7, 8, 9, 10, 11
        ];

        centerColumns.forEach((columnNumber) => {

          row.getCell(columnNumber).alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        });

        // ===================================================
        // EXCEL DATE FORMAT
        // ===================================================

        if (effectiveDate) {

          row.getCell(7).numFmt =
            'mm/dd/yyyy';
        }

        if (expirationDate) {

          row.getCell(8).numFmt =
            'mm/dd/yyyy';
        }
      }
    );

    // =======================================================
    // COLUMN WIDTHS
    // =======================================================

    // IMPORTANT:
    // There are 15 columns, so we need 15 widths.
    const columnWidths = [

      9,    // 1  Sr No
      28,   // 2  Policy Name
      30,   // 3  Account Name
      15,   // 4  Lookup Code
      24,   // 5  Line
      18,   // 6  Description
      16,   // 7  Effective
      16,   // 8  Expiration
      18,   // 9  Bill Type
      14,   // 10 Stage
      14,   // 11 Status
      42,   // 12 Broker
      20,   // 13 Broker NAIC Code
      45,   // 14 Issuing Company
      14    // 15 NAIC
    ];

    columnWidths.forEach(
      (width, index) => {

        worksheet.getColumn(index + 1).width =
          width;
      }
    );

    // =======================================================
    // FREEZE HEADER
    // =======================================================

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 2
      }
    ];

    // =======================================================
    // AUTO FILTER
    // =======================================================

    // IMPORTANT:
    // 15 columns = A to O
    worksheet.autoFilter = {
      from: 'A2',
      to: 'O2'
    };

    // =======================================================
    // PAGE SETTINGS
    // =======================================================

    worksheet.pageSetup = {

      orientation: 'landscape',

      paperSize: 9,

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 0
    };

    // =======================================================
    // EXPORT
    // =======================================================

    const buffer =
      await workbook.xlsx.writeBuffer();

    const blob = new Blob(
      [buffer],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    saveAs(
      blob,
      `Issued_Policy_Details_${this.getTodayDate()}.xlsx`
    );
  }
}