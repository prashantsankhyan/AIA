import { Component } from '@angular/core';
// import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
// import { MaterialModule } from '../sharingModule/material/material.module';
import { CommonModule } from '@angular/common';
// import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { PolicyNavComponent } from '../policy-nav/policy-nav.component';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';
// import { ApiUrl } from '../_core/apiUrl';
// import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-view-of-competed-marketd-list',
  standalone: true,
  imports: [CommonModule,PolicyNavComponent,MaterialModule,SpinnerComponent],
  templateUrl: './view-of-competed-marketd-list.component.html',
  styleUrl: './view-of-competed-marketd-list.component.scss'
})
export class ViewOfCompetedMarketdListComponent {
  showSpiner = true;
 
  listOfMarkedPolicy:any =[];
  AccountID:any;
  MarkedPolicyID='';


  
  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllMarkedPolicy()
    })
  }

  ngOnInit(): void {
     this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    
     this.getAllMarkedPolicy();
     this.clearLocalStorage()
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

  editMarketd(data:any) {
    // this.MarkedPolicyID = data.MarkedPolicyID
    // const dialogRef = this.dialog.open(AddEditMarketdComponent, {
    //   width: '1400px',
    //   height: '400px',
    //   data: {MarkedPolicyID:this.MarkedPolicyID},
      
    // });
  }


  completeNextStep(data:any){
    let MarkedPolicyId = data.MarkedPolicyID;
    let ChildPolicyID = '0';
    let EndorsementID ='0';
    let IsChildPolicyExist = data.IsChildPolicyExist;
    let marketedName = data.LineShortName
    localStorage.setItem('MarkedPolicyID', MarkedPolicyId)
    localStorage.setItem('ChildPolicyID', ChildPolicyID)
    localStorage.setItem('EndorsementID', EndorsementID)
    localStorage.setItem('IsChildPolicyExist', IsChildPolicyExist)
    localStorage.setItem('marketedName', marketedName)
    
    this.router.navigate(['/detailLayout'])
    
  }

  clearLocalStorage(){
    localStorage.removeItem('MarkedPolicyID')
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('IsChildPolicyExist')
  }

}
