import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrl } from '../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ViewSubmitChangeRequsestDriverAndVehicleComponent } from '../view-submit-change-requsest-driver-and-vehicle/view-submit-change-requsest-driver-and-vehicle.component';

@Component({
  selector: 'app-add-edit-transaction',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,SpinnerComponent],
  templateUrl: './add-edit-transaction.component.html',
  styleUrl: './add-edit-transaction.component.scss',
  providers: [DatePipe]
})
export class AddEditTransactionComponent {
  @ViewChild('descInput') descInput!: ElementRef;

 
  @ViewChild('firstRow') firstRow!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Ensure input doesn't auto-focus
      this.descInput?.nativeElement?.blur();
      
      // Focus first table row (or any other element)
      this.firstRow?.nativeElement?.focus();
    }, 0);
  }
  showSpiner = true;
  
  addEditTransactionForm!:FormGroup ;
  submit = false ;
  AccountID=''
  listOfCombineMoveResSubPolicy:any =[];
  listOfPolicyLine:any =[];
  listOfServicePolicy:any =[];

  // markedPolicyID ='';
 
  TransactionID ='';
  HideShowButtoon:any
  Flag='';
  Id =''

  showPolicyAndService = false;
  toggle = true;
  status = 'Enable';
  userPermission:any ;
  userPermissionList:any =[];
  IsSaveAllowed= true;
  alertMessage =''
 
  dataResponse:any;
  errorMessage ='';
  DateofBirth = new Date()
  DateofHired = new Date();

  messageSuccess = true;
  listTransationCode:any =[]
  pipe = new DatePipe('en-US');
  Description:any;
  description2:any;
  
  setEffective= new Date(); 
  EffectiveDate:any ;
  Date2:any
  Date1 =new Date()
  setGenerateInvoice= new Date();
  GenerateInvoice:any;
  ARDue:any;
  BillingEffective:any;
  CompFin_EffectiveDate:any;
  CompFin_Description:any;

  AccountMonth  =  new Date();  
  ProductionMonth = new Date()
  listOfPolicy:any =[]
  listForUpdateData:any =[];
  Policy:any;
  Service:any;
  ServiceMultiple: number[] = [];
  MarkedPolicyID:any
  selectionModel:any;
  EndorsementID:any;
  listOfEndorsements:any =[];
  LoginUserName:any;
  CompanyFinanced =0;
  PolicyFee =0;
  StamingFee =0;
  SurpluxTax =0;
  Amount =0;
  Total =0;
  AgencyDiscount =0;
  AgencyFees =0;
  OpeningBalance =0;
  
  constructor( @Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private datepipe: DatePipe,private router:Router,private toastr: ToastrService ,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditTransactionComponent>,) {
  
   }

  ngOnInit(): void {
    this.data
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.getAllCode()
    this.makeForm()
    this.getAllPolicyListByAccontId()
    this.currentDate()
    this.genrateInvoiceDate()
    this.HideShowButtoon = this.data.HideShowButtoon
  
    
    this.TransactionID = this.data.TransactionID
    
   if (this.TransactionID && this.TransactionID !== '0') {
  this.getDataToUdateById();

}
 this.addEditTransactionForm.valueChanges.subscribe(() => {
    this.getTotal();
    this.getOpeningBalance();
  });
  }


  
    viewSubmitChangeRequest(data:any){
      this.dialog.open(ViewSubmitChangeRequsestDriverAndVehicleComponent ,{
        width: '1800px',
        height:'900px',
       data: {ChildPolicyID:data.ChildPolicyID,EndorsementID:data.EndorsementID,AccountID:data.AccountID,EffectiveDateChange:data.EffectiveDateChange,
        IDBasedOnAMC:data.IDBasedOnAMC,LineShortName:data.LineShortName,LineName:data.LineName,EnteredBy:data.EnteredBy
  
        }
      });
    }


  currentDate(){
    let dte = new Date(this.setEffective)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate() + 1;
     var year = dte.getUTCFullYear() ;
    
     this.EffectiveDate  =month + "/" + day + "/" + year
  
  }
  genrateInvoiceDate(){
    let dte = new Date(this.setGenerateInvoice)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate() + 1;
     var year = dte.getUTCFullYear() ;
    
     this.GenerateInvoice  =month + "/" + day + "/" + year
  
  }


  subtractOrAddSimbe(){
    if (this.Amount  <0) {
  this.CompanyFinanced = Math.abs(this.Amount); // Use the absolute value of amount1
} else if (this.Amount >0) {
  this.CompanyFinanced = -Math.abs(this.Amount); // Use the negative absolute value of amount1
} else {
  // Set the agencyDiscount value for other cases
  // For example:
  this.CompanyFinanced = 0; // Set to some other value
}
}

addAmount(){
  this.CompanyFinanced = 0;
  this.PolicyFee =0;
  this.SurpluxTax =0 ;
  this.AgencyFees =0
  this.AgencyDiscount =0
  this.StamingFee =0

}



  // getTotal(){
  //   const taxAmount = (this.Amount * this.StamingFee) / 100;
  // this.Total =this.Amount  + taxAmount +this.PolicyFee +this.SurpluxTax -this.AgencyDiscount +this.AgencyFees
  
  
  // }
//   getTotal() {

//   const amount = Number(this.addEditTransactionForm.value.Amount) || 0;
//   const policyFee = Number(this.addEditTransactionForm.value.PolicyFee) || 0;
//   const surpluxTax = Number(this.addEditTransactionForm.value.SurpluxTax) || 0;
//   const agencyDiscount = Number(this.addEditTransactionForm.value.AgencyDiscount) || 0;
//   const agencyFees = Number(this.addEditTransactionForm.value.AgencyFees) || 0;
//   const taxRate = Number(this.addEditTransactionForm.value.StamingFee) || 0;

//   const taxAmount = (amount * taxRate) / 100;
 

//   this.Total =
//       amount
//     + taxAmount
//     + policyFee
//     + surpluxTax
//     - agencyDiscount
//     + agencyFees;
// }

getTotal() {

  const amount = Number(this.addEditTransactionForm.value.Amount) || 0;
  const policyFee = Number(this.addEditTransactionForm.value.PolicyFee) || 0;
  const surpluxTaxRate = Number(this.addEditTransactionForm.value.SurpluxTax) || 0; // %
  const agencyDiscount = Number(this.addEditTransactionForm.value.AgencyDiscount) || 0;
  const agencyFees = Number(this.addEditTransactionForm.value.AgencyFees) || 0;
  const stampingRate = Number(this.addEditTransactionForm.value.StamingFee) || 0; // %

  // ✅ Convert percentage properly
  const surplusTaxAmount = amount * (surpluxTaxRate / 100);
  const stampingAmount = amount * (stampingRate / 100);

  console.log("Surplus Tax Amount:", surplusTaxAmount);
  console.log("Stamping Amount:", stampingAmount);

  this.Total =
      amount
    + surplusTaxAmount
    + stampingAmount
    + policyFee
    - agencyDiscount
    + agencyFees;

}



//   getOpeningBalance() {
  
//    if (this.Amount < 0) {
     
      
//         this.OpeningBalance = this.Total+this.CompanyFinanced
        

//     } else if (this.Amount > 0) {
//         this.addEditTransactionForm.patchValue({ CompanyFinanced: '-' + Math.abs(this.CompanyFinanced) });
//         this.OpeningBalance = this.Total - Math.abs(this.CompanyFinanced);
//     } else {
//          this.CompanyFinanced =0
//         // this.OpeningBalance = this.Total; 
//     }
// }


// getOpeningBalance() {

//   const amount = Number(this.addEditTransactionForm.get('Amount')?.value) || 0;
//   const total = Number(this.Total) || 0;
//   let companyFinanced = Number(this.addEditTransactionForm.get('CompanyFinanced')?.value) || 0;

//   if (amount < 0) {

//     this.OpeningBalance = total + companyFinanced;

//   } 
//   else if (amount > 0) {

//     const negativeValue = -Math.abs(companyFinanced);

//     // 🔥 Patch ONLY if value different
//     if (companyFinanced !== negativeValue) {
//       this.addEditTransactionForm.patchValue(
//         { CompanyFinanced: negativeValue },
//         { emitEvent: false }   // 🚀 prevents infinite loop
//       );
//       companyFinanced = negativeValue; // update local variable
//     }

//     this.OpeningBalance = total - Math.abs(companyFinanced);
   

//   } 
//   else {

//     this.OpeningBalance = total;

//   }
// }

getOpeningBalance() {

  const total = Number(this.Total) || 0;
  let companyFinanced = Number(
    this.addEditTransactionForm.get('CompanyFinanced')?.value
  ) || 0;

 
  const negativeValue = -Math.abs(companyFinanced);

  if (companyFinanced !== negativeValue) {
    this.addEditTransactionForm.patchValue(
      { CompanyFinanced: negativeValue },
      { emitEvent: false }
    );
    companyFinanced = negativeValue;
  }


  this.OpeningBalance = total + companyFinanced;
  
 
}


// getOpeningBalance() {

//   const total = Number(this.Total) || 0;

//   let companyFinanced = Number(
//     this.addEditTransactionForm.get('CompanyFinanced')?.value
//   ) || 0;

//   // Always keep negative
//   const negativeValue = -Math.abs(companyFinanced);

//   if (companyFinanced !== negativeValue) {
//     this.addEditTransactionForm.patchValue(
//       { CompanyFinanced: negativeValue },
//       { emitEvent: false }
//     );
//     companyFinanced = negativeValue;
//   }

//   const openingBalance = total + companyFinanced;

//   // ✅ Update FORM CONTROL (not variable)
//   this.addEditTransactionForm
//       .get('OpeningBalance')
//       ?.setValue(openingBalance, { emitEvent: false });
// }

  // getOpeningBalance(){
    
  //   this.OpeningBalance = this.Total+this.CompanyFinanced
  // }
  

 

  getAllPolicyListByAccontId(){
   
    this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
        let respone = JSON.stringify(data)
        let obj  = JSON.parse(respone)
        this.listOfPolicy= obj.ChildPolicys ;
        console.log('policy',this.listOfPolicy)
        
      }
    )
  }

  
  getDataToUdateById(){
    this.TransactionID = this.data.TransactionID
    this.http.getAllDataId(ApiUrl.getTracnsagionByUpdate,this.TransactionID).subscribe(
      data=>{
        this.showSpiner = false
        let respone = JSON.stringify(data)
        let obj  = JSON.parse(respone)
        
        this.listForUpdateData= obj.TransactionNews ;
       
        console.log('listForUpdateData',this.listForUpdateData)
       
        this.addEditTransactionForm.controls['TransactionID'].setValue(this.listForUpdateData[0].TransactionID);
        this.addEditTransactionForm.controls['AccountID'].setValue(this.listForUpdateData[0].AccountID);
        this.addEditTransactionForm.controls['InvoiceID'].setValue(this.listForUpdateData[0].InvoiceID);
        this.addEditTransactionForm.controls['MarkedPolicyID'].setValue(this.listForUpdateData[0].MarkedPolicyID);
        this.MarkedPolicyID =this.listForUpdateData[0].MarkedPolicyID
       
        this.GenerateInvoice =this.listForUpdateData[0].GenerateInvoice;
        let generateInvoicedte = new Date(this.GenerateInvoice)
        var month = generateInvoicedte.getUTCMonth() + 1; //months from 1-12
        var day = generateInvoicedte.getUTCDate() + 1;
        var year = generateInvoicedte.getUTCFullYear() ;
    
       let generateInvoice  =month + "/" + day + "/" + year
        // this.GenerateInvoice = new Date(this.GenerateInvoice)
        this.addEditTransactionForm.controls['GenerateInvoice'].setValue(generateInvoice)
        this.ARDue =this.listForUpdateData[0].ARDue;
        let dte = new Date(this.ARDue)
        var month = dte.getUTCMonth() + 1; //months from 1-12
        var day = dte.getUTCDate() + 1;
        var year = dte.getUTCFullYear() ;
    
       let ArDueUpdate  =month + "/" + day + "/" + year
        // this.ARDue = new Date(this.ARDue)
      
        this.addEditTransactionForm.controls['ARDue'].setValue(ArDueUpdate)
        this.AccountMonth= this.listForUpdateData[0].AccountMonth;
        this.AccountMonth = new Date(this.AccountMonth)
        this.addEditTransactionForm.controls['AccountMonth'].setValue(this.AccountMonth)
        this.ProductionMonth = this.listForUpdateData[0].ProductionMonth;
        this.ProductionMonth =new Date(this.AccountMonth) ;
        this.addEditTransactionForm.controls['ProductionMonth'].setValue(this.ProductionMonth)
        this.addEditTransactionForm.controls['UpdatedBy'].setValue(this.LoginUserName )
        
        this.addEditTransactionForm.controls['Department'].setValue(this.listForUpdateData[0].Department)
        
        this.addEditTransactionForm.controls['Amount'].setValue(this.listForUpdateData[0].Amount)
        this.addEditTransactionForm.controls['TransCode'].setValue(this.listForUpdateData[0].TransCode)
        this.addEditTransactionForm.controls['PolicyFee'].setValue(this.listForUpdateData[0].PolicyFee)
        this.addEditTransactionForm.controls['SurpluxTax'].setValue(this.listForUpdateData[0].SurpluxTax)
        this.addEditTransactionForm.controls['AgencyDiscount'].setValue(this.listForUpdateData[0].AgencyDiscount)
        this.addEditTransactionForm.controls['AgencyFees'].setValue(this.listForUpdateData[0].AgencyFees)
        this.addEditTransactionForm.controls['PaymentMode'].setValue(this.listForUpdateData[0].PaymentMode)
        this.addEditTransactionForm.controls['State'].setValue(this.listForUpdateData[0].State)
        this.addEditTransactionForm.controls['StamingFee'].setValue(this.listForUpdateData[0].StamingFee)
        this.addEditTransactionForm.controls['Notes'].setValue(this.listForUpdateData[0].Notes)
       
        this.addEditTransactionForm.controls['CompanyFinanced'].setValue(this.listForUpdateData[0].CompanyFinanced)
        this.addEditTransactionForm.controls['Total'].setValue(this.listForUpdateData[0].Total)
        this.addEditTransactionForm.controls['OpeningBalance'].setValue(this.listForUpdateData[0].OpeningBalance)
        
        this.Policy =this.listForUpdateData[0].Policy;
        
        this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.Policy).subscribe(
          data=>{
            let respone  = JSON.stringify(data)
            let obj = JSON.parse(respone)
            this.listOfEndorsements = obj.Endorsements
            // alert(JSON.stringify(this.listOfEndorsements))
          }
        )
        this.Service = this.listForUpdateData[0].Service;
        if(this.Service ==''){
          this.EndorsementID = this.Service
          // this.Policy = this.Policy
        }
        else{
           
        this.EndorsementID = this.Service
        this.Policy = this.Policy
       
       
    
      
  
        }
       });
      
      
  
       
       
    
      
      
    
  }
 

 showSpinnerOnLoadEndroesement  = false
  getServiceId(data:any){

    this.MarkedPolicyID  = data.MarkedPolicyID
    this.Policy = data.ChildPolicyID;
   
    this.showSpinnerOnLoadEndroesement = true;
    this.getAllEndrosementByMarkedPolicyById()
 
  }

  getIdFromData(data:any){
    this.EndorsementID = data.EndorsementID
    this.Service = data.EndorsementID;

     this.addEditTransactionForm.patchValue({
    Service: this.Service
  });

  //  const id = data.EndorsementID;

  // if (!this.ServiceMultiple.includes(id)) {
  //   this.ServiceMultiple.push(id);
  // } else {
  //   this.ServiceMultiple =
  //     this.ServiceMultiple.filter(x => x !== id);
  // }

  // this.addEditTransactionForm
  //     .get('Policy')
  //     ?.setValue(this.ServiceMultiple.join(','));
    

  }
  
  rowClicked:any
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
 
  getAllEndrosementByMarkedPolicyById(){
    
    this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.Policy).subscribe(
      data=>{
        this.showSpinnerOnLoadEndroesement = false
        let respone  = JSON.stringify(data)
        let obj = JSON.parse(respone)
        this.listOfEndorsements = obj.Endorsements
        // alert(JSON.stringify(this.listOfEndorsements))
      }
    )
  }
 


  setArDate(){
    this.GenerateInvoice
    let dte = new Date(this.GenerateInvoice)
    let newdate  = dte.setDate(dte.getDate() +7) 
    let arDate= new Date(newdate )
   
    this.ARDue = this.formatDate(arDate)
    
    
    
   
     
  }

  formatDate(date: Date): string {
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();

    // Pad single digits with leading zeros
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
  }
 




  // rowClicked:any
  // changeTableRowColor(id: any) { 
   
  //   if(this.rowClicked === id) {
     
  //     this.rowClicked = 1;
     
  //   }
  //   else this.rowClicked = id;
  //   this.markedPolicyID = id.MarkedPolicyID
  
  //   this.showPolicyAndService = true
   
    
  // }

  stateData: any = {
  Null: { taxRate: 0.000, stampingFee: 0.000 },
  AK: { taxRate: 2.700, stampingFee: 1.000 },
  AL: { taxRate: 6.000, stampingFee: 0.175 },
  AR: { taxRate: 4.000, stampingFee: 0.000 },
  AZ: { taxRate: 3.000, stampingFee: 0.200 },
  CA: { taxRate: 3.000, stampingFee: 0.180 },
  CO: { taxRate: 3.000, stampingFee: 0.175 },
  CT: { taxRate: 4.000, stampingFee: 0.000 },
  DC: { taxRate: 2.000, stampingFee: 0.000 },
  DE: { taxRate: 3.000, stampingFee: 0.000 },
  FL: { taxRate: 4.940, stampingFee: 0.060 },
  GA: { taxRate: 4.000, stampingFee: 0.000 },
  HI: { taxRate: 4.680, stampingFee: 0.000 },
  IA: { taxRate: 0.925, stampingFee: 0.000 },
  ID: { taxRate: 1.500, stampingFee: 0.500 },
  IL: { taxRate: 3.500, stampingFee: 0.040 },
  IN: { taxRate: 2.500, stampingFee: 0.000 },
  KS: { taxRate: 3.000, stampingFee: 0.000 },
  KY: { taxRate: 3.000, stampingFee: 0.000 },
  LA: { taxRate: 4.850, stampingFee: 0.000 },
  MA: { taxRate: 4.000, stampingFee: 0.000 },
  MD: { taxRate: 3.000, stampingFee: 0.000 },
  ME: { taxRate: 3.000, stampingFee: 0.000 },
  MI: { taxRate: 2.500, stampingFee: 0.000 },
  MN: { taxRate: 3.000, stampingFee: 0.040 },
  MO: { taxRate: 5.000, stampingFee: 0.000 },
  MS: { taxRate: 4.000, stampingFee: 0.250 },
  MT: { taxRate: 2.750, stampingFee: 0.175 },
  NC: { taxRate: 5.000, stampingFee: 0.300 },
  ND: { taxRate: 1.750, stampingFee: 0.000 },
  NE: { taxRate: 3.000, stampingFee: 0.000 },
  NH: { taxRate: 3.000, stampingFee: 0.000 },
  NJ: { taxRate: 5.000, stampingFee: 0.000 },
  NM: { taxRate: 3.003, stampingFee: 0.000 },
  NV: { taxRate: 3.500, stampingFee: 0.400 },
  NY: { taxRate: 3.600, stampingFee: 0.150 },
  OH: { taxRate: 5.000, stampingFee: 0.000 },
  OK: { taxRate: 6.000, stampingFee: 0.175 },
  OR: { taxRate: 2.000, stampingFee: 10 },   // Flat fee
  PA: { taxRate: 3.000, stampingFee: 20 },   // Flat fee
  PR: { taxRate: 9.000, stampingFee: 0.000 },
  RI: { taxRate: 4.000, stampingFee: 0.000 },
  SC: { taxRate: 6.000, stampingFee: 0.000 },
  SD: { taxRate: 2.500, stampingFee: 0.175 },
  TN: { taxRate: 5.000, stampingFee: 0.175 },
  TX: { taxRate: 4.850, stampingFee: 0.040 },
  UT: { taxRate: 4.250, stampingFee: 0.180 },
  VA: { taxRate: 2.250, stampingFee: 0.035 },
  VI: { taxRate: 5.000, stampingFee: 0.000 },
  VT: { taxRate: 3.000, stampingFee: 0.000 },
  WA: { taxRate: 2.000, stampingFee: 0.300 },
  WI: { taxRate: 3.000, stampingFee: 0.000 },
  WV: { taxRate: 4.550, stampingFee: 0.000 },
  WY: { taxRate: 3.000, stampingFee: 0.175 }
};

onStateChange(state: string) {

  const selected = this.stateData[state];

  if (selected) {
    this.addEditTransactionForm.patchValue({
      SurpluxTax: selected.taxRate,
      StamingFee: selected.stampingFee
    });
  }
}


  getAllCode(){
    this.http.getAllData(ApiUrl.getAllTransationCode).subscribe(data=>{
      this.showSpiner = false
      let response = JSON.stringify(data);
      let obj  = JSON.parse(response);
      this.listTransationCode = obj.Transaction_Codes
    })
  }

  
  
  
 
  clickOnCommodity(data?:any){

   this.Flag = data.Description ;
   this.Id = data.CommodityID;
   let date =this.datepipe.transform(data.Effective, 'yyy-MM-dd')
   this.Description = data.Action + data.Description + data.Stage + date;
   this.CompFin_Description = data.Description
   
   this.Date1 = new Date(data.Effective)  
   let latest_date =this.datepipe.transform(this.Date1,'yyy-MM-dd')
   this.Date2 = latest_date;
   this.BillingEffective = latest_date;
   this.CompFin_EffectiveDate = latest_date

   
   console.log('Description',this.Description)
   

  }
  clickOnVehicle(data?:any){
    this.Flag = data.Description
    
    this.Id = data.VehicleID;
    let date =this.datepipe.transform(data.Effective, 'yyyy-MM-dd')
   this.Description = data.Action + data.Description + data.Stage + date;
   this.CompFin_Description = data.Description
   this.Date1 = new Date(data.Effective)  ;
   
   let latest_date =this.datepipe.transform(this.Date1,'yyyy-MM-dd')
   this.Date2 = latest_date;
   this.BillingEffective = latest_date;
   this.CompFin_EffectiveDate =latest_date
   }
   clickOnDriver(data?:any){
    this.Flag = data.Description
    this.Id = data.DriverID;
    let date =this.datepipe.transform(data.Effective, 'yyy-MM-dd')
   this.Description = data.Action+data.Description + data.Stage + date;
   this.CompFin_Description = data.Description
   this.Date1 = new Date(data.Effective)  
   let latest_date =this.datepipe.transform(this.Date1,'yyyy-MM-dd')
   this.Date2 = latest_date;
   this.BillingEffective = latest_date;
   this.CompFin_EffectiveDate = latest_date

   }

  makeForm(){
   
    this.addEditTransactionForm = this.fb.group({
      TransactionID:['0'],
      MarkedPolicyID:[this.MarkedPolicyID],
      AccountID:[this.AccountID],
      InvoiceID:[''],
      GenerateInvoice:[''],
      AccountMonth:[this.AccountMonth],
      ARDue:[''],
      BillingEffective:[''],
      Department:['COMMERCIAL Line'],
      ProductionMonth:[this.ProductionMonth],
      EnteredBy:[this.LoginUserName],
      UpdatedBy:[''],
      Amount:[''],
      Policy:[''],
      Service:[''],
      TransCode:[''],
      PaymentMode:[''],
      State:[''],
      StamingFee:[''],
      Notes:[''],
      PolicyFee:[''],
      SurpluxTax:[''],
      AgencyFees:[''],
      CompanyFinanced:[''],
      AgencyDiscount:[''],
      EffectiveDate:[''],
      Total:[''],
      OpeningBalance:[''],
    });
  }



  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.addEditTransactionForm.valid){
      this.messageSuccess = true
      
      return
    }
   

   let obj = JSON.parse(JSON.stringify(this.addEditTransactionForm.value))

   if(this.TransactionID){
    obj['TransactionID'] = this.TransactionID
  }

    this.http.addEditData(ApiUrl.addEditNewTransaction,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.dataResponse =obj.Data.Response;
        
       
        if(this.dataResponse == '0'){
          this.errorMessage = obj.Data.ErrorMessage
          this.error()
        
        }
        else{
          this.alertMessage = obj.Data.ErrorMessage
          this.showSuccess()
        }
     
        this.onNoClick1()
        console.log(obj)
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
  
  } 
  getService(data:any){

  }

  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
  }
  get f() {
    return this.addEditTransactionForm.controls;
    
  }


  onNoClick1(): void {
    this.dialogRef.close();
   
  }

//  addCompanyFinanced() {
  
  
//     this.dialog.open(CompanyFinancedComponent ,{
//       width: '1400px',
//       height:'800px',
    
//     });
  
   
//   }

 

  scrollToTop(el:any) {
    el.scrollTop = 0;
  }
  


  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

}
