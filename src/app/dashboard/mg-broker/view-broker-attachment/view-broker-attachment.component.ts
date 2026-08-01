import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddBrokerAttachmentComponent } from '../add-broker-attachment/add-broker-attachment.component';

@Component({
  selector: 'app-view-broker-attachment',
  standalone: true,
   imports: [CommonModule,MatButtonModule,FormsModule,RouterLink,MaterialModule,HttpClientModule,SpinnerComponent],
  templateUrl: './view-broker-attachment.component.html',
  styleUrl: './view-broker-attachment.component.scss'
})
export class ViewBrokerAttachmentComponent {

  showSpiner = true
  listOfAllFatchData:any =[];
  id:any;
  accountName ='';
  MarkedPolicyId:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any
  EndorsementID:any;
  searchTerm: string = '';
  teamName:any;

  



   constructor(private route: ActivatedRoute,private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef ,) {

     this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllFile()
    })
   }


  
  ngOnInit(): void {
      this.id = this.route.snapshot.paramMap.get('id');
  
    this.teamName =localStorage.getItem('teamName');
    this.getAllFile()
  }
  
 
  
  
 

    // 🔽 Get all files & sort latest first
  getAllFile() {
    this.http
      .getAllDataId(ApiUrl.getBrokerUploadFile,this.id)
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
  const dialogRef = this.dialog.open(AddBrokerAttachmentComponent, {
    width: '800px',
    height: '630px',
    data: {
      id: this.id
    }
  });
}


}
