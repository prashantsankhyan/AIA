import { ChangeDetectorRef, Component } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../sharingModule/material/material.module';
import { CommonModule } from '@angular/common';
import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../_core/apiUrl';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AddEditMarketdComponent } from './add-edit-marketd/add-edit-marketd.component';
import { DeleteMarketedComponent } from './delete-marketed/delete-marketed.component';
import { UpdateMarketedStatusComponent } from './update-marketed-status/update-marketed-status.component';
import { timeout, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MarketedPipe } from './_searchMarketed/marketed.pipe';
import { RestoreDeletedDataComponent } from './restore-deleted-data/restore-deleted-data.component';
@Component({
  selector: 'app-marketed',
  standalone: true,
  imports: [CommonModule,NavBarComponent,MaterialModule,SpinnerComponent,MarketedPipe],
  templateUrl: './marketed.component.html',
  styleUrl: './marketed.component.scss'
})
export class MarketedComponent {
  showSpiner = true;
  showAllData= true;
  showDeleteData = false;
  TeamType:any;
  listOfMarkedPolicy:any =[];
  deleteMarkedt:any =[];
  AccountID:any;
  MarkedPolicyID='';
  No_of_Unit:any;
  No_of_Driver:any;
  PolicyType:any;
  userName:any;
  accountName:any;
  ChildPolicyID:any
  EffectiveDate:any
  ExpirationDate:any;
  isNameDropdownOpen: boolean = false;
  lookUpCode:any;
  searchCriteria = {
    Effective: '',
    Expiration: '',
    Source: '',
    LineShortName:''
  };
  wikiQuery:any

 
  
  constructor(private http:AllApiService,private router:Router,private toastr: ToastrService,public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllMarkedPolicy()
    })
  }

  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
  }

    
  

  ngOnInit(): void {
    this.clearLocalStorage()
     this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
     this.accountName = localStorage.getItem('accountName');
     this.No_of_Unit =localStorage.getItem('No_of_Unit');
    this.No_of_Driver =localStorage.getItem('No_of_Driver');
    this.PolicyType =localStorage.getItem('PolicyType');
    this.userName = sessionStorage.getItem('UserName');
    this.lookUpCode = localStorage.getItem('lookUpCode');
    

   
    if(this.userName == null){
      this.router.navigate(['/login'])  
    }
     this.getAllMarkedPolicy();
    
    
  }

  
 updateSearchCriteria(criteria: any) {
  this.searchCriteria = { ...this.searchCriteria, ...criteria };
  this.cdr.markForCheck(); // Notify Angular that changes have occurred
}

onEffectiveChange(newEffective: string) {
  this.updateSearchCriteria({ Effective: newEffective });
  
}

onExpirationChange(newExpiration: string) {
  this.updateSearchCriteria({ Expiration: newExpiration });
}

onSourceChange(newSource: string) {
  this.updateSearchCriteria({ Source: newSource });
}
  
onLineShortNameChange(newLineShortName: string) {
  this.updateSearchCriteria({ LineShortName: newLineShortName });
}


  searchCompany() {
    const rawInput = this.wikiQuery;
    const cleanInput = rawInput
      .replace(/\binc\b/i, '')
      .trim()
      .replace(/\s+/g, ' ');
  
    const titleCaseInput = cleanInput
      .toLowerCase()
      .split(' ')
      .map((word:any) =>
        /^[a-z]/i.test(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join('_');
  
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${titleCaseInput}`;
  
    this.http.thiredParty(url).subscribe({
      next: data => {
        console.info(' Wikipedia page not found:', data.extract);
       
      },
      error: err => {
        console.error('❌ Wikipedia page not found:', err);
        
      }
    });
  }


  
  // searchCompany() {
  //   const rawInput = this.wikiQuery.trim();
  //   const formatted = rawInput
  //     .toLowerCase()
  //     .split(' ')
  //     .map((word:any) => /^[a-z]/i.test(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word)
  //     .join('_');
  
  //   const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${formatted}`;
  
  //   this.http.thiredParty(summaryUrl).subscribe({
  //     next: (data: any) => {
  //      console.log('this.companyInfo-->',data.extract)
  //     },
  //     error: () => {
  //       // If exact match fails, use search API to find suggestions
  //       const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${rawInput}&format=json&origin=*`;
  //       this.http.thiredParty(searchUrl).subscribe((result: any) => {
  //         const results = result.query?.search;
  //         if (results?.length) {
  //           const firstTitle = results[0].title.replace(/ /g, '_');
  //           const fallbackUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${firstTitle}`;
  //           this.http.thiredParty(fallbackUrl).subscribe({
  //             next: (data: any) => {
  //               console.log('this.companyInfo-->',data.extract)
  //             },
  //             error: () => {
  //               console.log(`No Wikipedia summary available for "${rawInput}".`)
               
  //             }
  //           });
  //         } else {
  //           console.log(`No Wikipedia page found for "${rawInput}".`)
           
  //         }
  //       });
  //     }
  //   });
  // }
  
  


  
  getAllMarkedPolicy(){
    this.showAllData = true;
    this.showDeleteData = false;
    this.http.getAllDataId(ApiUrl.getMarkedPolicy,this.AccountID).pipe( timeout(35000), // Set the timeout to 45 seconds
        catchError(error => {
          if (error.name === 'TimeoutError') {
            alert('Internet is slow, please wait or check your connection.');
          } else {
            this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
          }
          return throwError(() => error); // Ensure further error handling if necessary
        })).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfMarkedPolicy = obj.MarkedPolicy ;
        this.getRowClass()
       
        
      }
    )   
  }




  getRowClass(): string {
    const count = this.listOfMarkedPolicy.length;
    if (count === 1) {
      return 'single-record';
    } else if (count === 2) {
      return 'two-records';
    } else {
      return 'default-records';
    }
  }
 

  // movetoAntoherWindow(){
  //   console.log('Lookup code:', this.lookUpCode);  // Check this in browser console
  //   const url = window.location.origin + '/info/' + this.lookUpCode;
  //   window.open(url, '_blank');
  // }

  deleteDataOfMarketd(){
    this.showAllData = false;
    this.showDeleteData = true;
    this.http.getAllDataId(ApiUrl.deletedDataOfMarked,this.AccountID).pipe( timeout(35000), // Set the timeout to 45 seconds
        catchError(error => {
          if (error.name === 'TimeoutError') {
            alert('Internet is slow, please wait or check your connection.');
          } else {
            this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
          }
          return throwError(() => error); // Ensure further error handling if necessary
        })).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.deleteMarkedt = obj.MarkedPolicy ;
        this.getRowClass()
       
        
      }
    )   
  }


  editMarketd(data:any) {
    this.MarkedPolicyID = data.MarkedPolicyID
    if(this.MarkedPolicyID == undefined){
      let MarkedPolicyID =0
      // alert(this.MarkedPolicyID)
      const dialogRef = this.dialog.open(AddEditMarketdComponent, {
        width: '1400px',
       
        data: {MarkedPolicyID:MarkedPolicyID},
      });
    }
    else{
      const dialogRef = this.dialog.open(AddEditMarketdComponent, {
        width: '1400px',
        
        data: {MarkedPolicyID:this.MarkedPolicyID},
        
      });
    
     dialogRef.afterClosed().subscribe(result => {
    if (result === 'saved') {
      this.getAllMarkedPolicy(); // reload table
    }
  });
   
}
  }

  restoreData(data:any) {
   
    this.MarkedPolicyID = data.MarkedPolicyID
    this.ChildPolicyID = data.ChildPolicyID;
      const dialogRef = this.dialog.open(RestoreDeletedDataComponent, {
        width: '400px',
        
        data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID},
        
      });
   
   
    
  }


  completeNextStep(data:any){
    let MarkedPolicyId = data.MarkedPolicyID;
    let ChildPolicyID = '0';
    let EndorsementID ='0';
    let IsChildPolicyExist = data.IsChildPolicyExist;
    let marketedName = data.LineShortName;
    
    
   
    localStorage.setItem('MarkedPolicyID', MarkedPolicyId)
    localStorage.setItem('ChildPolicyID', ChildPolicyID)
    localStorage.setItem('EndorsementID', EndorsementID)
    localStorage.setItem('IsChildPolicyExist', IsChildPolicyExist)
    localStorage.setItem('marketedName', marketedName)
    
    this.router.navigate(['/detailLayout'])
    
  }

 
  

  updateStatus(data:any) {
    this.dialog.open(UpdateMarketedStatusComponent ,{
      width: '450px',
      height:'250px',
      data:{MarkedPolicyID:data.MarkedPolicyID}

    });
    
  }

  delete(data:any) {
    this.dialog.open(DeleteMarketedComponent ,{
      width: '450px',
      height:'250px',
      data:{MarkedPolicyID:data.MarkedPolicyID}

    });
    
  }



clearLocalStorage(){
    localStorage.removeItem('MarkedPolicyID')
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('IsChildPolicyExist')
  }




  openListOfAllFile() {
    const url = `${window.location.origin}/#/marketed/listOfAttachemtAddedBySale`;

    // Open the URL in a new tab
    window.open(url, '_blank');
  
    
  }

  listOfAttachemnt(){
    this.router.navigate(['/marketed/listOfAttachment']);
  }



}
