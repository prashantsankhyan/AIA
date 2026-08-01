import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AllApiService } from '../../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
import { CertsAttachmentComponent } from '../certs-attachment/certs-attachment.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SearchCertsAttachementPipe } from '../search-certs-attachement.pipe';

@Component({
  selector: 'app-list-of-certs-attachment',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MaterialModule ,HttpClientModule,SearchCertsAttachementPipe,SpinnerComponent],
  templateUrl: './list-of-certs-attachment.component.html',
  styleUrl: './list-of-certs-attachment.component.scss'
})
export class ListOfCertsAttachmentComponent {
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
    HoldingID: '',
    Description: '',
    AttachmentDate: '',
    EnteredBy:'',
   
  
  };
  HoldingID:any 
constructor(private route: ActivatedRoute,private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) {}

ngOnInit() {
  this.HoldingID = this.route.snapshot.paramMap.get('HoldingID');
 
  console.log('Certs Attachment ID:', this.HoldingID);
  this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    this.teamName =localStorage.getItem('teamName');
   
    
    this.getAllFile()
}


  sendHoldingMail(data:any) {
    let HolderId =data.HoldingID
    
  this.http
    .sendHoldingCertificateMail(Number(HolderId), 'certs@aiazone.net')
    .subscribe({
      next: (res) => {
        console.log(res);
        alert('Mail sent successfully.');
      },
      error: (err) => {
        console.error(err);
        alert('Unable to send mail.');
      }
    });
}
 
  

  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  onHoldingIDChange(newHoldingID: string) {
    this.updateSearchCriteria({ HoldingID: newHoldingID });
    
  }

  onDescriptionChange(newDescription: string) {
    this.updateSearchCriteria({ Description: newDescription });
  }
  
  onEnteredByChange(newEnteredBy: string) {
    this.updateSearchCriteria({ EnteredBy: newEnteredBy });
  }
  onAttachmentDateChange(newAttachmentDate: string) {
    this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
  }


  
  
  getAllFile(){
    this.http.getAllDataId(ApiUrl.getHolderCertificateByAccountId,this.accountId).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response);
        this.listOfAllFatchData =obj.Holding_Attachments
           
         
        }

    
    )
  }
 onClickDataGetClick(file: any) {
  const httpsFileUrl = file.FileUrl.replace('http://', 'https://');
  const fileName = file.FileName;

  
  const link = document.createElement('a');
  link.href = httpsFileUrl;
  link.setAttribute('download', fileName);
  link.setAttribute('target', '_blank'); 
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// onRowClick(file: any) {
//   const httpsFileUrl = file.FileUrl.replace('http://', 'https://');
//   const email = '';
//   const subject = encodeURIComponent('File Attachment');
//   const body = encodeURIComponent('Please find the File at: ' + httpsFileUrl);
//   const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

//   const link = document.createElement('a');
//   link.href = mailtoLink;
//   link.target = '_blank';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }


onRowClick(file: any) {
  const httpsFileUrl = file.FileUrl.replace('http://', 'https://');

  const subject = encodeURIComponent('File Attachment');
  const body = encodeURIComponent(`Please find the file: ${httpsFileUrl}`);

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}




  
  addEditAttachement(data:any) {
    
   
    const dialogRef = this.dialog.open(CertsAttachmentComponent, {
      width: '800px',
      height: '540px',
      data:{HoldingID:this.HoldingID}
    
  
    
  })
}

backToHolder(){
  this.router.navigate(['certs/holder'])
}
  
  



}
