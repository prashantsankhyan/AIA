import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharingModule/material/material.module';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AllApiService } from '../_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';
import { TransactionNavBarComponent } from './transaction-nav-bar/transaction-nav-bar.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddEditTransactionComponent } from './add-edit-transaction/add-edit-transaction.component';
import { ManageBalanceComponent } from './manage-balance/manage-balance.component';
import { PdfConverterComponent } from './pdf-converter/pdf-converter.component';
import { DisplayCarrierAndBrokerMGComponent } from './display-carrier-and-broker-mg/display-carrier-and-broker-mg.component';
import { SearchTransactionfilterPipe } from './search-transactionfilter.pipe';
import { ReceiptComponent } from './receipt/receipt.component';
import { ViewSubmitChangeRequsestDriverAndVehicleComponent } from './view-submit-change-requsest-driver-and-vehicle/view-submit-change-requsest-driver-and-vehicle.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [TransactionNavBarComponent,CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,SpinnerComponent,SearchTransactionfilterPipe],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})

export class TransactionComponent {
  genrateInvoiceIdForm!:FormGroup ;
  submit = false ;
  alertMessage ="";
  messageSuccess = true;
  AccountID ='';
  listOfTransactions:any =[];
  showSpiner = true;
  Description ='';
  page: number = 1;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = [10, 50, 100, 1000];
  userPermission:any;
  userPermissionList:any =[];
  employeePermission:any;
  pagePermission:any;
  savePermission:any;
  updatePermissin:any;
  deletePermission:any;
  LineName ='';
  TotalBalance='';
  submitFormAlert = true;
  searchCriteria = {
    ARDue: '',
  amount: '',
  enteredBy: '',
  GenerateInvoice: '',
  Child_EffectiveDate: '',
  Child_ExpirationDate:'',
  };
  
  constructor(private fb: FormBuilder,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService,private cdr: ChangeDetectorRef ,public dialog: MatDialog,) { }

  ngOnInit(): void {
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.getAllTransationByAccountId();
    this.makeForm()
  
  }
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  
  
  onARDueChange(newARDue: string) {
    this.updateSearchCriteria({ ARDue: newARDue });
  }

  onAmountChange(newAmount: string) {
    this.updateSearchCriteria({ amount: newAmount });
  }
  
  
  

  onEnteredByChange(newEnteredBy: string) {
    this.updateSearchCriteria({ enteredBy: newEnteredBy });
  }

  onGenerateInvoiceChange(newGenerateInvoice: string) {
    this.updateSearchCriteria({ GenerateInvoice: newGenerateInvoice });
  }

  onChild_EffectiveDateChange(newChild_EffectiveDate: string) {
    this.updateSearchCriteria({ Child_EffectiveDate: newChild_EffectiveDate });
  }

  onChild_ExpirationDateChange(newChild_ExpirationDate: string) {
    this.updateSearchCriteria({ Child_ExpirationDate: newChild_ExpirationDate });
  }
  

 
 


  

  // addEditTransactions(data?:any) {
  
  
  //   this.dialog.open(AddEditTransactionsComponent ,{
  //     width: '1800px',
  //     height:'1000px',
  //     data: {TransactionID:data.TransactionID  }

  //   });
  
   
  // }

  getAllTransationByAccountId(){
    this.http.getAllDataId(ApiUrl.getAllTransactionsByAccountId,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
       let response = JSON.stringify(data)
       let obj  = JSON.parse(response)
       
       this.listOfTransactions = obj.TransactionNews
       this.TotalBalance =obj.TotalBalance
       

      }
    )
  }
  
 
  // addInvoice(data?:any) {
  //   this.dialog.open(PdfconverterComponent ,{
  //     width: '1800px',
  //     height:'1000px',
  //     data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID
  //      }
  //   });
  // }

  // manageBalance(data?:any) {
  //   this.dialog.open(ManageBalanceComponent ,{
  //     width: '400px',
  //     height:'300px',
  //     data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID,TransactionID:data.TransactionID
  //      }
  //   });
  // }

  // totalOpeningBalanceByInvoiceId(data?:any) {
  //   this.dialog.open(TotalOpeningBalanceByInvoiceIdComponent ,{
  //     width: '400px',
  //     height:'300px',
  //     data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID
  //      }
  //   });
  // }

  makeForm(){
    this.genrateInvoiceIdForm = this.fb.group({
    AccountID:[this.AccountID ,[Validators.required,]],
    TransactionIDs:this.fb.array([]),
    });
  }
  newLineList: any[] = [];

  cehckboxcehck(event: any) {
    const TransactionIDs = this.genrateInvoiceIdForm.get('TransactionIDs') as FormArray;
  
    if (event.target.checked) {
      TransactionIDs.push(this.fb.group({
        TransactionID: event.target.value.toString()
      }));
  
      console.log(TransactionIDs);
    } else {
      let index = -1;
      for (let i = 0; i < TransactionIDs.length; i++) {
        if (TransactionIDs.at(i).value.TransactionID === event.target.value) {
          index = i;
          break;
        }
      }
  
      if (index > -1) {
        TransactionIDs.removeAt(index);
        console.log('After Delete', TransactionIDs);
      }
    }
  }

  submitForm(){
    this.submit = true ; 
    this.submitFormAlert = false
    this.messageSuccess = false;
    if(!this.genrateInvoiceIdForm.valid){
      this.messageSuccess = true;
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.genrateInvoiceIdForm.value))

     

    this.http.addEditData(ApiUrl.addInvoiceId,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.alertMessage =obj.ErrorMessage;
      
       this.showSuccess();
       this.submitFormAlert = false

        console.log(obj)
        
      }
    
    )
   
  }


  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }



 showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.messageSuccess = false;
    this.changeLocation()
  
  } 

  onTableDataChange(event: any) {
    this.page = event;
    this.getAllTransationByAccountId();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllTransationByAccountId();
  }

  addEditTransactions(data?:any) {
  
  
    this.dialog.open(AddEditTransactionComponent ,{
      width: '1800px',
      height:'800px',
      data: {TransactionID:data.TransactionID  }

    });
  
   
  }

    viewTransactions(data?:any) {
  
    this.dialog.open(AddEditTransactionComponent ,{
      width: '1800px',
      height:'800px',
      data: {TransactionID:data.TransactionID,HideShowButtoon:'0' }

    });
  
   
  }

  manageBalance(data?:any) {
    this.dialog.open(ManageBalanceComponent ,{
      width: '400px',
      height:'400px',
      data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID,TransactionID:data.TransactionID
       }
    });
  }
 displayDataBrokerMG(data?:any) {
    this.dialog.open(DisplayCarrierAndBrokerMGComponent ,{
      width: '400px',
      height:'260px',
      data: {broker:data.mGs,carriers:data.carriers
       }
    });
  }



  addInvoice(data?:any) {
    this.dialog.open(PdfConverterComponent,{
      width: '1800px',
      height:'1000px',
      data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID,Service:data.Service}
    });
  }


  receipt(data?:any) {
    this.dialog.open(ReceiptComponent,{
      width: '1800px',
      height:'1000px',
      data: {InvoiceID:data.InvoiceID,AccountID:data.AccountID}
    });
  }



 goToAttachement() {
  this.router.navigateByUrl('/transaction/transactionAttachement');
}



 
}
