import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LossRunNavBarComponent } from '../../loss-run/loss-run-nav-bar/loss-run-nav-bar.component';
import { SearchLossRunPipe } from '../../loss-run/search-loss-run.pipe';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-loss-run-list',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,SearchLossRunPipe ,MaterialModule ,HttpClientModule ,SpinnerComponent],
  templateUrl: './loss-run-list.component.html',
  styleUrl: './loss-run-list.component.scss'
})
export class LossRunListComponent {
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
    PolicyType: '',
    EnteredBy: '',
    AttachmentDate: '',
  
  };
  
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      // this.getAllFile()
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
    
  }

  onPolicyTypeChange(newPolicyType: string) {
    this.updateSearchCriteria({ PolicyType: newPolicyType });
  }
  
  onEnteredByChange(newEnteredBy: string) {
    this.updateSearchCriteria({ EnteredBy: newEnteredBy });
  }
  
  getAllFile(){
    this.http.getAllDataId(ApiUrl.getLossrundetail,this.accountId).subscribe(
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
