import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../sharingModule/material/material.module';
import { AddEditAccountDetaisComponent } from './add-edit-account-detais/add-edit-account-detais.component';
import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../_core/apiUrl';
import { AccountTeamNavbarComponent } from './account-team-navbar/account-team-navbar.component';

@Component({
  selector: 'app-account-team',
  standalone: true,
   imports: [
     CommonModule,
     FormsModule,
     MatButtonModule,
     RouterLink,
     MaterialModule,
     HttpClientModule,
     SpinnerComponent,
     AccountTeamNavbarComponent,
     RouterOutlet
   ],
  templateUrl: './account-team.component.html',
  styleUrl: './account-team.component.scss'
})
export class AccountTeamComponent {

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
      .getAllData(ApiUrl.getDataForAccountingTeam)
      .subscribe(data => {
        this.showSpiner = false;

        const obj = JSON.parse(JSON.stringify(data));
        this.listOfAllFatchData = obj.AttachmentDetail || [];

        // Latest AttachmentDate on top
        this.listOfAllFatchData.sort(
          (a: any, b: any) =>
            new Date(b.EnteredDate || 0).getTime() -
            new Date(a.EnteredDate || 0).getTime()
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
      if (key === 'EnteredDate') {
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
    this.dialog.open(AddEditAccountDetaisComponent, {
      width: '800px',
    
    });
  }
}
