import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ApiUrl } from '../../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewRemkarsPolicyIdComponent } from '../../../policy/view-remkars-policy-id/view-remkars-policy-id.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@Component({
  selector: 'app-add-edit-claims',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,SpinnerComponent,NgxMatSelectSearchModule],
  templateUrl: './add-edit-claims.component.html',
  styleUrl: './add-edit-claims.component.scss',
  providers: [DatePipe]
})
export class AddEditClaimsComponent {
  addEditClaimForm!:FormGroup ;
  submit = false ;
  toggleControl = new FormControl(false);
  alertMessage =''
  listOfCombineMoveResSub:any =[];
  letListOfClaimId:any =[];
  dataResponse:any;
  errorMessage ='';
  listOfCarrier:any =[];
  ReportedTo='';
  messageSuccess = true;
  showSpiner = true;
  AccountID=''
    userPermission:any ;
    listOfPolicy:any =[];
    Risk ='';
    driverId:any
    allDriverList:any =[];
    filteredDrivers: any[] = [];
driverSearchCtrl = new FormControl('');
    trucks:any =[] ;

    filteredTrucks: any[] = [];

truckSearchCtrl = new FormControl('');
    trailers:any =[] 
    filteredTrailers: any[] = [];

trailerSearchCtrl = new FormControl('');
    driver = false
    truck  = false
    ClaimID =''
    IDs ='';
    DateReported:any;
    DateofLoss:any;
    
    LoginUserName:any;
    ClaimType ='';
    GenerateInvoice:any;
    setGenerateDateRepoted= new Date();
    setGenerateDateOfLoss= new Date();
    ShowTruckDriverTrailerDive = false
    checked = false;
    disabled = false;
    isDriverReadOnly: boolean = true;
    isTruckReadOnly: boolean = true;
    isTrailerReadOnly: boolean = true;
    spinnerForPolicyShow = false
   

  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private datepipe: DatePipe ,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService, public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditClaimsComponent>) { }

  ngOnInit(): void {
    this.userPermission = localStorage.getItem('userPermissiondetail')
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.ClaimID = this.data.ClaimID
    this.makeForm();
     this.driverSearchCtrl.valueChanges.subscribe(value => {
    this.filterDrivers(value || '');
  });
   // TRUCK SEARCH
  this.truckSearchCtrl.valueChanges.subscribe(value => {
    this.filterTrucks(value || '');
  });
  this.trailerSearchCtrl.valueChanges.subscribe(value => {
  this.filterTrailers(value || '');
})

    this.load();
    this.dateRepoted()
    this.dateOfLossRepoted()
    this.getListOfCarrier()
   
  }
dateOfLossRepoted() {
  const dte = new Date(); // Use current date-time of user's machine
  const month = String(dte.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
  const day = String(dte.getDate()).padStart(2, '0');
  const year = dte.getFullYear();

  this.DateofLoss = `${month}/${day}/${year}`;
}

dateRepoted() {
  const dte = new Date(this.setGenerateDateRepoted);
  const month = String(dte.getMonth() + 1).padStart(2, '0');  // Months are 0-based
  const day = String(dte.getDate()).padStart(2, '0');          // Use local date
  const year = dte.getFullYear();

  this.DateReported = `${month}/${day}/${year}`;
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

  onToggleChange() {
    console.log(this.checked);
  }
 

  

  // onDriverChange(event: any) {
    
  //   const selectedValue = event.target.value;
  //   this.isDriverReadOnly = selectedValue !== ""; // Read-only when a driver is selected
  //   this.addEditClaimForm.controls['Driver'].setValue(''); // Clear input field
  // }
  onDriverChange(event: any) {

  const selectedValue = event.value;

  this.isDriverReadOnly = !!selectedValue;

  this.addEditClaimForm.controls['Driver'].setValue('');
}
//   onDriverChange(event: any) {

//   const selectedValue = event.value;

//   this.isDriverReadOnly = selectedValue !== '';

//   this.addEditClaimForm.controls['Driver'].setValue('');
// }
  
  // onTruckChange(event: any) {
  //   const selectedValue = event.target.value;
  //   this.isTruckReadOnly = selectedValue !== ""; // Read-only when a truck is selected
  //   this.addEditClaimForm.controls['Truck'].setValue('');
  
  // }
  onTruckChange(event: any) {

  const selectedValue = event.value;

  console.log('Truck selected:', selectedValue);

  if (selectedValue === '' || selectedValue === null) {

    // None selected
    this.isTruckReadOnly = false;

    this.addEditClaimForm.patchValue({
      TruckID: '',
      Truck: ''
    });

  } else {

    // Truck selected
    this.isTruckReadOnly = true;

    this.addEditClaimForm.patchValue({
      Truck: ''
    });

  }
}
onTrailerChange(event: any) {

  const selectedValue = event.value;

  console.log('Trailer selected:', selectedValue);

  if (selectedValue === '' || selectedValue === null) {

    // None selected
    this.isTrailerReadOnly = false;

    this.addEditClaimForm.patchValue({
      TrailerID: null,
      Trailer: ''
    });

  } else {

    // Trailer selected
    this.isTrailerReadOnly = true;

    this.addEditClaimForm.patchValue({
      Trailer: ''
    });
  }
}
 

  changePolicyType(){
    this.spinnerForPolicyShow = true
 
    this.allDriverList =[]
    this.trailers =[];
    this.trucks =[]
    
    if(this.ClaimType =='Running'){
     
      this.listOfPolicy =[]
      this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.AccountID).subscribe(
        data=>{
        

          let respone = JSON.stringify(data)
          let obj  = JSON.parse(respone)
          this.listOfPolicy= obj.ChildPolicys ;
          this.spinnerForPolicyShow = false
          console.log('policy',this.listOfPolicy)
          
        }
      )
    }else{
     
      this.listOfPolicy =[]
      this.http.getAllDataId(ApiUrl.getAllExpirePolicyByAccountId,this.AccountID).subscribe(
        data=>{
          

          let respone = JSON.stringify(data)
          let obj  = JSON.parse(respone)
          this.listOfPolicy= obj.ChildPolicys ;
          this.spinnerForPolicyShow = false
          console.log('policy',this.listOfPolicy)
          
        }
      )
    }

  }

  getListOfCarrier(){
    this.http.getAllData(ApiUrl.getAllCarrier).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfCarrier = obj.Carrier;
        
       
       
        
      })

  }
  





  ChildPolicyID =''
  MarkedPolicyId ='';
  getMarkedPolicyId(data:any){
    this.MarkedPolicyId = data.MarkedPolicyID;
    this.ChildPolicyID = data.ChildPolicyID;
    this.ReportedTo = data.IssuingCompanyName
    
    this.getAllDriverList()
    this.getAllTruck();
    this.getAllTrailer()
  }

  


// getAllDriverList(){
//   this.allDriverList =[]
//   this.MarkedPolicyId
//   this.ChildPolicyID ;
 
//   this.http.getAllDataByTwoId(ApiUrl.getALLClaimDriver,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
//     data=>{
      
//       let response  = JSON.stringify(data)
//       let obj = JSON.parse(response)
//      this.allDriverList = obj.Drivers;
//      this.showSpiner  = false ;
//      this.allDriverList.sort((a:any, b:any) => {
//   const nameA = a.DriverName?.toLowerCase() || '';
//   const nameB = b.DriverName?.toLowerCase() || '';
//   return nameA.localeCompare(nameB);
// });

//     }
//   )
// }


getAllDriverList() {

  this.allDriverList = [];
  this.filteredDrivers = [];

  this.http.getAllDataByTwoId(
    ApiUrl.getALLClaimDriver,
    this.MarkedPolicyId,
    this.ChildPolicyID
  ).subscribe(
    data => {

      let response = JSON.stringify(data);
      let obj = JSON.parse(response);

      this.allDriverList = obj.Drivers || [];

      // Sort Driver Name A-Z
      this.allDriverList.sort((a: any, b: any) => {

        const nameA = String(a.DriverName || '').toLowerCase();
        const nameB = String(b.DriverName || '').toLowerCase();

        return nameA.localeCompare(nameB);
      });

      // Initially show all drivers
      this.filteredDrivers = [...this.allDriverList];

      this.showSpiner = false;

    }
  );
}
filterDrivers(searchValue: string = '') {

  const search = searchValue
    .trim()
    .toLowerCase();

  // Empty search
  if (!search) {

    this.filteredDrivers = [...this.allDriverList];

    return;
  }

  // Search Driver Name / Licence / Driver ID
  this.filteredDrivers = this.allDriverList
    .filter((data: any) => {

      const driverName =
        String(data.DriverName || '').toLowerCase();

      const licenceNo =
        String(data.DriverLicenceNo || '').toLowerCase();

      const driverID =
        String(data.DriverID || '').toLowerCase();

      return (
        driverName.includes(search) ||
        licenceNo.includes(search) ||
        driverID.includes(search)
      );
    })
    .sort((a: any, b: any) => {

      const nameA =
        String(a.DriverName || '').toLowerCase();

      const nameB =
        String(b.DriverName || '').toLowerCase();

      // Matching name comes first
      if (nameA.startsWith(search) && !nameB.startsWith(search)) {
        return -1;
      }

      if (!nameA.startsWith(search) && nameB.startsWith(search)) {
        return 1;
      }

      return nameA.localeCompare(nameB);
    });
}

getAllTruck(){
  this.trucks =[]
  this.MarkedPolicyId
  this.ChildPolicyID

  this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
    
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.trucks = obj.Vehicles;
     this.trucks.sort((a:any, b:any) => {
  const vinA = a.VIN?.slice(-4) || '';
  const vinB = b.VIN?.slice(-4) || '';
  return vinA.localeCompare(vinB);
});
this.filteredTrucks = [...this.trucks];
     this.showSpiner  = false ;

    }
  )
}

filterTrucks(searchValue: string = '') {

  const search = searchValue
    .trim()
    .toLowerCase();

  // Empty search
  if (!search) {
    this.filteredTrucks = [...this.trucks];
    return;
  }

  this.filteredTrucks = this.trucks
    .filter((data: any) => {

      const vin =
        String(data.VIN || '').toLowerCase();

      const vehicleName =
        String(data.VehicleName || '').toLowerCase();

      const make =
        String(data.Make || '').toLowerCase();

      const model =
        String(data.Model || '').toLowerCase();

      const year =
        String(data.Year || '').toLowerCase();

      const truckId =
        String(data.TruckID || '').toLowerCase();

      return (
        vin.includes(search) ||
        vehicleName.includes(search) ||
        make.includes(search) ||
        model.includes(search) ||
        year.includes(search) ||
        truckId.includes(search)
      );
    })
    .sort((a: any, b: any) => {

      const vinA = String(a.VIN || '').toLowerCase();
      const vinB = String(b.VIN || '').toLowerCase();

      // Matching VIN first
      if (
        vinA.startsWith(search) &&
        !vinB.startsWith(search)
      ) {
        return -1;
      }

      if (
        !vinA.startsWith(search) &&
        vinB.startsWith(search)
      ) {
        return 1;
      }

      return vinA.localeCompare(vinB);
    });
}


// getAllTrailer() {

//   this.trailers = [];
//   this.filteredTrailers = [];

//   this.http.getAllDataByTwoId(
//     ApiUrl.getAllClaimVehicle,
//     this.MarkedPolicyId,
//     this.ChildPolicyID
//   ).subscribe(data => {

//     const response = JSON.stringify(data);
//     const obj = JSON.parse(response);

//     // ONLY TRAILERS
//     this.trailers = (obj.Vehicles || [])
//       .filter((x: any) => x.BodyType === 'Trailer');

//     // Sort by last 4 VIN
//     this.trailers.sort((a: any, b: any) => {

//       const vinA = String(a.VIN || '').slice(-4);
//       const vinB = String(b.VIN || '').slice(-4);

//       return vinA.localeCompare(vinB);
//     });

//     // Initially show all trailers
//     this.filteredTrailers = [...this.trailers];

//     console.log('Trailers:', this.trailers);

//     this.showSpiner = false;
//   });
// }
// filterTrailers(searchValue: string = '') {

//   const search = searchValue.trim().toLowerCase();

//   // Empty search
//   if (!search) {
//     this.filteredTrailers = [...this.trailers];
//     return;
//   }

//   this.filteredTrailers = this.trailers
//     .filter((data: any) => {

//       // Only Trailer
//       if (data.BodyType !== 'Trailer') {
//         return false;
//       }

//       const vin =
//         String(data.VIN || '').toLowerCase();

//       const model =
//         String(data.Model || '').toLowerCase();

//       const vehicleID =
//         String(data.VehicleID || '').toLowerCase();

//       const bodyType =
//         String(data.BodyType || '').toLowerCase();

//       const vehicleName =
//         String(data.VehicleName || '').toLowerCase();

//       return (
//         vin.includes(search) ||
//         model.includes(search) ||
//         vehicleID.includes(search) ||
//         bodyType.includes(search) ||
//         vehicleName.includes(search)
//       );
//     })
//     .sort((a: any, b: any) => {

//       const vinA =
//         String(a.VIN || '').toLowerCase();

//       const vinB =
//         String(b.VIN || '').toLowerCase();

//       // Matching VIN first
//       if (
//         vinA.startsWith(search) &&
//         !vinB.startsWith(search)
//       ) {
//         return -1;
//       }

//       if (
//         !vinA.startsWith(search) &&
//         vinB.startsWith(search)
//       ) {
//         return 1;
//       }

//       return vinA.localeCompare(vinB);
//     });
// }



getAllTrailer() {

  this.trailers = [];
  this.filteredTrailers = [];

  this.http.getAllDataByTwoId(
    ApiUrl.getAllClaimVehicle,
    this.MarkedPolicyId,
    this.ChildPolicyID
  ).subscribe(data => {

    const response = JSON.stringify(data);
    const obj = JSON.parse(response);

    // Trailer + Dry trailer + Reefer trailer
    this.trailers = (obj.Vehicles || [])
      .filter((x: any) => {

        const bodyType = String(x.BodyType || '')
          .trim()
          .toLowerCase();

        return (
          bodyType === 'trailer' ||
          bodyType === 'dry trailer' ||
          bodyType === 'reefer trailer'
        );
      });

    // Sort by last 4 VIN
    this.trailers.sort((a: any, b: any) => {

      const vinA = String(a.VIN || '').slice(-4);
      const vinB = String(b.VIN || '').slice(-4);

      return vinA.localeCompare(vinB);
    });

    // Initially show all trailers
    this.filteredTrailers = [...this.trailers];

    console.log('Trailers:', this.trailers);

    this.showSpiner = false;
  });
}


filterTrailers(searchValue: string = '') {

  const search = searchValue.trim().toLowerCase();

  // Empty search
  if (!search) {
    this.filteredTrailers = [...this.trailers];
    return;
  }

  this.filteredTrailers = this.trailers
    .filter((data: any) => {

      // Trailer + Dry trailer + Reefer trailer
      const bodyTypeCheck = String(data.BodyType || '')
        .trim()
        .toLowerCase();

      if (
        bodyTypeCheck !== 'trailer' &&
        bodyTypeCheck !== 'dry trailer' &&
        bodyTypeCheck !== 'reefer trailer'
      ) {
        return false;
      }

      const vin =
        String(data.VIN || '').toLowerCase();

      const model =
        String(data.Model || '').toLowerCase();

      const vehicleID =
        String(data.VehicleID || '').toLowerCase();

      const bodyType =
        String(data.BodyType || '').toLowerCase();

      const vehicleName =
        String(data.VehicleName || '').toLowerCase();

      return (
        vin.includes(search) ||
        model.includes(search) ||
        vehicleID.includes(search) ||
        bodyType.includes(search) ||
        vehicleName.includes(search)
      );
    })
    .sort((a: any, b: any) => {

      const vinA =
        String(a.VIN || '').toLowerCase();

      const vinB =
        String(b.VIN || '').toLowerCase();

      // Matching VIN first
      if (
        vinA.startsWith(search) &&
        !vinB.startsWith(search)
      ) {
        return -1;
      }

      if (
        !vinA.startsWith(search) &&
        vinB.startsWith(search)
      ) {
        return 1;
      }

      return vinA.localeCompare(vinB);
    });
}
load(){
  let data = this.data ;
  
  
  this.ClaimID = data.ClaimID ;

  

  if(this.ClaimID == undefined) {

  }
 else {
  this.showSpiner = false
  this.http.getAllDataId(ApiUrl.geAllClaimByClaimId,this.ClaimID).subscribe(
    data=>{
      let response  = JSON.stringify(data)
      let obj  = JSON.parse(response)
     this.letListOfClaimId = obj.Claims;

const claim = this.letListOfClaimId[0];

this.addEditClaimForm.controls['ClaimID'].setValue(claim.ClaimID);
this.addEditClaimForm.controls['AccountID'].setValue(claim.AccountID);
this.addEditClaimForm.controls['ChildPolicyID'].setValue(claim.ChildPolicyID);
this.addEditClaimForm.controls['MarkedPolicyID'].setValue(claim.MarkedPolicyID);
      
      
    

     
      this.addEditClaimForm.controls['ClaimDescription'].setValue(this.letListOfClaimId[0].ClaimDescription)
      this.addEditClaimForm.controls['ClaimType'].setValue(this.letListOfClaimId[0].ClaimType)
       let claimType =this.letListOfClaimId[0].ClaimType ;

      if(claimType =='Running'){
        this.showSpiner = false
        this.http.getAllDataId(ApiUrl.getAllPolicyByAccounrId,this.AccountID).subscribe(
          data=>{
           
            let respone = JSON.stringify(data)
            let obj  = JSON.parse(respone)
            this.listOfPolicy= obj.ChildPolicys ;
            this.showSpiner = false
            console.log('policy',this.listOfPolicy)
            
          }
        )
      }else{
        this.showSpiner = false
        this.http.getAllDataId(ApiUrl.getAllExpirePolicyByAccountId,this.AccountID).subscribe(
          data=>{

            let respone = JSON.stringify(data)
            let obj  = JSON.parse(respone)
            this.listOfPolicy= obj.ChildPolicys ;
            this.showSpiner = false
            console.log('policy',this.listOfPolicy)
            
          }
        )
      }
     
      // this.ARDue = new Date(this.ARDue)
      this.DateReported = this.letListOfClaimId[0].DateReported
      

      
      this.addEditClaimForm.controls['DateReported'].setValue(this.datepipe.transform(this.DateReported, 'MM/dd/yyyy'));
    
    
      
  
console.log("DateofLoss",this.letListOfClaimId[0].DateofLoss);
const date = new Date(this.letListOfClaimId[0].DateofLoss);

this.addEditClaimForm.controls['DateofLoss'].setValue(
  this.datepipe.transform(date, 'MM/dd/yyyy hh:mm a')
);
     
      
      
    
      this.addEditClaimForm.controls['ReportedBy'].setValue(this.letListOfClaimId[0].ReportedBy)
      this.addEditClaimForm.controls['ClaimNumber'].setValue(this.letListOfClaimId[0].ClaimNumber)
      
      this.addEditClaimForm.controls['InformationReceivedBy'].setValue(this.letListOfClaimId[0].InformationReceivedBy)
     
      this.addEditClaimForm.controls['ReportedTo'].setValue(this.letListOfClaimId[0].ReportedTo)
      this.addEditClaimForm.controls['IDs'].setValue(this.letListOfClaimId[0].IDs)
      this.IDs = this.letListOfClaimId[0].IDs
      this.addEditClaimForm.controls['ServiceSummary'].setValue(this.letListOfClaimId[0].ServiceSummary)
      
     
      
      
      let markedPolcyId =this.letListOfClaimId[0].MarkedPolicyID;
      let ChildPolicyID =this.letListOfClaimId[0].ChildPolicyID;
      this.http.getAllDataByTwoId(ApiUrl.getALLClaimDriver,markedPolcyId,ChildPolicyID).subscribe(
        data=>{
          this.showSpiner  = false ;
          let response  = JSON.stringify(data)
          let obj = JSON.parse(response)
         this.allDriverList = obj.Drivers
    
        }
      )
      this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle,markedPolcyId,ChildPolicyID).subscribe(
        data=>{
          this.showSpiner  = false ;
          let response  = JSON.stringify(data)
          let obj = JSON.parse(response)
         this.trucks = obj.Vehicles
    
        }
      )
    
      this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle,markedPolcyId,ChildPolicyID).subscribe(
        data=>{
          this.showSpiner  = false ;
          let response  = JSON.stringify(data)
          let obj = JSON.parse(response)
         this.trailers = obj.Vehicles

        }
      )


      if(this.letListOfClaimId[0].DriverID == null){
        this.addEditClaimForm.controls['Driver'].setValue(this.letListOfClaimId[0].Driver)
      }else{
        this.addEditClaimForm.controls['DriverID'].setValue(this.letListOfClaimId[0].DriverID)
      }
    

this.MarkedPolicyId = claim.MarkedPolicyID;
this.ChildPolicyID = claim.ChildPolicyID;

// Load drivers first
this.http.getAllDataByTwoId(
  ApiUrl.getALLClaimDriver,
  this.MarkedPolicyId,
  this.ChildPolicyID
).subscribe(data => {

  const response = JSON.stringify(data);
  const obj = JSON.parse(response);

  this.allDriverList = obj.Drivers || [];

  // Sort
  this.allDriverList.sort((a: any, b: any) => {
    const nameA = String(a.DriverName || '').toLowerCase();
    const nameB = String(b.DriverName || '').toLowerCase();

    return nameA.localeCompare(nameB);
  });

  // IMPORTANT
  this.filteredDrivers = [...this.allDriverList];

  // =========================
  // SET EDIT DRIVER
  // =========================

  if (claim.DriverID != null && claim.DriverID !== '') {

    // Driver selected from dropdown
    this.addEditClaimForm.patchValue({
      DriverID: claim.DriverID,
      Driver: ''
    });

    this.isDriverReadOnly = true;

  } else {

    // Manual driver
    this.addEditClaimForm.patchValue({
      DriverID: '',
      Driver: claim.Driver || ''
    });

    this.isDriverReadOnly = false;
  }

});
      if(this.letListOfClaimId[0].TruckID == null){
        this.addEditClaimForm.controls['Truck'].setValue(this.letListOfClaimId[0].Truck)
      }else{
        this.addEditClaimForm.controls['TruckID'].setValue(this.letListOfClaimId[0].TruckID)
      }
      this.http.getAllDataByTwoId(
  ApiUrl.getAllClaimVehicle,
  markedPolcyId,
  ChildPolicyID
).subscribe(data => {

  const response = JSON.stringify(data);
  const obj = JSON.parse(response);

  this.trucks = (obj.Vehicles || [])
    .filter((x: any) => x.BodyType !== 'Trailer');

  this.trucks.sort((a: any, b: any) => {

    const vinA = String(a.VIN || '').slice(-4);
    const vinB = String(b.VIN || '').slice(-4);

    return vinA.localeCompare(vinB);
  });

  this.filteredTrucks = [...this.trucks];

  // IMPORTANT: set existing Truck after list is loaded
  const claim = this.letListOfClaimId[0];

  if (claim.TruckID == null || claim.TruckID === '') {

    this.addEditClaimForm.patchValue({
      TruckID: null,
      Truck: claim.Truck || ''
    });

    this.isTruckReadOnly = true;

  } else {

    this.addEditClaimForm.patchValue({
      TruckID: claim.TruckID,
      Truck: ''
    });

    this.isTruckReadOnly = true;

  }

  this.showSpiner = false;
});
    
      if(this.letListOfClaimId[0].TrailerID == null){
        this.addEditClaimForm.controls['Trailer'].setValue(this.letListOfClaimId[0].Trailer)
      }else{
        this.addEditClaimForm.controls['TrailerID'].setValue(this.letListOfClaimId[0].TrailerID)
      }
    
      

this.http.getAllDataByTwoId(
  ApiUrl.getAllClaimVehicle,
  claim.MarkedPolicyID,
  claim.ChildPolicyID
).subscribe(data => {

  const response = JSON.stringify(data);
  const obj = JSON.parse(response);

  // ONLY TRAILERS
  this.trailers = (obj.Vehicles || [])
    .filter((x: any) => x.BodyType === 'Trailer');

  // Sort
  this.trailers.sort((a: any, b: any) => {

    const vinA = String(a.VIN || '').slice(-4);
    const vinB = String(b.VIN || '').slice(-4);

    return vinA.localeCompare(vinB);
  });

  this.filteredTrailers = [...this.trailers];

  // =========================
  // SET EDIT TRAILER
  // =========================

  if (
    claim.TrailerID != null &&
    claim.TrailerID !== ''
  ) {

    // Trailer selected from dropdown
    this.addEditClaimForm.patchValue({
      TrailerID: claim.TrailerID,
      Trailer: ''
    });

    this.isTrailerReadOnly = true;

  } else {

    // Manual / unreported trailer
    this.addEditClaimForm.patchValue({
      TrailerID: null,
      Trailer: claim.Trailer || ''
    });

    this.isTrailerReadOnly = false;
  }

  this.showSpiner = false;

});
      
      
      this.addEditClaimForm.controls['UpdatedBy'].setValue(this.LoginUserName)
      this.MarkedPolicyId =this.letListOfClaimId[0].MarkedPolicyID;
      this.ChildPolicyID =this.letListOfClaimId[0].ChildPolicyID;

    }
    
  )
 
 
 }
 
}
private getUsCurrentDateTime(): string {
  const now = new Date();

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', // USA Eastern Time
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now);
}
makeForm(){
 
  this.addEditClaimForm = this.fb.group({
    ClaimID:['0'],
    AccountID:[this.AccountID ,[Validators.required,]],
    MarkedPolicyID:['',[Validators.required,]],
    ChildPolicyID:['',[Validators.required,]],
    DateofLoss:[this.getUsCurrentDateTime()],
    DateReported:[''],
    ReportedBy:[''],
    ReportedTo:[''],
    ClaimType:[''],
    ClaimNumber:[''],
    ClaimDescription:[''],
    EstimateAmount:[''],
    DriverID:[''],
    TruckID:[''],
    TrailerID:[''],
    Driver:[''],
    Truck:[''],
    Trailer:[''],
    IDs:[''],
    ServiceSummary:[''],
    InformationReceivedBy:[''],
    Risk:[''],
    
    EnteredBy:[this.LoginUserName],
    UpdatedBy:['']
    
  });
}

onSubmit() {
 
  this.submit = true ; 
 this.messageSuccess = false
  if(!this.addEditClaimForm.valid){
    this.messageSuccess = true
    return
  }

 let obj = JSON.parse(JSON.stringify(this.addEditClaimForm.value))

 if(this.ClaimID){
  obj['ClaimID'] = this.ClaimID
}

  this.http.addEditData(ApiUrl.addEditClaim,obj).pipe().subscribe(
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


rowClicked:any
changeTableRowColor(idx: any) { 
  if(this.rowClicked === idx) this.rowClicked = -1;
  else this.rowClicked = idx;
}

showSuccess() {
  this.toastr.success(this.alertMessage, '' ,{
    timeOut: 3000,
  });
  this.changeLocation()
} 

error() {
  this.toastr.error(this.errorMessage, '' ,{
    timeOut: 3000,
  });
  this.changeLocation()
}
get f() {
  return this.addEditClaimForm.controls;
  
}


viewRemkarsByChiledPolciy(event: MouseEvent,data:any){
  this.dialog.open(ViewRemkarsPolicyIdComponent ,{
    width: '880px',
    height:'700px',
   data: {ChildPolicyID:data.ChildPolicyID,}
  });
  
}
onNoClick1(): void {
  this.dialogRef.close();
 
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
