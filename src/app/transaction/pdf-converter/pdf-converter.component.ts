import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { ApiUrl } from '../../_core/apiUrl';
import { NgxPrintModule } from 'ngx-print';
@Component({
  selector: 'app-pdf-converter',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,NgxPrintModule,SpinnerComponent],
  templateUrl: './pdf-converter.component.html',
  styleUrl: './pdf-converter.component.scss'
})
export class PdfConverterComponent {
  InvoiceID ='';
  AccountId ='';
  listOfData:any[] =[];
  listForPdf:any =[];
  TransactionID:any;
  currentDate =new Date()
  showSpinner = true;
  ListOfAllVehicle:any=[]
  Service:any;
  allNotes: string[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private http:AllApiService,private router:ActivatedRoute,public dialog: MatDialog,) { }
  ngOnInit(): void {
    let data = this.data ;
    // this.InvoiceID = data.InvoiceID
    this.InvoiceID = data.InvoiceID ?? 0;
    // alert(this.InvoiceID)
    this.AccountId = data.AccountID
    this.Service = data.Service
    
    // this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    // this.getAllTransationByAccountId();
    this.getdetailOfAllData();
    this.getResultData()
    // this.makeForm()
  
  }
  getdetailOfAllData(){
    this.http.getAllDataByTwoId(ApiUrl.getDatForInvoice,this.AccountId,this.InvoiceID).subscribe(data=>{
      let response = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.listForPdf = obj.Detail ;
       this.allNotes = [];

      obj.Detail.forEach((outer: any) => {
        outer.Detail.forEach((inner: any) => {
          if (inner.Notes) {
            this.allNotes.push(inner.Notes);
          }
        });
      });
      this.showSpinner = false;

    

    })
  }
getCalculatedValues(data1: any) {

  const amount = Number(data1?.Amount || 0);
  const policyFee = Number(data1?.PolicyFee || 0);
  const companyFinanced = Number(data1?.CompanyFinanced || 0);

  const surpluxPercent = Number(data1?.SurpluxTax || 0);
  const stamingPercent = Number(data1?.StamingFee || 0);

  const surpluxValue = (amount * surpluxPercent) / 100;
  const stamingValue = (amount * stamingPercent) / 100;

  const total =
    amount + policyFee + surpluxValue + stamingValue + companyFinanced;

  return {
    surpluxValue,
    stamingValue,
    total
  };
}

 getResultData() {
  // Check if Service is not null, not empty string, and not zero
  if (this.Service !== null && this.Service !== '' && this.Service !== 0) {
    this.http.getAllDataByTwoId(ApiUrl.submitChangeRequestForDriverAndVehicle, this.AccountId, this.Service)
      .subscribe(data => {
        const obj = JSON.parse(JSON.stringify(data));
        this.ListOfAllVehicle = obj.Vehicles || [];
      });
  } else {
    // Optionally clear or set empty list if Service is invalid
    this.ListOfAllVehicle = [];
  }
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
html2canvas(DATA, { scale: 3 }).then((canvas) => {
  let fileWidth = 208;
  let fileHeight = (canvas.height * fileWidth) / canvas.width;
  const FILEURI = canvas.toDataURL('image/png');
  let PDF = new jsPDF('p', 'mm', 'a4');
  let position = 0;
  PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  PDF.save('invoice.pdf');
});
  }
 

}
