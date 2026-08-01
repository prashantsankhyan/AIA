import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';


@Component({
  selector: 'app-add-edit-claim',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,SpinnerComponent],
  templateUrl: './add-edit-claim.component.html',
  styleUrl: './add-edit-claim.component.scss',
  providers: [DatePipe]
})
export class AddEditClaimComponent {
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
    allDriverList:any =[]
    trucks:any =[] 
    trailers:any =[] 
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
  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private datepipe: DatePipe ,private http:AllApiService,private cRouter:ActivatedRoute,private router:Router,private toastr: ToastrService, public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditClaimComponent>) { }

  ngOnInit(): void {
    this.userPermission = localStorage.getItem('userPermissiondetail')
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.ClaimID = this.data.ClaimID
    this.makeForm();
    this.load();
    this.dateRepoted()
    this.dateOfLossRepoted()
    this.getListOfCarrier()
  }
  dateOfLossRepoted(){
    let dte = new Date(this.setGenerateDateOfLoss)
    var month = dte.getUTCMonth() + 1; //months from 1-12
    var day = dte.getUTCDate() + 1;
    var year = dte.getUTCFullYear() ;
    this.DateofLoss  =month + "/" + day + "/" + year
     
  }

  dateRepoted(){
    let dte = new Date(this.setGenerateDateRepoted)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate() + 1;
     var year = dte.getUTCFullYear() ;
    
     this.DateReported  =month + "/" + day + "/" + year
     
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


  changePolicyType(){
    this.showSpiner = true
    this.allDriverList =[]
    this.trailers =[];
    this.trucks =[]
    
    if(this.ClaimType =='Running'){
      this.showSpiner = false
      this.listOfPolicy =[]
      this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.AccountID).subscribe(
        data=>{
         
          let respone = JSON.stringify(data)
          let obj  = JSON.parse(respone)
          this.listOfPolicy= obj.ChildPolicys ;
          this.showSpiner = false
          console.log('policy',this.listOfPolicy)
          
        }
      )
    }else{
      this.showSpiner = false ;
      this.listOfPolicy =[]
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
    this.ChildPolicyID = data.ChildPolicyID
    this.getAllDriverList()
    this.getAllTruck();
    this.getAllTrailer()
  }











getAllDriverList(){
  this.allDriverList =[]
  this.MarkedPolicyId
  this.ChildPolicyID ;
 
  this.http.getAllDataByTwoId(ApiUrl.getALLClaimDriver,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
      
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.allDriverList = obj.Drivers;
     this.showSpiner  = false ;

    }
  )
}


getAllTruck(){
  this.trucks =[]
  this.MarkedPolicyId
  this.ChildPolicyID

  this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
    
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.trucks = obj.Vehicles
     this.showSpiner  = false ;

    }
  )
}



getAllTrailer(){
  this.trailers =[]
  this.MarkedPolicyId
  this.ChildPolicyID

  this.http.getAllDataByTwoId(ApiUrl.getAllClaimVehicle,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
    data=>{
     
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response)
     this.trailers = obj.Vehicles
    console.log(this.trailers)
     this.showSpiner  = false ;

    }
  )
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
      this.letListOfClaimId = obj.Claims
      this.addEditClaimForm.controls['ClaimID'].setValue(this.letListOfClaimId[0].ClaimID)
      this.addEditClaimForm.controls['AccountID'].setValue(this.letListOfClaimId[0].AccountID)
      this.addEditClaimForm.controls['ChildPolicyID'].setValue(this.letListOfClaimId[0].ChildPolicyID)
      this.addEditClaimForm.controls['MarkedPolicyID'].setValue(this.letListOfClaimId[0].MarkedPolicyID);
      

    

     
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
       this.DateReported = new Date(this.DateReported)

      this.addEditClaimForm.controls['DateReported'].setValue(this.DateReported)
      this.DateofLoss =this.letListOfClaimId[0].DateofLoss
      this.DateofLoss = new Date(this.DateofLoss)
      this.addEditClaimForm.controls['DateofLoss'].setValue(this.DateofLoss)
      
      this.addEditClaimForm.controls['EstimateAmount'].setValue(this.letListOfClaimId[0].EstimateAmount)
     
      
      
    
      this.addEditClaimForm.controls['ReportedBy'].setValue(this.letListOfClaimId[0].ReportedBy)
     
    
     
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
      if(this.letListOfClaimId[0].TruckID == null){
        this.addEditClaimForm.controls['Truck'].setValue(this.letListOfClaimId[0].Truck)
      }else{
        this.addEditClaimForm.controls['TruckID'].setValue(this.letListOfClaimId[0].TruckID)
      }
    
      if(this.letListOfClaimId[0].TrailerID == null){
        this.addEditClaimForm.controls['Trailer'].setValue(this.letListOfClaimId[0].Trailer)
      }else{
        this.addEditClaimForm.controls['TrailerID'].setValue(this.letListOfClaimId[0].TrailerID)
      }
    
      
      
      this.addEditClaimForm.controls['UpdatedBy'].setValue(this.LoginUserName)
      this.MarkedPolicyId =this.letListOfClaimId[0].MarkedPolicyID;
      this.ChildPolicyID =this.letListOfClaimId[0].ChildPolicyID;

    }
    
  )
 
 
 }
 
}

makeForm(){
 
  this.addEditClaimForm = this.fb.group({
    ClaimID:['0'],
    AccountID:[this.AccountID ,[Validators.required,]],
    MarkedPolicyID:['',[Validators.required,]],
    ChildPolicyID:['',[Validators.required,]],
    DateofLoss:[''],
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
