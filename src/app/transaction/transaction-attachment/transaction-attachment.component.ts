import { ChangeDetectorRef, Component } from '@angular/core';
import { TransactionNavBarComponent } from '../transaction-nav-bar/transaction-nav-bar.component';

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
import { AddEditTransactionAttachmentComponent } from './add-edit-transaction-attachment/add-edit-transaction-attachment.component';
import { SearchTransactionAttachemnPipe } from '../search-transaction-attachemn.pipe';

@Component({
  selector: 'app-transaction-attachment',
  standalone: true,
  
  imports: [CommonModule,MatButtonModule,FormsModule ,TransactionNavBarComponent,RouterLink,MaterialModule ,HttpClientModule ,SpinnerComponent,SearchTransactionAttachemnPipe],
  templateUrl: './transaction-attachment.component.html',
  styleUrl: './transaction-attachment.component.scss'
})
export class TransactionAttachmentComponent {

  showSpiner = true
  listOfAllFatchData:any =[];
  accountId ='';
  accountName ='';
  MarkedPolicyId:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any
  EndorsementID:any;
  searchTerm: string = '';
  teamName:any;
  searchCriteria = {
    PolicyType:'',
     AttachedBy:'',
     TransactionType:'',
       AttachmentDate:'',
  };
  
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef ,) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllFile()
    })
   }
  
  ngOnInit(): void {
      
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.teamName =localStorage.getItem('teamName');
    this.getAllFile()
  }
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  onPolicyTypeChange(newPolicyType: string) {
    this.updateSearchCriteria({ PolicyType: newPolicyType});
  }

  onnewTransactionTypeChange(newTransactionType: string) {
    this.updateSearchCriteria({ TransactionType: newTransactionType});
  }
  
  
  

  onAttachedByChange(newAttachedBy: string) {
    this.updateSearchCriteria({ AttachedBy: newAttachedBy });
  }

  onAttachmentDateChange(newAttachmentDate: string) {
    this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
  }

  
  
 

    // 🔽 Get all files & sort latest first
  getAllFile() {
    this.http
      .getAllDataId(ApiUrl.getAllTransactionFileByAccountId, this.accountId)
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

  onRowClick(file: any) {
    const httpsFileUrl = file.FileUrl.replace('http://', 'https://');
    console.log(httpsFileUrl); // Display the HTTPS version of the FileUrl
  
    const link = document.createElement('a');
    link.href = httpsFileUrl;
    link.download = file.FileName;
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  
  addEditAttachement() {
    const dialogRef = this.dialog.open(AddEditTransactionAttachmentComponent, {
      width: '800px',
      height: '630px',  
  })}

  
 goToTransation() {
  this.router.navigateByUrl('/transaction');
}

}
