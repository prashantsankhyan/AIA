import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AddEditCarrierComponent } from './add-edit-carrier/add-edit-carrier.component';
import { DeleteCarrierComponent } from './delete-carrier/delete-carrier.component';

@Component({
  selector: 'app-carrier',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,SpinnerComponent],
  templateUrl: './carrier.component.html',
  styleUrl: './carrier.component.scss'
})
export class CarrierComponent {
  showSpiner = true;
  listOfCarrier:any =[];
  searchText: string = '';


  constructor( private http:AllApiService,private router:Router, private route: ActivatedRoute,public dialog: MatDialog,private cdr: ChangeDetectorRef){
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getListOfCarrier()
    })
  }


  ngOnInit(){

    this.getListOfCarrier()
    localStorage.removeItem('CarrierName');
   
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

   get filteredCarrier() {
    if (!this.searchText) return this.listOfCarrier;

    const text = this.searchText.toLowerCase();
    return this.listOfCarrier.filter((c: any) =>
      (c.CarrierName || '').toLowerCase().includes(text) ||
      (c.Phone || '').toLowerCase().includes(text) ||
      (c.City || '').toLowerCase().includes(text) ||
      (c.State || '').toLowerCase().includes(text)
    );
  }


  addEditCarrier(data:any){
    let carrierId = data.ID;
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

    this.dialog.open(AddEditCarrierComponent ,{
      width: '900px',
   
     data: {carrierId:carrierId,CarrierName:CarrierName,NAIC:NAIC,Phone:Phone,State:State,City:City,Description:Description}
    });
    

  }
  deleteCarrier(data:any){
    let carrierId = data.ID

   this.dialog.open(DeleteCarrierComponent ,{
    width: '350px',
    height:'200px',
    data: {carrierId:carrierId}
   });
   

 }

goToAttachment(data:any) {
 
this.router.navigate(
    ['carrierAttachment', data.ID],
    { relativeTo: this.route }
  );
  this.storeCarrierName(data)

}

storeCarrierName(data: any) {
  localStorage.setItem('CarrierName', JSON.stringify(data.CarrierName));
}








}
