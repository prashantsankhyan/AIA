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
   imports: [ CommonModule,MaterialModule,RouterModule,SearchRenewListPipe,SpinnerComponent,FormsModule],
  templateUrl: './issue-policy-detail.component.html',
  styleUrl: './issue-policy-detail.component.scss'
})
export class IssuePolicyDetailComponent {

  showSpiner = true
  listOfAllData:any[] =[]
  AccountID ='';
  MarkedPolicyID:any;
  ChildPolicyID:any;
  accountId:any;
  accountName:any;
  lookUpCode:any;
  emailID:any;
  phoneNumber:any;
  Yard_Address:any;
  No_of_Driver:any;
  PolicyType:any;
  No_of_Unit:any;
  searchCriteria = {
    Expiration: '',
    LookUpCode: '',
    ExpireInDays: '',
    ChildPolicyName:'',
    AccountName:'',
  
  };
fromDate: Date | null = null;
toDate: Date | null = null;

  constructor(private http:AllApiService,public dialog: MatDialog,private toastr: ToastrService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  
    

    
  }

formatDateForApi(date: Date): string {

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

getAllData() {

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

getTodayDate(): string {
  const date = new Date();

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}
async exportToExcel() {

  if (!this.listOfAllData || this.listOfAllData.length === 0) {
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Issued Policies');

  // -----------------------------
  // TITLE
  // -----------------------------
  worksheet.mergeCells('A1:N1');

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


  // -----------------------------
  // HEADER
  // -----------------------------
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
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };

  });


  // -----------------------------
  // DATA
  // -----------------------------
  this.listOfAllData.forEach((policy: any, index: number) => {

    const row = worksheet.addRow([
      index + 1,

      policy.ChildPolicyName?.trim() || '',

      policy.AccountName?.trim() || '',

      policy.LookUpCode || '',

      policy.LineName || '',

      policy.Description || '',

      policy.Effective
        ? new Date(policy.Effective)
        : '',

      policy.Expiration
        ? new Date(policy.Expiration)
        : '',

      policy.BillType || '',

      policy.StageType || '',

      policy.Policy_Status || '',

      policy.BrokerName || '',

      policy.Broker_LookUpCode?.trim() || '',

      policy.IssuingCompanyName || '',

      policy.NAIC || ''
    ]);

    row.height = 22;

    row.eachCell((cell) => {

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true
      };

      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };

    });

    // Center specific columns
    row.getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(4).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(7).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(8).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(9).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(10).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(11).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    // Date format
    row.getCell(7).numFmt = 'mm/dd/yyyy';
    row.getCell(8).numFmt = 'mm/dd/yyyy';

  });


  // -----------------------------
  // COLUMN WIDTHS
  // -----------------------------
  const columnWidths = [
    9,    // Sr No
    28,   // Policy Name
    30,   // Account Name
    15,   // Lookup Code
    24,   // Line
    18,   // Description
    16,   // Effective
    16,   // Expiration
    18,   // Bill Type
    14,   // Stage
    14,   // Status
    42,   // Broker
    45,   // Issuing Company
    14    // NAIC
  ];

  columnWidths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });


  // -----------------------------
  // FREEZE HEADER
  // -----------------------------
  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 2
    }
  ];


  // -----------------------------
  // AUTO FILTER
  // -----------------------------
  worksheet.autoFilter = {
    from: 'A2',
    to: 'N2'
  };


  // -----------------------------
  // PAGE SETTINGS
  // -----------------------------
  worksheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0
  };


  // -----------------------------
  // EXPORT
  // -----------------------------
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob(
    [buffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );

  saveAs(
    blob,
    `Issued_Policy_Details_${this.getTodayDate()}.xlsx`
  );
}
}
