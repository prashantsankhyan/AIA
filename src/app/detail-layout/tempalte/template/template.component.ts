import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { NgxPrintModule } from 'ngx-print';
import { TemolateNaveComponent } from '../temolate-nave/temolate-nave.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgxPrintModule,TemolateNaveComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent {
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
  effectiveDate: string = '';
  userName:any;
  accountId:any;
  MarkedPolicyId:any;
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
    this.getListOfData()
    // this.getCommodity()
    const currentDate = new Date();

    // Format the date as MM/dd/yyyy
    const formattedDate = this.formatDate(currentDate);

    // Assign the formatted date to the property used in the template
    this.effectiveDate = formattedDate;
    this.makeForm()
   

  }
  makeForm() {

  }
  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
  getListOfData(){
    this.http.getAllDataByThreId(ApiUrl.getAllDetailToFillTemplate,this.accountId,this.MarkedPolicyId,this.ChildPolicyID).subscribe(data =>{
      let response = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.listOfData = obj
      
      console.log(this.listOfData)
      
    })
    this.getCommodity()
  }

  getCommodity(){
    this.http.getAllDataByTwoId(ApiUrl.GetAllCommodityByChildandMarkedPolicyID,this.MarkedPolicyId,this.ChildPolicyID).subscribe(
      (data) => {
        this.listOfCommodity = data.Commodity;
        console.log('this.listOfCommodity',this.listOfCommodity)
      
      
  
      
      },
     
    );
  }

 

}
