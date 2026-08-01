import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_service/all-api.service';
import { SearchAttachmentPipe } from '../../search-attachment.pipe';




@Component({
  selector: 'app-list-of-sale-team-attachment',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,SearchAttachmentPipe,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './list-of-sale-team-attachment.component.html',
  styleUrl: './list-of-sale-team-attachment.component.scss'
})
export class ListOfSaleTeamAttachmentComponent {
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
  AttachmentDate='';
  searchCriteria = {
    PolicyType: '',
    AttachedBy: '',
    AttachmentDate: '',
  
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

  onAttachmentDateChange(newAttachmentDate: string) {
    this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
    alert("0")
  }

  onPolicyTypeChange(newPolicyType: string) {
    this.updateSearchCriteria({ PolicyType: newPolicyType });
  }
  
  onEAttachedByChange(newAttachedBy: string) {
    this.updateSearchCriteria({ AttachedBy: newAttachedBy });
  }
  
  
  getAllFile(){
    this.http.getAllDataId(ApiUrl.getAllFatchData,this.accountId).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response);
        this.listOfAllFatchData =obj.AttachmentDetail
           
         
        }

    
    )
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

  
 
  
  
}
