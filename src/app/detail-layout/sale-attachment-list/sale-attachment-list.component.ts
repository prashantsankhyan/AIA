import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SrachSaleAttachemntPipe } from '../../main-layout/attachment/srach-sale-attachemnt.pipe';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-sale-attachment-list',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,SrachSaleAttachemntPipe,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './sale-attachment-list.component.html',
  styleUrl: './sale-attachment-list.component.scss'
})
export class SaleAttachmentListComponent {
  showSpiner = true;
  listOfAllFatchData: any = [];
  accountId = '';
  accountName = '';
  MarkedPolicyId: any;
  ChildPolicyID: any;
  IsChildPolicyExist: any;
  EndorsementID: any;
  searchTerm: string = '';
  teamName: any;

  searchCriteria = {
    FileName: '',
    Description: '',
    AttachmentDate: '',
    EnteredBy: '',
    PolicyType: '',
  };

  constructor(
    private http: AllApiService,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.http.listen().subscribe((m: any) => {
      this.getAllFile();
    });
  }

  ngOnInit(): void {
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '{}');
    this.teamName = localStorage.getItem('teamName');
    this.getAllFile();
  }

  getAllFile() {
    this.http.getAllDataId(ApiUrl.getAllFatchData, this.accountId).subscribe(data => {
      this.showSpiner = false;
      const obj = JSON.parse(JSON.stringify(data));
      this.listOfAllFatchData = obj.AttachmentDetail || [];
    });
  }

  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck();
  }

  onAttachmentDateChange(newAttachmentDate: string) {
    this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
  }

  onDescriptionChange(newDescription: string) {
    this.updateSearchCriteria({ Description: newDescription });
  }

  onEnteredByChange(newEnteredBy: string) {
    this.updateSearchCriteria({ EnteredBy: newEnteredBy });
  }

  onFileNameChange(newFileName: string) {
    this.updateSearchCriteria({ FileName: newFileName });
  }

  onPolicyTypeChange(newPolicyType: string) {
    this.updateSearchCriteria({ PolicyType: newPolicyType });
  }

  onRowClick1(file: any) {
    const ext = file.FileType?.toLowerCase();
    const openInNewTabTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.gif'];

    if (openInNewTabTypes.includes(ext)) {
      window.open(file.FileUrl, '_blank');
    } else {
      const httpsFileUrl = file.FileUrl.replace('http://', 'https://');
      const link = document.createElement('a');
      link.href = httpsFileUrl;
      link.download = file.FileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  

}
