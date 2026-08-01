import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-truckers-general-liability',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPrintModule],
  templateUrl: './truckers-general-liability.component.html',
  styleUrl: './truckers-general-liability.component.scss'
})
export class TruckersGeneralLiabilityComponent {
  isChecked = false;
  isChecked1 = false;
  isChecked2 = false;
  isChecked3 = false;
  isChecked4 = false;
  isChecked5 = false;
  isChecked6 = false;
  isChecked7 = false;
  isChecked8 = false;
  isChecked9 = false;
  isChecked10 = false;
  isChecked11 = false;
  isChecked12 = false;
  isChecked13 = false;
  isChecked14 = false;
  isChecked15 = false;
  isChecked16 = false;
  isChecked17 = false;
  isChecked18 = false;
  isChecked19 = false;
  isChecked20 = false;
  isChecked21 = false;
  isChecked22 = false;
  isChecked23 = false;
  isChecked24 = false;
  isChecked25 = false;
  isChecked26 = false;
  isChecked27 = false;
  isChecked28 = false;
  isChecked29 = false;
  isChecked30 = false;
  isChecked31 = false;
  isChecked32 = false;
  isChecked33 = false;
  isChecked34 = false;
  isChecked35 = false;
  isChecked36 = false;
  isChecked37 = false;
  isChecked38 = false;
  isChecked39 = false;
  isChecked40 = false;
  isChecked41 = false;
  isChecked42 = false;
  isChecked43 = false;
  isChecked44 = false;
  isChecked45 = false;
  isChecked46 = false;
  isChecked47 = false;
  isChecked48 = false;
  isChecked49 = false;
  isChecked50 = false;
  isChecked51 = false;
  isChecked52 = false;
  isChecked53 = false;
  isChecked54 = false;
  isChecked55 = false;
  isChecked56 = false;
  isChecked57 = false;
  isChecked58 = false;
  isChecked59 = false;
  isChecked60 = false;
  isChecked61 = false;
  isChecked62 = false;
  isChecked63 = false;
  isChecked64 = false;
  isChecked65 = false;
  isChecked66 = false;
  isChecked67 = false;
   isChecked68 = false;
  effectiveDate: string = '';
  today: Date = new Date();
  showSpiner = true
    accountSummaryForm!: FormGroup;
    AccountID: any;
    ChildPolicyID: any;
    userPermission: any;
    LoginUserName: any;
    AccountSummaryID = '';
    MarkedPolicyID: any;
    submit = false;
    messageSuccess = true;
    alertMessage = '';
    savedData: any;
    listOfData:any =[];
    ownerShip ='100%'
    listOfCommodity:any =[];
  
    userName:any;
    accountId:any;
    MarkedPolicyId:any;
    vehicleDetails:any=[];
    driverDetails:any=[];
  
    ClientSummary:any=[];
    Commodity:any =[];
    formattedTypes: string = '';
    constructor(
      private fb: FormBuilder,
      private http: AllApiService,
      private cRouter: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService,
    ) {}
  ngOnInit() { 
    this.userName = sessionStorage.getItem('UserName')
   
    
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
    const currentDate = new Date();

    // Format the date as MM/dd/yyyy
    const formattedDate = this.formatDate(currentDate);

    // Assign the formatted date to the property used in the template
    this.effectiveDate = formattedDate;
    this.getListOfData()
    this.getComodityValue()
    
   

  }

  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

    getComodityValue(){
    this.http.getAllDataByTwoId(ApiUrl.GetAllCommodityByChildandMarkedPolicyID,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
      (data) => {
        
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.Commodity = obj.Commodity;
        console.log(this.Commodity)
        const types = this.Commodity
    ?.map((c:any) => c.Type?.trim())
    ?.filter((type:any) => type); // remove empty or null

  this.formattedTypes = types?.join(', ') || ''
  
       
      },
      (error) => {
        console.error('Error loading data from API:', error);
      }
    );
  }
   getListOfData(){
      this.http.getAllDataByThreId(ApiUrl.getDataForAttachSmallAccountFile,this.accountId,this.MarkedPolicyId,this.ChildPolicyID).subscribe(data =>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfData = obj;
         
        const name = this.listOfData?.AccountName?.toLowerCase().trim() || '';
       

       
        this.isChecked1 = name.endsWith('inc');        // Corporation
        this.isChecked2 = name.endsWith('llc');         // LLC
        
        
        this.isChecked3 = name.endsWith('partnership'); // Partnership
        this.isChecked = !this.isChecked1 && !this.isChecked2 && !this.isChecked3;  // or however you determine it
        this.vehicleDetails = obj.Vehicles;
        // this.driverDetails = obj.Drivers;
        this.driverDetails = obj.Drivers.map((driver: any) => ({
          ...driver,
          Experience: this.getDriverExperience(driver.YearofLicenceIssued) // Calculate experience dynamically
        }));
        this.ClientSummary =obj.ClientSummary
      
  
        console.log("Vehicle Details:", this.vehicleDetails);
        console.log("Driver Details:", this.driverDetails);
        console.log(Array.isArray(this.listOfData));
        
        
      })
      
    }
    objectKeys(obj: any): string[] {
      return Object.keys(obj);
    }
   
    
  getDriverExperience(issuedDate: string): string {
    if (!issuedDate) return 'N/A';
  
    const issued = new Date(issuedDate);
    const today = new Date();
  
    let years = today.getFullYear() - issued.getFullYear();
    let months = today.getMonth() - issued.getMonth();
    let days = today.getDate() - issued.getDate();
  
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
  
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}`;
  }

  generatePDF() {
    const original = document.getElementById('print-section');
    if (!original) return;
  
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const DPI = 96;
    const MM_TO_PX = DPI / 25.4;
  
    const canvasWidthPx = A4_WIDTH_MM * MM_TO_PX;
    const canvasHeightPx = A4_HEIGHT_MM * MM_TO_PX;
  
    html2canvas(original, {
      scale: 1, // Avoid over-scaling, let us control the canvas size
      width: original.scrollWidth,
      height: original.scrollHeight,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
  
      const imgWidth = A4_WIDTH_MM;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= A4_HEIGHT_MM;
  
      while (heightLeft > 0) {
        position -= A4_HEIGHT_MM;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= A4_HEIGHT_MM;
      }
  
      pdf.save('document.pdf');
    });
  }
  
  
  
  
  
  
  
  
  
  


  // generatePDF() {
  //   const data = document.getElementById('print-section');
  //   if (data) {
  //     html2canvas(data).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const pageHeight = pdf.internal.pageSize.getHeight();
    
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
    
  //       let heightLeft = imgHeight;
  //       let position = 0;
  //       let pageNumber = 1;
    
  //       // Add first page
  //       pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
  //       pdf.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 10);
    
  //       heightLeft -= pageHeight;
    
  //       // Add more pages if needed
  //       while (heightLeft > 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pageNumber++;
  //         pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
  //         pdf.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 10);
  //         heightLeft -= pageHeight;
  //       }
    
  //       pdf.save('download.pdf');
  //     });
  //   }
  // }
  
}
