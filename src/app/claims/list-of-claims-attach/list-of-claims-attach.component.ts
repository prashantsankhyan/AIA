import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';


import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';
import { AddListOfClaimsAttachComponent } from './add-list-of-claims-attach/add-list-of-claims-attach.component';

@Component({
  selector: 'app-list-of-claims-attach',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      RouterLink,
      
      MaterialModule,
      HttpClientModule,
      SpinnerComponent
    ],
  templateUrl: './list-of-claims-attach.component.html',
  styleUrl: './list-of-claims-attach.component.scss'
})
export class ListOfClaimsAttachComponent {
showSpiner = true;
  listOfAllFatchData: any[] = [];
  searchTerm: string = '';

  accountId = '';
  teamName: any;

  constructor(
    private http: AllApiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '""');
    this.teamName = localStorage.getItem('teamName');
    this.getAllFile();
  }

  // 🔽 Get all files & sort latest first
  getAllFile() {
    this.http
      .getAllDataId(ApiUrl.getAttachfileOfClaim,this.accountId)
      .subscribe(data => {
        this.showSpiner = false;

        const obj = JSON.parse(JSON.stringify(data));
        this.listOfAllFatchData = obj.AttachmentDetail || [];

        // Latest AttachmentDate on top
        this.listOfAllFatchData.sort(
          (a: any, b: any) =>
            new Date(b.AttachmentDate || 0).getTime() -
            new Date(a.AttachmentDate || 0).getTime()
        );
      });
  }

  // 🔍 Search ANY field
 get filteredAttachments() {
  if (!this.searchTerm) {
    return this.listOfAllFatchData;
  }

  const term = this.searchTerm.toLowerCase();

  return this.listOfAllFatchData.filter((item: any) =>
    Object.keys(item).some(key => {
      const value = item[key];

      if (value === null || value === undefined) return false;

      // ✅ Format date like UI (MM/dd/yyyy)
      if (key === 'AttachmentDate') {
        const d = new Date(value);
        const formattedDate =
          ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
          ('0' + d.getDate()).slice(-2) + '/' +
          d.getFullYear();

        return formattedDate.includes(term);
      }

      // Normal string/number search
      return value.toString().toLowerCase().includes(term);
    })
  );
}


  // ⬇️ Download file on row click
  onRowClick(file: any) {
    const httpsFileUrl = file.FileUrl.replace('http://', 'https://');

    const link = document.createElement('a');
    link.href = httpsFileUrl;
    link.download = file.FileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ➕ Add / Edit Attachment
  addEditAttachement() {
    this.dialog.open(AddListOfClaimsAttachComponent, {
      width: '800px',
      height: '630px'
    });
  }
}
