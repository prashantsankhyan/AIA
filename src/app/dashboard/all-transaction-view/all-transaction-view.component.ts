import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style';
type ExportRow = {
  Name: any;
  Effective: string;
  Expiration: string;
  Source: any;
  LineName: any;
  LineShortName: any;
  IsChildPolicyExist: any;
  EnteredBy: any;
  Value: string;
  [key: string]: any; // Index signature for dynamic keys
};
@Component({
  selector: 'app-all-transaction-view',
  standalone: true,
  imports: [
     CommonModule,
     MatButtonModule,
     FormsModule,
     MaterialModule,
     HttpClientModule,
     SpinnerComponent,
   ],
  templateUrl: './all-transaction-view.component.html',
  styleUrl: './all-transaction-view.component.scss'
})
export class AllTransactionViewComponent {
showSpiner = true;
  listOfAllMarketd: any[] = [];

searchCriteria = {
  global: ''
};

  UserName: any;

  

  constructor(
    private http: AllApiService,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.http.listen().subscribe(() => {
      this.getAllMaketed();
    });
  }

  ngOnInit(): void {
    this.UserName = sessionStorage.getItem('UserName');
    if (this.UserName == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.getAllMaketed();
  }

  getAllMaketed() {
    this.http.getAllData(ApiUrl.getALlTransactionMulti).subscribe((data) => {
      this.showSpiner = false;
      this.listOfAllMarketd = data?.TransactionNews || [];
    });
  }

filteredMarketed(): any[] {
  const search = this.searchCriteria.global?.toLowerCase().trim();

  if (!search) {
    return this.listOfAllMarketd;
  }

  return this.listOfAllMarketd.filter(item => {
    return (
      item?.SrNo?.toString().includes(search) ||

      item?.Marked_PolicyName?.toLowerCase().includes(search) ||
      item?.InvoiceID?.toString().includes(search) ||

      item?.ChildPolicy_Description?.toLowerCase().includes(search) ||

      item?.LineName?.toLowerCase().includes(search) ||
      this.formatDate(item?.Child_EffectiveDate).includes(search) ||
      this.formatDate(item?.Child_ExpirationDate).includes(search) ||

      item?.ChildPolicyName?.toLowerCase().includes(search) ||

      this.formatDate(item?.GenerateInvoice).includes(search) ||
      this.formatDate(item?.ARDue).includes(search) ||

      item?.Amount?.toString().includes(search) ||
      item?.PolicyFee?.toString().includes(search) ||
      item?.SurpluxTax?.toString().includes(search) ||
      item?.CompanyFinanced?.toString().includes(search) ||

      item?.OpeningBalance?.toString().includes(search) ||
      item?.TotalRecievedAmount?.toString().includes(search) ||

      item?.EnteredBy?.toLowerCase().includes(search)
    );
  });
}

  exportAsExcel() {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const exportData: ExportRow[] = this.listOfAllMarketd.map((data: any) => ({
      Name: data?.Name || '',
      Effective: data?.Effective ? this.formatDate(data.Effective) : '',
      Expiration: data?.Expiration ? this.formatDate(data.Expiration) : '',
      Source: data?.Source || '',
      LineName: data?.LineName || '',
      LineShortName: data?.LineShortName || '',
      IsChildPolicyExist: data?.IsChildPolicyExist || '',
      EnteredBy: data?.EnteredBy || '',
      Value: currencyFormatter.format(data?.Value || 0),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column widths
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...exportData.map((row) => (row[key] ? row[key].toString().length : 0))
        ) + 2,
    }));
    ws['!cols'] = colWidths;

    // Header styles
    const headerKeys = Object.keys(exportData[0] || {});
    headerKeys.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: 0 });
      if (ws[cellRef]) {
        (ws[cellRef] as any).s = {
          font: { bold: true, sz: 14, color: { rgb: '000000' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    });

    // Conditional row styling for rows where IsChildPolicyExist is truthy
    exportData.forEach((row, rowIndex) => {
      if (
        row['IsChildPolicyExist'] === true ||
        row['IsChildPolicyExist'] === 'true' ||
        row['IsChildPolicyExist'] === 'yes'
      ) {
        headerKeys.forEach((_, colIndex) => {
          const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex + 1 });
          if (!ws[cellRef]) return;
          (ws[cellRef] as any).s = {
            fill: { fgColor: { rgb: 'D4EDDA' } }, // light green background
            font: { color: { rgb: '155724' }, bold: true },
          };
        });
      }
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicle List');

    const rowCount = exportData.length;
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });

    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      `Vehicle_List_${rowCount}_rows_${new Date().getTime()}.xlsx`
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  }

  
}
