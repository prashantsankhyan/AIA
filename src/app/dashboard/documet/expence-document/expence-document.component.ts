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

  showSpiner = true;

  searchTerm = '';

  accountId = '';
  teamName: any;

  listOfAllFatchData: any[] = [];
pageIndex = 0;
pageSize = 10;

  constructor(
    private http: AllApiService,
    public dialog: MatDialog
  ) {}


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
  get paginatedAttachments(): any[] {
  const start = this.pageIndex * this.pageSize;
  const end = start + this.pageSize;

  return this.filteredAttachments.slice(start, end);
}

get pageStart(): number {
  return this.filteredAttachments.length === 0
    ? 0
    : this.pageIndex * this.pageSize;
}

get pageEnd(): number {
  return Math.min(
    (this.pageIndex + 1) * this.pageSize,
    this.filteredAttachments.length
  );
}

onPageChange(event: any): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
}

onSearchChange(): void {
  this.pageIndex = 0;
}

trackByFileId(index: number, item: any): number {
  return item.FileID;
}

getFileIcon(fileType: string): string {

  const type = (fileType || '').toLowerCase();

  if (type === '.pdf') {
    return 'fas fa-file-pdf';
  }

  if (type === '.xlsx' || type === '.xls') {
    return 'fas fa-file-excel';
  }

  if (type === '.doc' || type === '.docx') {
    return 'fas fa-file-word';
  }

  if (type === '.ppt' || type === '.pptx') {
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
     ONLY AGENCY DOCUMENT RECORDS
     ========================================================= */

 getAllFile(): void {

  this.showSpiner = true;

  this.http
    .getAllData(ApiUrl.getDataForAccountingTeam)
    .subscribe({

      next: (data: any) => {

        this.showSpiner = false;

        console.log('Expense Document API Response:', data);

        const allFiles =
          data?.AttachmentDetail || [];


        // ONLY RECORDS HAVING DocumentType
        this.listOfAllFatchData =
          allFiles.filter((item: any) =>
            item.DocumentType !== null &&
            item.DocumentType !== undefined &&
            item.DocumentType.toString().trim() !== ''
          );


        // Latest first
        this.listOfAllFatchData.sort(
          (a: any, b: any) =>
            new Date(b.EnteredDate || 0).getTime() -
            new Date(a.EnteredDate || 0).getTime()
        );


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
     SEARCH
     ========================================================= */

  get filteredAttachments(): any[] {

    if (!this.searchTerm?.trim()) {

      return this.listOfAllFatchData;

    }


    const term =
      this.searchTerm
        .toLowerCase()
        .trim();


    return this.listOfAllFatchData.filter(
      (item: any) => {

        return Object.keys(item).some(
          (key: string) => {

            const value = item[key];


            if (
              value === null ||
              value === undefined
            ) {
              return false;
            }


            // Date search
            if (key === 'EnteredDate') {

              const d =
                new Date(value);


              const formattedDate =
                ('0' + (d.getMonth() + 1)).slice(-2)
                + '/' +
                ('0' + d.getDate()).slice(-2)
                + '/' +
                d.getFullYear();


              return formattedDate
                .toLowerCase()
                .includes(term);

            }


            return value
              .toString()
              .toLowerCase()
              .includes(term);

          }
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


    link.href = httpsFileUrl;

    link.download =
      file.FileName || 'download';


    link.target = '_blank';


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }


  /* =========================================================
     ADD AGENCY DOCUMENT
     ========================================================= */

  addEditAttachement(): void {

    const dialogRef =
      this.dialog.open(
        AddExoenceDocumentComponent,
        {
          width: '800px'
        }
      );


    // Refresh list after upload
    dialogRef.afterClosed().subscribe(() => {

      this.getAllFile();

    });

  }

}
