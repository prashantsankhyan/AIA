import { CommonModule, DatePipe } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-renew-policy',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './renew-policy.component.html',
  styleUrl: './renew-policy.component.scss',
  providers: [DatePipe]
})
export class RenewPolicyComponent {
  addEditPolicyForm!:FormGroup ;
  submit = false ;
  MarkedPolicyID ='' ;
  ID ='' ;
  accountName ='' ;
  shorNameData:any =[]
  alertMessage =''
  SubmitType ='PPE';
  PremiumPayable ='';
  SelectPayable ='';
  SubmissionStatus ="";
  getAllListOfPremiumPaybale:any =[];
  getAllListOfPremiumPaybaleById:any =[];
  PremiumPayableID ='';
  SelectPayableID ='';
  LineShortName:any;
  getAllPremiumPaybale:any=[];
  messageSuccess = true;
  userPermission:any;
  Effective:any
  Expiration = '';
  AccountID:any;
  upExpiration :any;
  listOfMarkedPolicyById:any =[];
  CarrierSubmissionID:string ='';
  getAllLineName:any =[];
  markedPolicyID ='';
  LoginUserName:any;
  LineID ='';
  SubPolicy ='';
  SubPolicyLineName:any
  LineName:any;
  listOfBroker:any =[];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private datepipe: DatePipe  ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<RenewPolicyComponent>){}

  ngOnInit(): void {
    this.LoginUserName = sessionStorage.getItem('UserName');
    this.data;
    this.LineName = this.data.LineName
     this.LineShortName = this.data.LineShortName;

     this.getAllBrker()
     this.getAllCarrier()
    this.makeForm();
    this.getAllLineOfName()
    this.load();
  }
  getAllBrker(){
    this.http.getAllData(ApiUrl.getAllBroker).subscribe(
      data=>{
        
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfBroker = obj.Brokers ;
      
      }
    )   
  }



  getSubPolicyName(){
    
    this.http.getAllDataId(ApiUrl.getLineNameForSubPolicy,this.LineID).subscribe(data=>{
      let respone = JSON.stringify(data)
      let obj = JSON.parse(respone)
      this.shorNameData = obj.LineNames;
      this.SubPolicy = obj.LineNames[0].LineCode;
      
    })

  }

  

   
  load(){
    this.data
    this.ID = this.data.ChildPolicyID
 
    if(this.ID == undefined) {

   }
   else {
    this.SubmitType ='';
    
    this.http.getAllDataId(ApiUrl.getPolicyBuChildPolcyId,this.ID).subscribe(data=>{
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
      this.listOfMarkedPolicyById = obj.ChildPolicys;  
      this.PremiumPayableID = obj.ChildPolicys.PremiumPayableID;
    
      this.addEditPolicyForm.controls['ChildPolicyID'].setValue(this.listOfMarkedPolicyById[0].ChildPolicyID);
      this.addEditPolicyForm.controls['AccountID'].setValue(this.listOfMarkedPolicyById[0].AccountID)
      this.addEditPolicyForm.controls['MarkedPolicyID'].setValue(this.listOfMarkedPolicyById[0].MarkedPolicyID)

      
      this.addEditPolicyForm.controls['CarrierSubmissionID'].setValue(this.listOfMarkedPolicyById[0].CarrierSubmissionID)
      this.SubmitType = this.listOfMarkedPolicyById[0].SubmitType
      this.addEditPolicyForm.controls['SubmitType'].setValue(this.SubmitType)
      this.Effective =this.listOfMarkedPolicyById[0].Effective;
      
     
      this.upExpiration = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Expiration), 'MM/dd/yyyy')
      this.addEditPolicyForm.controls['SubPolicy'].setValue(this.listOfMarkedPolicyById[0].SubPolicy)
      this.addEditPolicyForm.controls['Effective'].setValue(this.upExpiration)
     
    let dte = new Date(this.upExpiration)
     var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() +1;
    
     let newdate  =month + "/" + day + "/" + year
     this.Expiration = newdate
     this.addEditPolicyForm.controls['Expiration'].setValue(this.Expiration,'MM/dd/yyyy')
      this.addEditPolicyForm.controls['Type'].setValue(this.listOfMarkedPolicyById[0].Type)
      this.addEditPolicyForm.controls['LineID'].setValue(this.listOfMarkedPolicyById[0].LineID)

      
      this.addEditPolicyForm.controls['Description'].setValue(this.listOfMarkedPolicyById[0].Description)
      this.addEditPolicyForm.controls['ChildPolicyName'].setValue(this.listOfMarkedPolicyById[0].ChildPolicyName)
      this.addEditPolicyForm.controls['Description'].setValue(this.listOfMarkedPolicyById[0].Description)
      this.addEditPolicyForm.controls['Source'].setValue(this.listOfMarkedPolicyById[0].Source)
      this.addEditPolicyForm.controls['BrokerID'].setValue(this.listOfMarkedPolicyById[0].BrokerID)
      let PremiumPayableID = this.listOfMarkedPolicyById[0].PremiumPayableID
    
      this.addEditPolicyForm.controls['PremiumPayableID'].setValue(PremiumPayableID)
      let SelectPayableID = this.listOfMarkedPolicyById[0].SelectPayableID
      
      
      this.addEditPolicyForm.controls['SelectPayableID'].setValue(SelectPayableID)
      
      let IsDeleted = false;
      this.addEditPolicyForm.controls['IsDeleted'].setValue(IsDeleted)
      
     let IssuingCompany = this.listOfMarkedPolicyById[0].IssuingCompany
     
     this.addEditPolicyForm.controls['IssuingCompany'].setValue(IssuingCompany)
     this.addEditPolicyForm.controls['Policy_Status'].setValue(this.listOfMarkedPolicyById[0].Policy_Status)
     this.addEditPolicyForm.controls['BillType'].setValue(this.listOfMarkedPolicyById[0].BillType)
     this.addEditPolicyForm.controls['StageType'].setValue(this.listOfMarkedPolicyById[0].StageType)
     this.addEditPolicyForm.controls['UpdatedBy'].setValue(this.LoginUserName)

    })

  
  
  
   }
   
  }

  makeForm(){
   
    this.addEditPolicyForm = this.fb.group({
      ChildPolicyID:['0'],
      AccountID:[this.AccountID],
      CarrierSubmissionID:[this.CarrierSubmissionID],
      MarkedPolicyID:[this.markedPolicyID],
      PremiumPayableID:['',[Validators.required]],
      SelectPayableID:['',[Validators.required,]],
      ChildPolicyName:['',[Validators.required,]],
      Description:['',[Validators.required,]],
      Effective:['',[Validators.required]],
      Expiration:[''],
      IssuingCompany:[''],
      Source:[''],
      SubmitType:[''],
      Policy_Status:['New'],
      Type:[''],
      LineID:[''],
      SubPolicy:[this.LineShortName],
      BrokerID:[''],

      BillType:['',[Validators.required]],
      StageType:['',[Validators.required]],
      EnteredBy:[this.LoginUserName],
      IsDeleted:[''],
      UpdatedBy:[''],
      
      
      
    });
  }

  changeNextDate(){
    
    
  }

  listOfAllCarrier:any=[];
  getAllCarrier(){
    this.http.getAllData(ApiUrl.getAllCarrier).subscribe(
      data=>{
        let respone  = JSON.stringify(data)
        let obj  = JSON.parse(respone);
        this.listOfAllCarrier = obj.Carrier

      }
    )
  }



 

  getPremiumPayable(){
    this.http.getAllData(ApiUrl.getAllPremiumPayable).subscribe(
      data=>{
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.getAllPremiumPaybale = obj.PremiumPaybles ;
        console.log("data of All getAllListOfPremiumPaybaleById ==>", this.getAllListOfPremiumPaybaleById)
      }
    )
  }

 selectDetailOfData:any =[];
  getAllDataByPremiumPayableId(){
    
    
    this.http.getAllDataId(ApiUrl.getAllDetailByPremiumPayable,this.PremiumPayableID).subscribe(
      data=>{
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.selectDetailOfData = obj.SelectedPayable ;
        console.log("data of All getAllListOfPremiumPaybaleById ==>", this.getAllListOfPremiumPaybaleById)
      }
    )

  }

  getAllLineOfName(){
    this.http.getAllData(ApiUrl.getAllLineName).subscribe(
      data=>{
        let response  = JSON.stringify(data);
        let obj  = JSON.parse(response);
      
        this.getAllLineName = obj.LineNames
      }
    )
  }

  onSubmit() {
    this.submit = true ; 
   this.messageSuccess = false;
    if(!this.addEditPolicyForm.valid){
      this.messageSuccess= true
      
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditPolicyForm.value))

   if(this.ID){
    obj['ID'] = this.ID
  }

    this.http.addEditData(ApiUrl.renewPolicy,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        this.alertMessage =obj.ErrorMessage;
         
        if(this.alertMessage =="Existing Record Updated Successfully"){
          
          this.changeLocation();
          this.onNoClick1()
        }
        else{
          
          this.showSuccess();
          this.onNoClick1()
          console.log(obj)
        }
       
       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    // this.router.navigate(['/detailLayout/policy'])
    this.changeLocation()
   
  }
  get f() {
    return this.addEditPolicyForm.controls;
    
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
