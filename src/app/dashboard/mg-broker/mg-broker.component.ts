import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../sharingModule/material/material.module';
import { AddEditMarketdComponent } from '../../marketed/add-edit-marketd/add-edit-marketd.component';
import { DeleteSaleTeamNoteComponent } from '../delete-sale-team-note/delete-sale-team-note.component';
import { DeleteSaleProspectiveAccountComponent } from '../delete-sale-prospective-account/delete-sale-prospective-account.component';
import { DeleteSaleClientAccountComponent } from '../delete-sale-client-account/delete-sale-client-account.component';
import { AddEditTransactionComponent } from '../../transaction/add-edit-transaction/add-edit-transaction.component';
import { AddEditClaimComponent } from '../../claim/add-edit-claim/add-edit-claim.component';
import { SearchFilterPipe } from '../search-filter.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { AddEditBrokerComponent } from './add-edit-broker/add-edit-broker.component';
import { DeteteBrokerComponent } from './detete-broker/detete-broker.component';
import { AllApiService } from '../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mg-broker',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,SearchFilterPipe,SpinnerComponent],
  templateUrl: './mg-broker.component.html',
  styleUrl: './mg-broker.component.scss'
})
export class MgBrokerComponent {
  showSpiner = true;
  listOfBroker:any =[]
searchText: string = '';

  constructor( private http:AllApiService,private router:Router, private route: ActivatedRoute,public dialog: MatDialog,private cdr: ChangeDetectorRef){
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getListOfBroker()
    })
  }


  ngOnInit(){

    this.getListOfBroker()
     localStorage.removeItem('brokerName');
   
  }

  getListOfBroker(){
    this.http.getAllData(ApiUrl.getAllBroker).subscribe(
      data=>{
        this.showSpiner = false
        let response = JSON.stringify(data)
        var obj  = JSON.parse(response)
        this.listOfBroker = obj.Brokers;
        
       
       
        
      })

  }
get filteredBroker() {
    if (!this.searchText) return this.listOfBroker;

    const text = this.searchText.toLowerCase();

    return this.listOfBroker.filter((b: any) =>
      (b.AccountName || '').toLowerCase().includes(text) ||
      (b.LookUpCode || '').toLowerCase().includes(text) ||
      (b.City || '').toLowerCase().includes(text) ||
      (b.StateCode || '').toLowerCase().includes(text) ||
      (b.PrimaryNumber || '').toLowerCase().includes(text)
    );
  }

  addEditBroker(data:any){
    let BrokerID = data.BrokerID;
    let CarrierName = data.CarrierName
    let NAIC = data.NAIC
    let Phone =data.Phone
    let State = data.State
    let City = data.City
    let ZIP = data.ZIP
    let Website = data.Website
    let FaxNo = data.FaxNo
    let Address = data.Address
    let EmailID = data.EmailID
    let Description = data.Description

    this.dialog.open(AddEditBrokerComponent ,{
      width: '900px',
      height:'500px',
     data: {BrokerID:BrokerID,CarrierName:CarrierName,NAIC:NAIC,Phone:Phone,State:State,City:City}
    });
    

  }
  deleteBroker(data:any){
    let BrokerID = data.BrokerID

   this.dialog.open(DeteteBrokerComponent ,{
     width: '350px',
     height:'200px',
    data: {BrokerID:BrokerID}
   });
 }

goToAttachment(data: any) {
  this.router.navigate(
    ['viewBroker', data.BrokerID],
    { relativeTo: this.route }
  );
  this.storeBrokerName(data)
}

storeBrokerName(data: any) {
  localStorage.setItem('brokerName', JSON.stringify(data.AccountName));
}


}
