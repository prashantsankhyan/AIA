import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PolicyNavComponent } from '../../../policy/policy-nav/policy-nav.component';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AddEditAttachementOfSupportComponent } from './add-edit-attachement-of-support/add-edit-attachement-of-support.component';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SearchSupportAttachmentPipe } from './search-support-attachment.pipe';

@Component({
  selector: 'app-attachement-of-support',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule,RouterLink,PolicyNavComponent,MaterialModule ,HttpClientModule,SpinnerComponent,SearchSupportAttachmentPipe ],
  templateUrl: './attachement-of-support.component.html',
  styleUrl: './attachement-of-support.component.scss'
})
export class AttachementOfSupportComponent {


  showSpiner = true
  listOfAllFatchData:any =[];
  accountId ='';
  accountName ='';
  MarkedPolicyId:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any
  EndorsementID:any;
  searchTerm:any;
  teamName:any;
   listOfEmpity:any;
  showTaleIfempity = false;
  showTableIfDataHave = false;
  showEndrosementList = true;
  listOfPolicy:any=[];
   
  
  constructor( private http:AllApiService,private router:Router,public dialog: MatDialog,) { 
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


  
  
  
  getAllFile(){
    this.http.getAllDataId(ApiUrl.getReportTeamExcelFileDataGet,this.accountId).subscribe(
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

  
  addEditAttachement() {
    
   
    const dialogRef = this.dialog.open(AddEditAttachementOfSupportComponent, {
      width: '800px',
     
    
  
    
  })}
}
