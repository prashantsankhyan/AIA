import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { AllApiService } from '../../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';

@Component({
  selector: 'app-list-of-renew-polcy',
  standalone: true,
  imports: [CommonModule,MaterialModule,SpinnerComponent],
  templateUrl: './list-of-renew-polcy.component.html',
  styleUrl: './list-of-renew-polcy.component.scss'
})
export class ListOfRenewPolcyComponent {
  showSpiner = true;
  AccountID:any;
  listOfRenewList:any=[];


  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      // this.getPolicyByAccountId()
    })
  }
  ngOnInit(): void {
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
   
    this.getAllExpirePolicyListByAccontId();
   

 }


  getAllExpirePolicyListByAccontId(){
    this.http.getAllDataId(ApiUrl.getAllRenewPolicy,this.AccountID).subscribe(
      data=>{
        this.showSpiner = false
        let respone = JSON.stringify(data)
        let obj  = JSON.parse(respone)
        this.listOfRenewList= obj.ChildPolicys ;
        
        
      }
    )
  }
}
