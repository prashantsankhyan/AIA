import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEndrosementStageComponent } from '../add-endrosement-stage/add-endrosement-stage.component';
import { AddEditVehicleComponent } from '../../detail-layout/vehicle/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditDriverComponent } from '../../detail-layout/driver/add-edit-driver/add-edit-driver.component';
import { AddEditEndrosementComponent } from '../add-edit-endrosement/add-edit-endrosement.component';

@Component({
  selector: 'app-list-of-endrosement',
  standalone: true,
  imports: [CommonModule,MatButtonModule,FormsModule ,MaterialModule ,HttpClientModule ],
  templateUrl: './list-of-endrosement.component.html',
  styleUrl: './list-of-endrosement.component.scss'
})
export class ListOfEndrosementComponent {
  AccountID:any;
  ChildPolicyID:any;
  alertMessage =''

  MarkedPolicyID ='';
 
  listOfMarkedPolicy:any =[];
  listOfMarkedPolicyById:any =[];
  
  messageSuccess = true;
  listOfEndorsements:any =[];
  showEndrosementList = true;
  EndorsementID:any;
  EndorsementType:any
  LineShortName:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<ListOfEndrosementComponent>){}
  ngOnInit(): void {
    this.clearLocalStorage()
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.data;
    this.MarkedPolicyID = this.data.MarkedPolicyID
    this.ChildPolicyID = this.data.ChildPolicyID;
    this.LineShortName = this.data.LineShortName
    this.getAllEndroesemnt()
    
    
   
   
   }
   

   getAllEndroesemnt(){
    this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.ChildPolicyID).subscribe(
      data=>{
        let respone  = JSON.stringify(data)
        let obj = JSON.parse(respone)
        
        this.listOfEndorsements = obj.Endorsements
        this.showEndrosementList = false
        console.log(this.listOfEndorsements)
        
      }
    )
  }
 addEditEndrocement(data:any){
  this.dialog.open(AddEditEndrosementComponent ,{
    width: '400px',
    height:'460px',
   data: {MarkedPolicyID:data.MarkedPolicyID,AccountID:data.AccountID,ChildPolicyID:data.ChildPolicyID ,EndorsementID:data.EndorsementID,Description:data.Description,EffectiveDateChange:data.EffectiveDateChange,EndorsementType:data.EndorsementType, 
    Code:data.Code ,LineShortName:data.LineShortName
   }
  });
  this.closeModel()
}
  goToChickOrVistEndroseemtLine(data:any){
    this.EndorsementID =data.EndorsementID;
   
    this.ChildPolicyID = data.ChildPolicyID;
    
    this.MarkedPolicyID = data.MarkedPolicyID
   
    this.EndorsementType = data.EndorsementType;
  
    if(this.EndorsementType =='Driver'){
      
            
      // this.addDriverByEndrosement()
      this.router.navigate(['/detailLayout/driver'])
      let endorsementType = data.EndorsementType

      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
      localStorage.setItem('EndorsementID',  this.EndorsementID)
      localStorage.setItem('endorsementType',  endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
      
      
  
    }else if(this.EndorsementType =='Truck') {
    
      // this.addUnitByEndrosement()
      this.router.navigate(['/detailLayout/vehicle'])
      let endorsementType = data.EndorsementType
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
      localStorage.setItem('EndorsementID',  this.EndorsementID)
      localStorage.setItem('endorsementType',  endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
     
  
    }else if(this.EndorsementType =='Trailer') {
    
      // this.addUnitByEndrosement()
      this.router.navigate(['/detailLayout/vehicle'])
      let endorsementType = data.EndorsementType
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID',this.ChildPolicyID)
      localStorage.setItem('EndorsementID',this.EndorsementID)
      localStorage.setItem('endorsementType',endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
   
    }
    else{
     
      this.router.navigate(['/detailLayout/commodity'])
      let endorsementType = 'Other'
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID',this.ChildPolicyID)
      localStorage.setItem('EndorsementID',this.EndorsementID)
      localStorage.setItem('endorsementType',endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
    }
     
    this.closeModel()
  }


  
addDriverByEndrosement(){
  this.dialog.open(AddEditDriverComponent ,{
    width: '800px',
    height: '500px',
   data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
  });

}
addUnitByEndrosement(){
  this.dialog.open(AddEditVehicleComponent ,{
    width: '800px',
    height: '500px',
   data: {MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,EndorsementID:this.EndorsementID,}
  });
}

  EndorsementUpdateId =''

  addStageInEndrosement(data:any){
    this.EndorsementUpdateId = data.EndorsementID;
   
 
    this.dialog.open(AddEndrosementStageComponent ,{
      width: '400px',
      height:'300px',
     data: {EndorsementID:this.EndorsementUpdateId,MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID }
    });
    
    this.closeModel()
    

  }


  closeModel(): void {
    this.dialogRef.close();
   
  }


  clearLocalStorage(){
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('MarkedPolicyID')
   
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('endorsementType')
    
    localStorage.removeItem('IsChildPolicyExist')
  }
}
