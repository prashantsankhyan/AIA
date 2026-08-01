import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { ApiUrl } from '../../_core/apiUrl';
import { SpinnerComponent } from '../../spinner/spinner.component';
@Component({
  selector: 'app-receipt',
  standalone: true,
   imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,SpinnerComponent],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {
 InvoiceID ='';
  AccountId ='';
  listOfData:any[] =[];
  listForPdf:any =[];
  TransactionID:any;
  currentDate =new Date()
 showSpinner = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private http:AllApiService,private router:ActivatedRoute,public dialog: MatDialog,) { }
  ngOnInit(): void {
    let data = this.data ;
    this.InvoiceID = data.InvoiceID
    this.AccountId = data.AccountID
    // this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    // this.getAllTransationByAccountId();
    this.getdetailOfAllData()
    // this.makeForm()
  
  }
  getdetailOfAllData(){
    this.http.getAllDataByTwoId(ApiUrl.getDatForInvoice,this.AccountId,this.InvoiceID).subscribe(data=>{
      let response = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.listForPdf = obj.Detail ;
       this.showSpinner = false;

    

    })
  }
  getLastCurDate(data: any): string | null {
  const transactionDetails = data?.Detail?.[0]?.TransactionDetails;
  if (transactionDetails && transactionDetails.length > 0) {
    const lastItem = transactionDetails[transactionDetails.length - 1];
    return lastItem.CurDate;
  }
  return null;
}

  // public exportHtmlToPDF(){
  //   let list:any = document.getElementById('htmltable');
      
  //     html2canvas(list).then(canvas => {
          
  //         let docWidth = 204;
  //         let docHeight = canvas.height * docWidth / canvas.width;
          
  //         const contentDataURL = canvas.toDataURL('image/png')
  //         let doc = new jsPDF('p', 'mm', 'a4');
  //         let position = 10;
  //         doc.addImage(contentDataURL, 'PNG', 10, position, docWidth, docHeight)
          
  //         doc.save('exportedPdf.pdf');
  //     });
  // }


  public exportHtmlToPDF(): void {
    
    let DATA: any = document.getElementById('htmltable');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('receipt.pdf');
    });
  }
 

}
