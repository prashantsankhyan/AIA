import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AccountTeamNavbarComponent } from '../../../account-team/account-team-navbar/account-team-navbar.component';

import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddExoenceDocumentComponent } from './add-exoence-document/add-exoence-document.component';

@Component({
  selector: 'app-expence-document',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    RouterLink,
    MaterialModule,
    SpinnerComponent,
    AccountTeamNavbarComponent
  ],

  templateUrl: './expence-document.component.html',
  styleUrl: './expence-document.component.scss'
})
export class ExpenceDocumentComponent {

  /* =========================================================
     LOADER
     ========================================================= */

  showSpiner = true;


  /* =========================================================
     SEARCH
     ========================================================= */

  searchTerm = '';


  /* =========================================================
     ACCOUNT / TEAM
     ========================================================= */

  accountId = '';
  teamName: any;


  /* =========================================================
     ORIGINAL API DATA
     ========================================================= */

  listOfAllFatchData: any[] = [];


  /* =========================================================
     PAGINATION
     ========================================================= */

  pageIndex = 0;
  pageSize = 10;


  /* =========================================================
     DOCUMENT TYPE FILTER
     ========================================================= */

  selectedDocumentType = '';


  documentTypes: string[] = [

    'Resource Pro-Invoice',

    'Surplus Lines-Invoice',

    'Applied Invoice',

    'Cab & Carrier Software-Invoice',

    'Computer Devices & Related-Invoice',

    'Docu Sign',

    'DYL',

    'E&O',

    'Electricity',

    'Gifts',

    'Internet',

    'Miscellaneous',

    'MVRs',

    'Phone Devices & Related',

    'Producer-Commissions',

    'Team-Viewer',

    'Excel Sheet-Expenses'

  ];


  constructor(
    private http: AllApiService,
    public dialog: MatDialog
  ) {}


  /* =========================================================
     INIT
     ========================================================= */

  ngOnInit(): void {

    this.accountId =
      JSON.parse(
        localStorage.getItem('accountId') || '""'
      );


    this.teamName =
      localStorage.getItem('teamName');


    // API CALL
    this.getAllFile();

  }


  /* =========================================================
     PAGINATED DATA
     ========================================================= */

  get paginatedAttachments(): any[] {

    const start =
      this.pageIndex * this.pageSize;

    const end =
      start + this.pageSize;


    return this.filteredAttachments.slice(
      start,
      end
    );

  }


  /* =========================================================
     PAGE START
     ========================================================= */

  get pageStart(): number {

    return this.filteredAttachments.length === 0

      ? 0

      : this.pageIndex * this.pageSize;

  }


  /* =========================================================
     PAGE END
     ========================================================= */

  get pageEnd(): number {

    return Math.min(

      (this.pageIndex + 1) * this.pageSize,

      this.filteredAttachments.length

    );

  }


  /* =========================================================
     PAGE CHANGE
     ========================================================= */

  onPageChange(event: any): void {

    this.pageIndex =
      event.pageIndex;


    this.pageSize =
      event.pageSize;

  }


  /* =========================================================
     SEARCH CHANGE
     ========================================================= */

  onSearchChange(): void {

    // Always go back to first page
    this.pageIndex = 0;

  }


  /* =========================================================
     DOCUMENT TYPE FILTER
     ========================================================= */

  selectDocumentType(documentType: string): void {

    this.selectedDocumentType =
      documentType;


    // Reset pagination
    this.pageIndex = 0;

  }


  /* =========================================================
     TRACK BY
     ========================================================= */

  trackByFileId(
    index: number,
    item: any
  ): number {

    return item.FileID;

  }


  /* =========================================================
     FILE ICON
     ========================================================= */

  getFileIcon(fileType: string): string {

    const type =
      (fileType || '').toLowerCase();


    if (type === '.pdf') {

      return 'fas fa-file-pdf';

    }


    if (
      type === '.xlsx' ||
      type === '.xls'
    ) {

      return 'fas fa-file-excel';

    }


    if (
      type === '.doc' ||
      type === '.docx'
    ) {

      return 'fas fa-file-word';

    }


    if (
      type === '.ppt' ||
      type === '.pptx'
    ) {

      return 'fas fa-file-powerpoint';

    }


    if (
      type === '.jpg' ||
      type === '.jpeg' ||
      type === '.png' ||
      type === '.gif'
    ) {

      return 'fas fa-file-image';

    }


    return 'fas fa-file';

  }


  /* =========================================================
     GET ALL FILES FROM API
     ONLY EXPENSE DOCUMENT RECORDS
     ========================================================= */

  getAllFile(): void {

    this.showSpiner = true;


    this.http
      .getAllData(ApiUrl.getDataForAccountingTeam)
      .subscribe({

        next: (data: any) => {

          this.showSpiner = false;


          console.log(
            'Expense Document API Response:',
            data
          );


          const allFiles =
            data?.AttachmentDetail || [];


          /* =================================================
             ONLY RECORDS HAVING DocumentType
             ================================================= */

          this.listOfAllFatchData =
            allFiles.filter((item: any) =>

              item.DocumentType !== null &&

              item.DocumentType !== undefined &&

              item.DocumentType
                .toString()
                .trim() !== ''

            );


          /* =================================================
             LATEST FIRST
             ================================================= */

          this.listOfAllFatchData.sort(
            (a: any, b: any) =>

              new Date(
                b.EnteredDate || 0
              ).getTime()

              -

              new Date(
                a.EnteredDate || 0
              ).getTime()

          );


          /* =================================================
             RESET PAGE
             ================================================= */

          this.pageIndex = 0;


          console.log(
            'Expense Document Records:',
            this.listOfAllFatchData
          );

        },


        error: (error) => {

          this.showSpiner = false;


          console.error(
            'Expense Document API Error:',
            error
          );


          this.listOfAllFatchData = [];

        }

      });

  }


  /* =========================================================
     FILTERED DATA
     SEARCH + DOCUMENT TYPE FILTER
     ========================================================= */

  get filteredAttachments(): any[] {

  const search =
    (this.searchTerm || '')
      .trim()
      .toLowerCase();


  const selectedType =
    (this.selectedDocumentType || '')
      .trim()
      .toLowerCase();


  // =====================================================
  // NOTHING SELECTED = NO DATA
  // =====================================================

  if (!selectedType) {

    return [];

  }


  // =====================================================
  // ALL DOCUMENTS SELECTED
  // =====================================================

  let result: any[];

  if (selectedType === 'all') {

    result = [...this.listOfAllFatchData];

  }

  else {

    // ===================================================
    // SELECTED DOCUMENT TYPE
    // ===================================================

    result =
      this.listOfAllFatchData.filter(
        (item: any) => {

          const itemType =
            (item.DocumentType || '')
              .toString()
              .trim()
              .toLowerCase();

          return itemType === selectedType;

        }
      );

  }


  // =====================================================
  // SEARCH
  // =====================================================

  if (search) {

    result = result.filter(
      (item: any) => {

        return Object.keys(item).some(
          (key: string) => {

            const value =
              item[key];


            if (
              value === null ||
              value === undefined
            ) {

              return false;

            }


            // ===========================================
            // DATE SEARCH
            // ===========================================

            if (key === 'EnteredDate') {

              const d =
                new Date(value);


              if (isNaN(d.getTime())) {

                return false;

              }


              const formattedDate =
                ('0' + (d.getMonth() + 1)).slice(-2)
                + '/'
                +
                ('0' + d.getDate()).slice(-2)
                + '/'
                +
                d.getFullYear();


              return formattedDate
                .toLowerCase()
                .includes(search);

            }


            // ===========================================
            // NORMAL SEARCH
            // ===========================================

            return value
              .toString()
              .toLowerCase()
              .includes(search);

          }
        );

      }
    );

  }


  return result;

}


  /* =========================================================
     DOWNLOAD FILE
     ========================================================= */

  onRowClick(file: any): void {

    if (!file?.FileUrl) {

      return;

    }


    const httpsFileUrl =
      file.FileUrl.replace(
        'http://',
        'https://'
      );


    const link =
      document.createElement('a');


    link.href =
      httpsFileUrl;


    link.download =
      file.FileName || 'download';


    link.target =
      '_blank';


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );

  }


  /* =========================================================
     ADD EXPENSE DOCUMENT
     ========================================================= */

  addEditAttachement(): void {

    const dialogRef =
      this.dialog.open(
        AddExoenceDocumentComponent,
        {
          width: '800px'
        }
      );


    /* =======================================================
       REFRESH LIST AFTER UPLOAD
       ======================================================= */

    dialogRef
      .afterClosed()
      .subscribe(() => {

        this.getAllFile();

      });

  }

}