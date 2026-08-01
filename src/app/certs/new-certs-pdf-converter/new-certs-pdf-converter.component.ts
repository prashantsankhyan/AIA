import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { NgxPrintModule } from 'ngx-print';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ApiUrl } from '../../_core/apiUrl';
import { HttpClient } from '@angular/common/http';
import { json } from 'express';
import { catchError, throwError, timeout } from 'rxjs';
import { of, forkJoin } from 'rxjs';

import { NgZone } from '@angular/core'; // 👈 Add import
import { NumberFormatPipe } from '../number-format.pipe';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-new-certs-pdf-converter',
  standalone: true,
     imports: [NgxPrintModule,CommonModule,MaterialModule,RouterModule,FormsModule ,NumberFormatPipe,FormsModule, ReactiveFormsModule],
  templateUrl: './new-certs-pdf-converter.component.html',
  styleUrl: './new-certs-pdf-converter.component.scss'
})
export class NewCertsPdfConverterComponent {

ClaimID: any;
allList: any[] = [];

account: any;
ffNumber:any;
childPolicy: any;
carrier: any;
EnteredBy: string = '';
ClaimDescription:any;
isDataLoaded = false;

   AccountID:any;
   showSpiner:any;
   ListOfChildPolicy:any=[];
   ListOfaccountDetails:any=[];
   formattedProducer: string = '';
   pdPolicies:any =[];
   alPolicies:any =[];
   mtcPolicies:any =[];
   glPolicy:any=[];
   contCargo:any=[];
   contLIABILITY:any=[];
   XS:any=[];
   contingentXS:any=[];
   nonTruckLiabilty:any=[];
   Umbrella:any=[];
   holderId:any;
   holderDetails:any;
    issueDetails: any[] = [];
  sevenRows: number[] = [];
currentDate = new Date();
showVehicleValue = false; // true = show value, false = hide value
// manualPolicy = {
//   issuingCompanyName: '',
//   naic: ''
// };

  producer ='Amerigo Insurance Agency 1110 Civic Center Ste 202D Yuba City CA 95993';
  topLabeledPolicies: { label: string; name: string; type: string }[] = [];
bottomLabeledPolicies: { label: string, name: string, type: string }[] = [];
allLabeledPolicies: any[] = [];

fixedRows: any[] = [];
  listOfPolicy: any[] = []; // assume this is loaded somewhere
  trucks: any[] = [];
   hideTrailers = false; // ✅ checkbox bound to this
  idPairs: { MarkedPolicyID: number, ChildPolicyID: number }[] = [];
  pagedTrucks: any[][] = [];
showPageMode: 'all' | 'one' = 'all';
selectedPage = 1;
manualPolicies = {
  mtc: '',
  pd: '',
  contCargo: '',
  contLiability: '',
  contXS: '',
  ntl: ''
};
displayedPolicies: { label: string }[] = [];
displayedEffectiveDates: (string | null)[] = [];
displayedPolicyNames: (string | null)[] = [];
displayedExpirationDates: (Date | null)[] = [];
displayedLimitDeductibles: { limit: string; deductible: string }[] = [];
manualPages: string[] = ['']; // default to one empty page
manualPageCount = 0; // default manual pages
listOFHolderDetails:any =[];
apiTrucks: any[] = [];          // From getAllTrucksParallel()
holderTrucks: any[] = [];       // From getHolderDetails()
clickedAfterSelection = false;

showEndrosement = false;
selectedPolicy: any = null;

 currentTime:any;
   constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private router:ActivatedRoute,
   private toastr: ToastrService,private cdr: ChangeDetectorRef  ,private httpClient: HttpClient ,public dialog: MatDialog,
      ) { }
      ngOnInit(): void {
     let data = this.data ;
    
     this.AccountID = data.AccountId;
     this.holderId = data.holderId;
    
     this.holderDetails = data.holderDetails


     this.formattedProducer = this.formatProducerAddress(this.producer);
     this.getAllPolciyBaseOfAccountId();
     this.changePolicyType()
 
     

   
 
  }
async downloadPdf() {
  try {
    const response = await fetch('assets/ACORD 25 fillableNew.pdf');

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ACORD 25 fillableNew.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    console.log('Downloaded successfully');
  } catch (err) {
    console.error(err);
  }
}


 formatProducerAddress(producer: string): string {
  const regex = /^(.*?)(\d{1,5}\s.+?\s)([A-Za-z\s]+ [A-Z]{2} \d{5})$/;

  const match = producer.match(regex);

  if (match) {
    const [, name, street, cityStateZip] = match;
    return `${name.trim()}\n${street.trim()}\n${cityStateZip.trim()}`;
  }

  return producer; // fallback if pattern doesn't match
}




showHideIndrosement(){
  this.showEndrosement = true
  
   this.resetVehicleSelection()
    
}
showPoclicy(){
  this.showEndrosement = false

   this.resetVehicleSelection()
     
}

 changePolicyType(){
      this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.AccountID).subscribe(
        data=>{
        

          let respone = JSON.stringify(data)
          let obj  = JSON.parse(respone)
          this.listOfPolicy= obj.ChildPolicys ;
        
          console.log('policy',this.listOfPolicy)
          
        }
      )

  }





getInsurerLabel(index: number): string {
  return String.fromCharCode(65 + index); // A = 65
}


 getAllPolciyBaseOfAccountId(){
   
    this.http.getPolicyDetailsByAccountIdId(ApiUrl.getPolicyDetailsBaseOfAccountId,this.AccountID).pipe( timeout(35000), // Set the timeout to 45 seconds
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
        this.ListOfChildPolicy = obj.Accounts;
        this.ListOfaccountDetails = obj.ChildPolicy;
        this.issueDetails = this.ListOfaccountDetails.map((p: any) => p.IssueDetail);

      // Ensure exactly 7 rows always — fill missing with nulls
      this.sevenRows = Array.from({ length: 7 }, (_, i) => i);
      while (this.issueDetails.length < 7) {
        this.issueDetails.push(null); // pad with nulls
      }
this.alPolicies = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'AL'
);

this.pdPolicies = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'APD'
);

this.mtcPolicies = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'MTC'
);
this.glPolicy = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'GL'
);
this.contCargo = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'CONT.CARGO'
);
this.contLIABILITY = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'CONT.LIABILITY'
);
this.XS = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'XS'
);
this.contingentXS = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'CONT.XS'
);
this.nonTruckLiabilty = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'NTL'
);
this.Umbrella = this.ListOfaccountDetails.filter(
  (item: any) => item.ChildPolicies?.Description === 'UMBRELLA'
);






console.log('AL Policies:', this.alPolicies);
console.log('PD Policies:', this.pdPolicies);
console.log('MTC Policies:', this.mtcPolicies);

// Example: To access ClientSummData for AL policies only
 this.assignLabels();
this.initFixedRows(); // 👈 Add this
this.buildDisplayedPolicies();
this.buildDisplayedEffectiveDates();
this.buildDisplayedPolicyNames();
this.buildDisplayedExpirationDates()
this.buildDisplayedLimitDeductibles();
      }

    )   
  }
  buildDisplayedPolicies(): void {
  const allPolicies = [
    { key: 'Motor Truck Cargo', data: this.mtcPolicies, match: (p:any )=> p?.ChildPolicies?.Description === 'MTC' },
    { key: 'Physical Damage', data: this.pdPolicies, match: (p:any ) => p?.ChildPolicies?.Description === 'APD' || p?.ChildPolicies?.ChildPolicyName === 'PD' },
    { key: 'Contingent Cargo', data: this.contCargo, match: (p:any ) => p?.ChildPolicies?.Description === 'CONT.CARGO' },
    { key: 'Contingent Liability', data: this.contLIABILITY, match:(p:any ) => p?.ChildPolicies?.Description === 'CONT.LIABILITY' },
    { key: 'Contingent Excess Liability', data: this.contingentXS, match: (p:any ) => p?.ChildPolicies?.Description === 'CONT.XS' },
    { key: 'Non Trucking Liability', data: this.nonTruckLiabilty, match: (p:any ) => p?.ChildPolicies?.Description === 'NTL' }
  ];

  const filled = allPolicies.filter(p => p.data?.length > 0 && p.match(p.data[0]));
  const empty = allPolicies.filter(p => !(p.data?.length > 0 && p.match(p.data[0])));

  // Merge: filled first, then empty
  this.displayedPolicies = [...filled.map(p => ({ label: p.key })), ...empty.map(p => ({ label: '' }))];
}

  buildDisplayedEffectiveDates(): void {
  const policies = [
    ...this.mtcPolicies,
    ...this.pdPolicies,
    ...this.contCargo,
    ...this.contLIABILITY,
    ...this.contingentXS,
    ...this.nonTruckLiabilty
  ];

  // Extract up to 6 formatted dates
  const dates: (string | null)[] = policies
    .map(p => {
      const eff = p?.ChildPolicies?.Effective;
      if (eff) {
        const d = new Date(eff);
        // Format manually as MM/dd/yyyy
        const formatted = `${('0' + (d.getMonth() + 1)).slice(-2)}/${('0' + d.getDate()).slice(-2)}/${d.getFullYear()}`;
        return formatted;
      }
      return null;
    })
    .filter(d => d !== null)
    .slice(0, 6);

  // Ensure 6 rows by padding with null
  while (dates.length < 6) {
    dates.push(null);
  }

  this.displayedEffectiveDates = dates;
}
buildDisplayedPolicyNames(): void {
  const policies = [
    ...this.mtcPolicies,
    ...this.pdPolicies,
    ...this.contCargo,
    ...this.contLIABILITY,
    ...this.contingentXS,
    ...this.nonTruckLiabilty
  ];

  const names: (string | null)[] = policies
    .map(p => p?.ChildPolicies?.ChildPolicyName || null)
    .filter(name => name !== null)
    .slice(0, 6);

  while (names.length < 6) {
    names.push(null); // pad to ensure 6 rows
  }

  this.displayedPolicyNames = names;
}
buildDisplayedExpirationDates(): void {
  const policies = [
    ...this.mtcPolicies,
    ...this.pdPolicies,
    ...this.contCargo,
    ...this.contLIABILITY,
    ...this.contingentXS,
    ...this.nonTruckLiabilty
  ];

  const dates: (Date | null)[] = policies
    .map(p => p?.ChildPolicies?.Expiration ?? null)
    .filter(d => d !== null)
    .slice(0, 6);

  while (dates.length < 6) {
    dates.push(null); // pad with empty
  }

  this.displayedExpirationDates = dates;
}

buildDisplayedLimitDeductibles(): void {
  const rows: { limit: string; deductible: string }[] = [];

  // MTC
  this.mtcPolicies.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'MTC') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.MTC || '',
        deductible: p?.ClientSummData?.[0]?.MTC_Deductible || ''
      });
    }
  });

  // PD
  this.pdPolicies.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'APD' || p?.ChildPolicies?.ChildPolicyName === 'PD') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.PhysicalDamage || '',
        deductible: p?.ClientSummData?.[0]?.PhyDamage_Deductible || ''
      });
    }
  });

  // CONT.CARGO
  this.contCargo.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'CONT.CARGO') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.Contingent_CargoLimit || '',
        deductible: p?.ClientSummData?.[0]?.Contingent_Deductible || ''
      });
    }
  });

  // CONT.LIABILITY
  this.contLIABILITY.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'CONT.LIABILITY') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.ContingentLiability_Limit || '',
        deductible: p?.ClientSummData?.[0]?.ContingentLiability_Deductible || ''
      });
    }
  });

  // CONT.XS
  this.contingentXS.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'CONT.XS') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.Contingent_XS_Limit || '',
        deductible: p?.ClientSummData?.[0]?.Contingent_XS_Deductible || ''
      });
    }
  });

  // NTL
  this.nonTruckLiabilty.forEach((p:any) => {
    if (p?.ChildPolicies?.Description === 'NTL') {
      rows.push({
        limit: p?.ClientSummData?.[0]?.NonTrucking_Limit || '',
        deductible: p?.ClientSummData?.[0]?.NonTrucking_Deductible || ''
      });
    }
  });

  // Ensure always 6 rows
  while (rows.length < 6) {
    rows.push({ limit: '', deductible: '' });
  }

  this.displayedLimitDeductibles = rows.slice(0, 6);
}


  getFixedPolicies(policies: any[], size = 4): any[] {
  const fixed = [...policies];
  while (fixed.length < size) {
    fixed.push({}); // push empty objects to fill space
  }
  return fixed;
}

assignLabels() {
  const topPolicies = [
    {
      exists: this.glPolicy.length > 0,
      name: 'General Liability',
      type: 'glPolicy',
      data: this.glPolicy
    },
    {
      exists: this.alPolicies.length > 0,
      name: 'Auto Liability',
      type: 'alPolicies',
      data: this.alPolicies
    },
    {
      exists: this.Umbrella.length > 0 || this.XS.length > 0,
      name: 'Umbrella / XS',
      type: 'umbrellaXS',
      data: [...this.Umbrella, ...this.XS]
    }
  ];

  const bottomPolicies = [
    {
      exists: this.mtcPolicies.length > 0,
      name: 'Motor Truck Cargo',
      type: 'mtcPolicies',
      data: this.mtcPolicies
    },
    {
      exists: this.pdPolicies.length > 0,
      name: 'Physical Damage',
      type: 'pdPolicies',
      data: this.pdPolicies
    },
    {
      exists: this.contCargo.length > 0,
      name: 'Contingent Cargo',
      type: 'contCargo',
      data: this.contCargo
    },
    {
      exists: this.contLIABILITY.length > 0,
      name: 'Contingent Liability',
      type: 'contLIABILITY',
      data: this.contLIABILITY
    },
    {
      exists: this.contingentXS.length > 0,
      name: 'Contingent Excess Liability',
      type: 'contingentXS',
      data: this.contingentXS
    },
    {
      exists: this.nonTruckLiabilty.length > 0,
      name: 'Non Trucking Liability',
      type: 'nonTruckLiabilty',
      data: this.nonTruckLiabilty
    }
  ];

  const topAvailable = topPolicies.filter(p => p.exists);
  const bottomAvailable = bottomPolicies.filter(p => p.exists);

  this.topLabeledPolicies = topAvailable.map((policy, index) => ({
    label: String.fromCharCode(65 + index),
    name: policy.name,
    type: policy.type
  }));

  this.bottomLabeledPolicies = bottomAvailable.map((policy, index) => ({
    label: String.fromCharCode(65 + index + this.topLabeledPolicies.length),
    name: policy.name,
    type: policy.type
  }));

  const allAvailable = [...topAvailable, ...bottomAvailable];

  this.allLabeledPolicies = allAvailable.map((policy, index) => ({
    label: String.fromCharCode(65 + index),
    name: policy.name,
    type: policy.type,
    issuingCompanyName: policy.data[0]?.IssueDetail?.IssuingCompanyName || '',
    naic: policy.data[0]?.IssueDetail?.NAIC || ''
  }));
  
}

getLabelByType(type: string): string {
  const foundTop = this.topLabeledPolicies.find(p => p.type === type);
  if (foundTop) return foundTop.label;

  const foundBottom = this.bottomLabeledPolicies.find(p => p.type === type);
  return foundBottom ? foundBottom.label : '';
}
onPolicyLabelChange(event: Event, policy: { label: string; name: string; type: string }) {
  const input = event.target as HTMLInputElement;
  // take first character, uppercase it
  policy.label = input.value.toUpperCase().slice(0, 1);
}

get paddedBottomLabeledPolicies() {
  const padded = [...this.bottomLabeledPolicies];
  while (padded.length < 6) {
    padded.push({ label: '', name: '', type: '' }); // ✅ provide all required properties
  }
  return padded.slice(0, 6);
}

originalLabel(policy: { label: string; name: string; type: string }): string {
  return policy.label;
}

trackByIndex(index: number, item: any): number {
    return index;
  }

  /** Capture the user’s keystroke, uppercase it, and write it into bottomLabeledPolicies */
  onPolicyLabelChanges(event: Event, idx: number) {
    const raw = (event.target as HTMLInputElement).value
                    .toUpperCase()
                    .slice(0, 1);
    // If this slot already existed, update it…
    if (idx < this.bottomLabeledPolicies.length) {
      this.bottomLabeledPolicies[idx].label = raw;
    } else {
      // …otherwise insert a new one at that position
      this.bottomLabeledPolicies.splice(idx, 0, {
        label: raw,
        name: '',
        type: ''
      });
    }
  }

  //old  Ammy///
// get mtcPoliciesText(): string {
//   if (!this.mtcPolicies) return '';

//   // Filter policies with Description 'MTC'
//   const filtered = this.mtcPolicies.filter(
//     (p:any) => p?.ChildPolicies?.Description === 'MTC'
//   );

//   // Map to string lines: MTC and MTC_Deductible fields
//   return filtered.map((p:any) => {
//     const mtc = p?.ClientSummData?.[0]?.MTC || '';
//     const deductible = p?.ClientSummData?.[0]?.MTC_Refer_Breakdown || '';
//     return ` Refer Breakdown: ${deductible}`;
//   }).join('\n'); // Join with new lines for textarea
// }

trailerInterChange: any[] = [];
get mtcPoliciesText(): string {
  const lines: string[] = [];

  const filtered = this.mtcPolicies.filter(
    (p: any) => p?.ChildPolicies?.Description === 'MTC'
  );

  filtered.forEach((p: any) => {
    const mtcLimit = p?.ClientSummData?.[0]?.MTC || '';
    const deductible = p?.ClientSummData?.[0]?.MTC_Deductible || '';
    const referBreakdown = p?.ClientSummData?.[0]?.MTC_Refer_Breakdown || '';

    if (mtcLimit) {
      lines.push(`Cargo Limit: ${mtcLimit}`);
    }

    if (deductible) {
      lines.push(`Deductible: ${deductible}`);
    }

    if (referBreakdown) {
      lines.push(`Refer Breakdown: ${referBreakdown}`);
    }
  });

  this.trailerInterChange.forEach((t: any) => {
    lines.push(`Trailer Interchange: ${t.Trailer_limit}`);
    lines.push(`Trailer Deductible: ${t.Trailer_Interchange_Deductible}`);
  });

  return lines.join('\n');
}

// get fixedRows() {
//    const rowsCount = 7;
//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
//   return Array.from({ length: rowsCount }, (_, i) => {
//     const policy = this.allLabeledPolicies[i] || { issuingCompanyName: '', naic: '' };
//     return {
//       label: alphabet[i],  // A, B, C, ...
//       issuingCompanyName: policy.issuingCompanyName,
//       naic: policy.naic
//     };
//   });
// }
 
initFixedRows() {
  const rowsCount = 7;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  this.fixedRows = Array.from({ length: rowsCount }, (_, i) => {
    const policy = this.allLabeledPolicies[i] || { issuingCompanyName: '', naic: '' };
    return {
      label: alphabet[i],
      issuingCompanyName: policy.issuingCompanyName,
      naic: policy.naic
    };
  });
}



///Vehicle ///
 togglePolicySelection(data: any): void {
  
    const { MarkedPolicyID, ChildPolicyID } = data;
    
    const index = this.idPairs.findIndex(pair =>
      pair.MarkedPolicyID === MarkedPolicyID && pair.ChildPolicyID === ChildPolicyID
    );

    if (index > -1) {
      this.idPairs.splice(index, 1); // Deselect
    } else {
      this.idPairs.push({ MarkedPolicyID, ChildPolicyID }); // Select

     
    }
  }


  isSelected(data: any): boolean {
    return this.idPairs.some(
      pair => pair.MarkedPolicyID === data.MarkedPolicyID && pair.ChildPolicyID === data.ChildPolicyID
    );
  }



resetEndorsementVehicles(): void {
  this.useEndorsementVehicles = false;
  this.listOfAllVehicle = [];
  this.apiTrucks = [];
  this.trucks = [];
}

listOfEndorsements: any[] = [];
loadedPolicies = new Set<string>();

getAllEndroesemnt(data: any): void {

  const key = `${data.MarkedPolicyID}_${data.ChildPolicyID}`;

  // Skip if this policy has already been loaded
  if (this.loadedPolicies.has(key)) {
    return;
  }

  this.loadedPolicies.add(key);

  this.http.getAllDataByTwoId(
    ApiUrl.getAllEndrosementByPolicyId,
    data.MarkedPolicyID,
    data.ChildPolicyID
  ).subscribe((res: any) => {

    const endorsements = (res?.Endorsements || []).map((e: any) => ({
      ...e,
      MarkedPolicyID: data.MarkedPolicyID,
      ChildPolicyID: data.ChildPolicyID
    }));

    this.listOfEndorsements.push(...endorsements);

    console.log(this.listOfEndorsements);
  });
}



listOfAllVehicle: any[] = [];
useEndorsementVehicles = false;
vehicleMap: { [key: string]: any[] } = {};
getVehicle(data: any) {

  const key = `${data.MarkedPolicyID}_${data.ChildPolicyID}_${data.EndorsementID}`;

  this.http.getAllDataByTwoId(
    ApiUrl.submitChangeRequestForDriverAndVehicle,
    data.AccountID,
    data.EndorsementID
  ).subscribe((res: any) => {

    // Store vehicles for this endorsement
    this.vehicleMap[key] = res?.Vehicles || [];

    // Merge all selected endorsement vehicles
    this.listOfAllVehicle = Object.values(this.vehicleMap).flat();

    this.apiTrucks = this.hideTrailers
      ? this.listOfAllVehicle.filter(v => (v?.BodyType || '').toLowerCase() !== 'trailer')
      : [...this.listOfAllVehicle];

    this.mergeAndDisplayTrucks();

    console.log(this.listOfAllVehicle);
  });
}


// getAllTrucksParallel(): void {
//    this.clickedAfterSelection = true;
//   if (this.idPairs.length === 0) {
//     alert('Please select at least one policy.');
//     return;
//   }

//   this.showSpiner = true;
//   this.trucks = [];

//   const requests = this.idPairs.map(pair => {
//     const url = `https://www.the-aia.com/api/Vehicle/GetVehicleByChildandMarkedPolicyID/${pair.MarkedPolicyID}/${pair.ChildPolicyID}`;
//     return this.httpClient.get<any>(url).pipe(
//       catchError(error => {
//         console.error(`Error for policy ${pair.MarkedPolicyID}/${pair.ChildPolicyID}:`, error);
//         return of({ Vehicles: [] });
//       })
//     );
//   });

//   forkJoin(requests).subscribe((responses: any[]) => {
//     const allVehicles = responses.flatMap(res =>
//       Array.isArray(res.Vehicles) ? res.Vehicles : []
//     );

//     this.apiTrucks = this.hideTrailers
//       ? allVehicles.filter(v => (v?.BodyType || '').toLowerCase() !== 'trailer')
//       : allVehicles;

//     console.log('Fetched trucks (from API):', this.apiTrucks.length);

//     this.mergeAndDisplayTrucks(); 
//     this.showSpiner = false;

//     if (this.apiTrucks.length === 0) {
//       alert('No vehicles found.');
//     }
//   });


// }

getAllTrucksParallel(): void {
  this.clickedAfterSelection = true;

  if (this.idPairs.length === 0) {
    alert('Please select at least one policy.');
    return;
  }

  this.showSpiner = true;
  this.trucks = [];

  // If endorsement vehicles are already loaded, show only those
  if (this.useEndorsementVehicles && this.listOfAllVehicle.length > 0) {

    this.apiTrucks = this.hideTrailers
      ? this.listOfAllVehicle.filter(v => (v?.BodyType || '').toLowerCase() !== 'trailer')
      : [...this.listOfAllVehicle];

    this.mergeAndDisplayTrucks();
    this.showSpiner = false;
    return;
  }

  const requests = this.idPairs.map(pair => {
    const url = `https://www.the-aia.com/api/Vehicle/GetVehicleByChildandMarkedPolicyID/${pair.MarkedPolicyID}/${pair.ChildPolicyID}`;

    return this.httpClient.get<any>(url).pipe(
      catchError(error => {
        console.error(`Error for policy ${pair.MarkedPolicyID}/${pair.ChildPolicyID}:`, error);
        return of({ Vehicles: [] });
      })
    );
  });

  forkJoin(requests).subscribe((responses: any[]) => {

    const allVehicles = responses.flatMap(res =>
      Array.isArray(res.Vehicles) ? res.Vehicles : []
    );

    this.apiTrucks = this.hideTrailers
      ? allVehicles.filter(v => (v?.BodyType || '').toLowerCase() !== 'trailer')
      : allVehicles;

    console.log('Fetched trucks (from API):', this.apiTrucks.length);

    this.mergeAndDisplayTrucks();
    this.showSpiner = false;

    if (this.apiTrucks.length === 0) {
      alert('No vehicles found.');
    }
  });
}
getHolderDetails() {
  this.http.getAllDataId(ApiUrl.getFakeVehicleByHolderId, this.holderId).pipe(
    timeout(35000),
    catchError(error => {
      if (error.name === 'TimeoutError') {
        alert('Internet is slow, please wait or check your connection.');
      } else {
        this.toastr.error('Something went wrong, please try again.', '', { timeOut: 3000 });
      }
      return throwError(() => error);
    })
  ).subscribe(data => {
    this.showSpiner = false;
    const obj = JSON.parse(JSON.stringify(data));
    this.holderTrucks = obj.Holding_Vehicles || [];

    console.log('Fetched trucks (from Holder):', this.holderTrucks.length);

    this.mergeAndDisplayTrucks(); // ✅ Final merge here
  });
}
mergeAndDisplayTrucks(): void {
  console.log('API Trucks:', this.apiTrucks.length);
  console.log('Holder Trucks:', this.holderTrucks.length);

  const combined = [...this.apiTrucks, ...this.holderTrucks];

  const uniqueTrucks = Array.from(
    new Map(
      combined.map(t => {
        // Normalize VIN + fallback
        const cleanVin = (t.VIN || '').trim().toUpperCase() || 'NOVIN';
        const cleanType = (t.Type || t.BodyType || '').trim().toUpperCase() || 'NOTYPE';
        const cleanId = t.Id || t.VehicleID || 'NOID';
        const key = `${cleanVin}_${cleanType}_${cleanId}`;

        console.log('Vehicle Key:', key);
        return [key, t];
      })
    ).values()
  );

  this.trucks = uniqueTrucks;

  console.log(`✅ Final truck count after deduplication: ${this.trucks.length}`);

  this.applyTruckFilter(); // Optional trailer filter
}


applyTruckFilter(): void {
  const filtered = this.hideTrailers
    ? this.trucks.filter(t => (t?.BodyType || t?.Type || '').toLowerCase() !== 'trailer')
    : this.trucks;

  this.trucks = filtered;
  this.splitTrucksIntoPages(); 
  this.cdr.detectChanges(); 
}

onHideTrailerToggle(): void {
  this.applyTruckFilter(); // Just re-filter for display
}




splitTrucksIntoPages(): void {
  const chunkSize = 50;
  this.pagedTrucks = [];

  for (let i = 0; i < this.trucks.length; i += chunkSize) {
    const chunk = this.trucks.slice(i, i + chunkSize);
    console.log(`Page ${this.pagedTrucks.length + 1} chunk:`, chunk);
    this.pagedTrucks.push(chunk);
      // ✅ Filter out empty pages (to avoid blank PDF pages)
  this.pagedTrucks = this.pagedTrucks.filter(page => page.length > 0);

  // ✅ Force Angular to update the view
  this.cdr.detectChanges();
  console.log('Final pagedTrucks count:', this.pagedTrucks.length);
  }
}





get emptyManualPages(): any[] {
    return Array(this.manualPageCount).fill(0);
  }


  manualText: string = '';


onManualInput(event: Event): void {
  const inputElement = event.target as HTMLElement;
  const fullText = inputElement.innerText || '';

  const linesPerPage = 50;

  // Create a hidden mirror for visual line calculation
  const mirror = document.createElement('div');
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordBreak = 'break-word';
  mirror.style.font = '16px monospace';
  mirror.style.lineHeight = '20px';
  mirror.style.width = '800px'; // match the width of .manual-note-box
  mirror.style.padding = '10px';
  mirror.style.boxSizing = 'border-box';
  document.body.appendChild(mirror);

  const words = fullText.trim().split(/\s+/);
  let currentPage = '';
  let buffer = '';
  const pages: string[] = [];

  for (let word of words) {
    const test = buffer + word + ' ';
    mirror.innerText = test;

    const lineHeight = 20;
    const lines = Math.floor(mirror.offsetHeight / lineHeight);

    if (lines > linesPerPage) {
      pages.push(currentPage.trim());
      buffer = word + ' ';
    } else {
      buffer = test;
    }

    currentPage = buffer;
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  document.body.removeChild(mirror);
  this.manualPages = pages;
}



  resetVehicleSelection(): void {
 this.clickedAfterSelection = false;
  this.idPairs = [];               // ⛔️ Unselect all policies
  this.trucks = [];                // ⛔️ Clear trucks data
  this.pagedTrucks = [];           // ⛔️ Also clear paginated trucks
  this.hideTrailers = false;       // ⛔️ Uncheck the checkbox
  this.manualText = '';            // ⛔️ Clear manual entry (if any)
  this.manualPages = [];
  this.holderTrucks = []; 

  // ✅ Optional: force UI update
  this.cdr.detectChanges();
}


}
