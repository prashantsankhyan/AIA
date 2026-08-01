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
  selector: 'app-add-edit-policy',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ,NgbDatepickerModule,NgbAlertModule,],
  templateUrl: './add-edit-policy.component.html',
  styleUrl: './add-edit-policy.component.scss',
  providers: [DatePipe]
})
export class AddEditPolicyComponent {
  showSpiner = true;
  submit = false ;
  ChildPolicyID ='';
  alertMessage =''
  addEditPolicyForm!:FormGroup;
  AccountID:any;
  MarkedPolicyID ='';
  listOfMarkedPolicy:any =[];
  listOfMarkedPolicyById:any =[];
  getAllPremiumPaybale:any =[];
  PremiumPayableID ='';
  selectDetailOfData:any =[];
  listOfAllCarrier:any  =[];
  messageSuccess = true;
  setEffective = new Date(); 
  Effective:any;
  Expiration:any;
  hideHiddenData: boolean = true;
  hideDrodownOfMarketed = true;
  listOfBroker:any =[];
  LoginUserName:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private datepipe: DatePipe  ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditPolicyComponent>){}
  ngOnInit(): void {
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   

    this.LoginUserName = sessionStorage.getItem('UserName');
    this.getAllMarkedPolicy();
    this.getPremiumPayable();
    this.getAllCarrier();
    this.makeForm();
    this.load()
    this.getAllBrker()
    this.currentDate()
   
   
   }
   toggleHiddenData(): void {
    this.hideHiddenData = !this.hideHiddenData;
  }

  currentDate(){
    let dte = new Date(this.setEffective)
    var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() ;
    
     this.Effective  =month + "/" + day + "/" + year
  }
  changeNextDate(){
    this.Effective
    
    let dte = new Date(this.Effective)
     var month = dte.getUTCMonth() + 1; //months from 1-12
     var day = dte.getUTCDate();
     var year = dte.getUTCFullYear() +1;
     let newdate  =month + "/" + day + "/" + year
     this.Expiration = newdate 
  }

   getAllMarkedPolicy(){
    this.http.getAllDataId(ApiUrl.getMarkedPolicy,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfMarkedPolicy = obj.MarkedPolicy ;
      
      }
    )   
  }
  getAllBrker(){
    this.http.getAllData(ApiUrl.getAllBroker).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfBroker = obj.Brokers ;
      
      }
    )   
  }



  getEffectiveDateAndExpireDateOfMarkedPolicyId(){
    this.MarkedPolicyID
     this.http.getAllDataId(ApiUrl.getMarkedPolicyById,this.MarkedPolicyID).subscribe(data=>{
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
     
      this.listOfMarkedPolicyById = obj.MarkedPolicy; 
       this.Effective =this.listOfMarkedPolicyById[0].Effective;
      this.Effective = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Effective), 'MM/dd/yyyy')
      this.addEditPolicyForm.controls['Effective'].patchValue(this.Effective);
      this.Expiration = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Expiration), 'MM/dd/yyyy')
      
      this.addEditPolicyForm.controls['Expiration'].setValue(this.Expiration)

    
     
      
    })
  }
  load(){
    this.data
    this.ChildPolicyID = this.data.ChildPolicyID
    
    if(this.ChildPolicyID == '0') {
      

   }
   else {
    this.hideDrodownOfMarketed = false;

   
   
    this.http.getAllDataId(ApiUrl.getPolicyByChildPolcyId,this.ChildPolicyID).subscribe(data=>{
      let response  = JSON.stringify(data)
      let obj = JSON.parse(response);
      this.listOfMarkedPolicyById = obj.ChildPolicys;  
      this.PremiumPayableID = obj.ChildPolicys.PremiumPayableID;
      this.addEditPolicyForm.controls['ChildPolicyID'].setValue(this.listOfMarkedPolicyById[0].ChildPolicyID);
      this.addEditPolicyForm.controls['AccountID'].setValue(this.listOfMarkedPolicyById[0].AccountID)
      this.MarkedPolicyID =this.listOfMarkedPolicyById[0].MarkedPolicyID
     
     
      this.Effective =this.listOfMarkedPolicyById[0].Effective;
      this.Effective = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Effective), 'MM/dd/yyyy')
      this.addEditPolicyForm.controls['Effective'].patchValue(this.Effective);
      this.Expiration = this.datepipe.transform(new Date(this.listOfMarkedPolicyById[0].Expiration), 'MM/dd/yyyy')
      
      this.addEditPolicyForm.controls['Expiration'].setValue(this.Expiration)

      
      
      this.addEditPolicyForm.controls['CarrierSubmissionID'].setValue(this.listOfMarkedPolicyById[0].CarrierSubmissionID)
     
   
    
      this.addEditPolicyForm.controls['SubPolicy'].setValue(this.listOfMarkedPolicyById[0].SubPolicy)
     
      this.addEditPolicyForm.controls['Type'].setValue(this.listOfMarkedPolicyById[0].Type)
      this.addEditPolicyForm.controls['LineID'].setValue(this.listOfMarkedPolicyById[0].LineID)
     
      
      this.addEditPolicyForm.controls['Description'].setValue(this.listOfMarkedPolicyById[0].Description)
      console.log('des',
  this.addEditPolicyForm.get('Description')?.value
);
      this.addEditPolicyForm.controls['ChildPolicyName'].setValue(this.listOfMarkedPolicyById[0].ChildPolicyName)
      // this.addEditPolicyForm.controls['Description'].setValue(this.listOfMarkedPolicyById[0].Description)
      this.addEditPolicyForm.controls['Source'].setValue(this.listOfMarkedPolicyById[0].Source)
     this.PremiumPayableID= this.listOfMarkedPolicyById[0].PremiumPayableID
      
      this.addEditPolicyForm.controls['PremiumPayableID'].setValue( this.PremiumPayableID)
      let SelectPayableID = this.listOfMarkedPolicyById[0].SelectPayableID
      this.getAllDataByPremiumPayableId()

      
      this.addEditPolicyForm.controls['BrokerID'].setValue(this.listOfMarkedPolicyById[0].BrokerID)
      
      this.addEditPolicyForm.controls['SelectPayableID'].setValue(SelectPayableID)
      
      let IsDeleted = false;
      this.addEditPolicyForm.controls['IsDeleted'].setValue(IsDeleted)
      
     let IssuingCompany = this.listOfMarkedPolicyById[0].IssuingCompany
     this.addEditPolicyForm.controls['IssuingCompany'].setValue(IssuingCompany)
     this.addEditPolicyForm.controls['Policy_Status'].setValue(this.listOfMarkedPolicyById[0].Policy_Status)
     this.addEditPolicyForm.controls['BillType'].setValue(this.listOfMarkedPolicyById[0].BillType)
    //  this.addEditPolicyForm.controls['StageType'].setValue(this.listOfMarkedPolicyById[0].StageType)
     this.addEditPolicyForm.controls['UpdatedBy'].setValue(this.LoginUserName)
     
    //  this.addEditPolicyForm.controls['UpdatedBy'].setValue(this.LoginUserName)

    })

  
  
  
   }
   
  }
  makeForm(){
   
    this.addEditPolicyForm = this.fb.group({
      ChildPolicyID:['0'],
      AccountID:[this.AccountID],
      CarrierSubmissionID:[''],
      MarkedPolicyID:['',[Validators.required,]],
      PremiumPayableID:['4'],
      SelectPayableID:['4',],
      ChildPolicyName:['',[Validators.required,]],
      Description:['',[Validators.required,]],
      Effective:['',{ value: '', disabled: true }],
      Expiration:['',{ value: '', disabled: true }],
      IssuingCompany:[''],
      Source:[''],
      SubmitType:['Pro'],
      Policy_Status:['New'],
      Type:[''],
      LineID:[''],
      SubPolicy:['CA'],
      BrokerID:[''],

      BillType:['',[Validators.required]],
      StageType:['In-Process',],
      EnteredBy:[this.LoginUserName],
      IsDeleted:[''],
      UpdatedBy:[''],
      
      
      
    });
  }

  getPremiumPayable(){
    this.http.getAllData(ApiUrl.getAllPremiumPayable).subscribe(
      data=>{
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.getAllPremiumPaybale = obj.PremiumPaybles ;
       
      }
    )
  }
  getAllDataByPremiumPayableId(){
    
    
    this.http.getAllDataId(ApiUrl.getAllDetailByPremiumPayable,this.PremiumPayableID).subscribe(
      data=>{
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.selectDetailOfData = obj.SelectedPayable ;
       
      }
    )

  }

  getAllCarrier(){
    this.http.getAllData(ApiUrl.getAllCarrier).subscribe(
      data=>{
        let respone  = JSON.stringify(data)
        let obj  = JSON.parse(respone);
        this.listOfAllCarrier = obj.Carrier

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

   if(this.ChildPolicyID){
    obj['ChildPolicyID'] = this.ChildPolicyID
  }

    this.http.addEditData(ApiUrl.addEditPolicy,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);

        if(obj.Data.Response =='1'){
          this.alertMessage =obj.Data.ErrorMessage;
          this.showSuccess()

        }


        
       
       
       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.changeLocation()
    this.closeModel()
  }

  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

  get f() {
    return this.addEditPolicyForm.controls;
    
  }

  closeModel(): void {
    this.dialogRef.close();
   
  }




}
