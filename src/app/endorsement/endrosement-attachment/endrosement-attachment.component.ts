import { ChangeDetectorRef, Component } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEndrosementAttachmentComponent } from './add-endrosement-attachment/add-endrosement-attachment.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SeachEndAttachPipe } from '../seach-end-attach.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-endrosement-attachment',
  standalone: true,
  imports: [CommonModule, MaterialModule ,SeachEndAttachPipe,RouterLink,SpinnerComponent],
  templateUrl: './endrosement-attachment.component.html',
  styleUrl: './endrosement-attachment.component.scss'
})  
export class EndrosementAttachmentComponent {
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
      TeamName: '',
      Description: '',
      AttachmentDate: '',
      EnteredBy:'',
      PolicyType:'',
    
    };
  
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
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
    
  }
  
  onDescriptionChange(newDescription: string) {
    this.updateSearchCriteria({ Description: newDescription });
  }
  
  onEnteredByChange(newEnteredBy: string) {
    this.updateSearchCriteria({ EnteredBy: newEnteredBy });
  }
  onNewTeamNameChange(newTeamName: string) {
    this.updateSearchCriteria({ TeamName: newTeamName });
  }
  
  onPolicyTypeChange(newPolicyType: string) {
    this.updateSearchCriteria({ PolicyType: newPolicyType });
  }
  
  getAllFile(){
    this.http.getAllDataId(ApiUrl.getAllAttachmetOfPolicyAndEndrosement,this.accountId).subscribe(
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

  
  addEditAttachement(data:any) {
    this.dialog.open(AddEndrosementAttachmentComponent ,{
      width: '600px',
    
     
    
    });
}


}
