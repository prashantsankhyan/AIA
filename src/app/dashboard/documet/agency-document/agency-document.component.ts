import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AccountTeamNavbarComponent } from '../../../account-team/account-team-navbar/account-team-navbar.component';
import { AddEditAgencyDocumentComponent } from './add-edit-agency-document/add-edit-agency-document.component';

import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-agency-document',
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

  templateUrl: './agency-document.component.html',
  styleUrl: './agency-document.component.scss'
})
export class AgencyDocumentComponent {

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
     AGENCY DOCUMENT FILTER
     ========================================================= */

  selectedAgencyDocument = 'ALL';


  agencyDocuments: string[] = [

    'All Licenses-AIA',

    'Parmjit Dhami',

    'Farmers insurance',

    'Cyber Liability',

    'Surplus Lines Tax',

    'Agency Info',

    'Bhuta Dhami',

    'Kabir Sidhu',

    'Nation Producer Number (NPN)',

    'Passwords',

    'Cyber Insurancer',

    'Renewal Test Certificates-Parm Dhami & Sandy',

    'Bond',

    'Commercial Reqester-DMV-MVR(Related)',

    'E&O',

    'Miscellaneous Receipts',

    'Pardeep Sidhu',

    'Tax',

    'Two Bros-Invoices',

    'Rain sbd hill',

    'W9'

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

    // Reset to first page
    this.pageIndex = 0;

  }


  /* =========================================================
     AGENCY DOCUMENT CLICK FILTER
     ========================================================= */

  selectAgencyDocument(documentName: string): void {

    this.selectedAgencyDocument =
      documentName;

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


    if (type === '.txt') {

      return 'fas fa-file-alt';

    }


    return 'fas fa-file';

  }


  /* =========================================================
     GET ALL FILES FROM API
     ONLY AGENCY DOCUMENT RECORDS
     ========================================================= */

  getAllFile(): void {

    this.showSpiner = true;


    this.http
      .getAllData(ApiUrl.getDataForAccountingTeam)
      .subscribe({

        next: (data: any) => {

          this.showSpiner = false;


          console.log(
            'Agency Document API Response:',
            data
          );


          const obj = data;


          const allFiles =
            obj?.AttachmentDetail || [];


          /* =================================================
             ONLY RECORDS HAVING AgencyDocument
             ================================================= */

          this.listOfAllFatchData =
            allFiles.filter((item: any) =>

              item.AgencyDocument !== null &&

              item.AgencyDocument !== undefined &&

              item.AgencyDocument
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
            'Agency Document Records:',
            this.listOfAllFatchData
          );

        },


        error: (error) => {

          this.showSpiner = false;


          console.error(
            'Agency Document API Error:',
            error
          );


          this.listOfAllFatchData = [];

        }

      });

  }


  /* =========================================================
     FILTERED DATA
     SEARCH + AGENCY DOCUMENT FILTER
     ========================================================= */

  get filteredAttachments(): any[] {

    const search =
      (this.searchTerm || '')
        .trim()
        .toLowerCase();


    const selectedDocument =
      (this.selectedAgencyDocument || 'ALL')
        .trim()
        .toLowerCase();


    /* =======================================================
       FILTER DATA
       ======================================================= */

    return this.listOfAllFatchData.filter(
      (item: any) => {


        /* =================================================
           AGENCY DOCUMENT FILTER
           ================================================= */

        const agencyDocumentMatch =

          selectedDocument === 'all' ||

          (
            item.AgencyDocument || ''
          )
            .toString()
            .trim()
            .toLowerCase()

            ===

          selectedDocument;


        /* =================================================
           SEARCH FILTER
           ================================================= */

        const searchMatch =

          !search ||

          Object.keys(item).some(
            (key: string) => {

              const value =
                item[key];


              if (
                value === null ||
                value === undefined
              ) {

                return false;

              }


              /* ===========================================
                 DATE SEARCH
                 =========================================== */

              if (
                key === 'EnteredDate'
              ) {

                const d =
                  new Date(value);


                if (
                  isNaN(
                    d.getTime()
                  )
                ) {

                  return false;

                }


                const formattedDate =

                  ('0' +
                    (d.getMonth() + 1)
                  ).slice(-2)

                  +

                  '/'

                  +

                  ('0' +
                    d.getDate()
                  ).slice(-2)

                  +

                  '/'

                  +

                  d.getFullYear();


                return formattedDate
                  .toLowerCase()
                  .includes(search);

              }


              /* =========================================
                 NORMAL SEARCH
                 ========================================= */

              return value
                .toString()
                .toLowerCase()
                .includes(search);

            }
          );


        /* =================================================
           BOTH FILTERS MUST MATCH
           ================================================= */

        return (
          agencyDocumentMatch &&
          searchMatch
        );

      }
    );

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
     ADD AGENCY DOCUMENT
     ========================================================= */

  addEditAttachement(): void {

    const dialogRef =
      this.dialog.open(
        AddEditAgencyDocumentComponent,
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