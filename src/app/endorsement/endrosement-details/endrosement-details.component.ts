import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { CommonModule } from '@angular/common';
import { AllApiService } from '../../_service/all-api.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditEndrosementComponent } from './add-or-edit-endrosement/add-or-edit-endrosement.component';
import { ApiUrl } from '../../_core/apiUrl';
import { UpdateEndorsementStageComponent } from './update-endorsement-stage/update-endorsement-stage.component';
import { ListOfAllEditByEndrosementComponent } from './list-of-all-edit-by-endrosement/list-of-all-edit-by-endrosement.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ListOfPreviousDriverAndVehicleComponent } from './list-of-previous-driver-and-vehicle/list-of-previous-driver-and-vehicle.component';
import { SearchEndrosementPipe } from '../../_SearchPipe/search-endrosement.pipe';
import { DeletePolicyComponent } from '../../policy/delete-policy/delete-policy.component';
import { SubmitChangeRequestComponent } from './submit-change-request/submit-change-request.component';


@Component({
  selector: 'app-endrosement-details',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterLink,SpinnerComponent,SearchEndrosementPipe],
  templateUrl: './endrosement-details.component.html',
  styleUrl: './endrosement-details.component.scss'
})
export class EndrosementDetailsComponent {
  showSpinner = true;
  AccountID:any;
  MarkedPolicyID:any;
  ChildPolicyID:any;
  userName:any;
  listOfEndorsements:any =[];
  showActions: boolean = false;
  EndorsementID:any;
  EndorsementType:any;
  marketedName :any;
  repostingType:any;
  searchCriteria = {
    EndorsementType: '',
    Entered: '',
    Stage: '',
    Description:'',
  };

  constructor(private http:AllApiService,private router:Router,public dialog: MatDialog,private cdr: ChangeDetectorRef) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getAllEndroesemnt()
    })
  }
  ngOnInit(): void {
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.MarkedPolicyID = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID')
    this.userName = sessionStorage.getItem('UserName')
 
    if(this.userName == null){
      this.router.navigate(['/login'])
     
     }
     this.getAllEndroesemnt()
     this.clearLocalStorage();
     this.getData();

   }

   updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }
  
  onEndorsementTypeChange(newEndorsementType: string) {
    this.updateSearchCriteria({ EndorsementType: newEndorsementType });
    
  }
  
  onEnteredChange(newEntered: string) {
    this.updateSearchCriteria({ Entered: newEntered });
  }
  
  onStageChange(newStage: string) {
    this.updateSearchCriteria({ Stage: newStage });
  }
  onDescriptionChange(newDescription: string) {
    this.updateSearchCriteria({ Description: newDescription });
  }

  getData() {

  this.http
    .getAllDataId(
      ApiUrl.getPolicyStatus,
      this.ChildPolicyID
    )
    .subscribe((data: any) => {

      const obj =
        typeof data === 'string'
          ? JSON.parse(data)
          : data;

      if (obj?.Reposting?.length > 0) {

        const repostingData = obj.Reposting[0];

        this.repostingType = repostingData.RepostingType;
        const enteredBy = repostingData.EnteredBy;

        console.log('RepostingType:', this.repostingType);
        console.log('EnteredBy:', enteredBy);

      }

    });

}
  
  

    getAllEndroesemnt(){
       this.http.getAllDataByTwoId(ApiUrl.getAllEndrosementByPolicyId,this.MarkedPolicyID,this.ChildPolicyID).subscribe(
         data=>{
          this.showSpinner  = false
           let respone  = JSON.stringify(data)
           let obj = JSON.parse(respone)
           
           this.listOfEndorsements = obj.Endorsements
         
           console.log(this.listOfEndorsements)
           
         }
       )
     }

   addEditEndrocement(data:any){
    this.dialog.open(AddOrEditEndrosementComponent ,{
      width: '400px',
     
      data:{EndorsementID:data.EndorsementID,Description:data.Description,EndorsementType:data.EndorsementType
        ,EffectiveDateChange:data.EffectiveDateChange,Code:data.Code
      }
    
    });
  }

  goToChickAddOrVistEndroseemtLine(data:any){
    this.EndorsementID =data.EndorsementID;
    // alert( this.EndorsementID)
   
    this.ChildPolicyID = data.ChildPolicyID;
    
    this.MarkedPolicyID = data.MarkedPolicyID
   
    this.EndorsementType = data.EndorsementType;
    this.marketedName  =   data.LineShortName;
   
  
    if(this.EndorsementType =='Driver'){
      
            
      // this.addDriverByEndrosement()
      this.router.navigate(['/detailLayout/driver'])
      let endorsementType = data.EndorsementType
      

      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
      localStorage.setItem('EndorsementID',  this.EndorsementID)
      localStorage.setItem('marketedName',  this.marketedName)
      localStorage.setItem('endorsementType',  endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
      
      
  
    }else if(this.EndorsementType =='Truck') {
    
      // this.addUnitByEndrosement()
      this.router.navigate(['/detailLayout/vehicle'])
      let endorsementType = data.EndorsementType
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID', this.ChildPolicyID)
      localStorage.setItem('EndorsementID',  this.EndorsementID)
      localStorage.setItem('marketedName',  this.marketedName)
      localStorage.setItem('endorsementType',  endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
     
  
    }else if(this.EndorsementType =='Trailer') {
    
      // this.addUnitByEndrosement()
      this.router.navigate(['/detailLayout/vehicle'])
      let endorsementType = data.EndorsementType
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID',this.ChildPolicyID)
      localStorage.setItem('EndorsementID',this.EndorsementID)
      localStorage.setItem('marketedName',  this.marketedName)
      localStorage.setItem('endorsementType',endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
   
    }
    else{
     
      this.router.navigate(['/detailLayout/commodity'])
      let endorsementType = 'Other'
      localStorage.setItem('MarkedPolicyID',this.MarkedPolicyID )
      localStorage.setItem('ChildPolicyID',this.ChildPolicyID)
      localStorage.setItem('EndorsementID',this.EndorsementID)
      localStorage.setItem('marketedName',  this.marketedName)
      localStorage.setItem('endorsementType',endorsementType)
      localStorage.setItem('IsChildPolicyExist', 'false')
    }
     
   
  }

  updateEndrosement(data:any){
    this.EndorsementID = data.EndorsementID;
   
    this.dialog.open(UpdateEndorsementStageComponent ,{
      width: '400px',
     
     data: {EndorsementID:this.EndorsementID,MarkedPolicyID:this.MarkedPolicyID,ChildPolicyID:this.ChildPolicyID,
      EffectiveDateChange:data.EffectiveDateChange
      }
    });
  }
  naviageteToanotherPage(){
    this.router.navigate(['/endorsement/attachementEndro'])
  }

  clearLocalStorage(){
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('marketedName')
   
   
   
    localStorage.removeItem('endorsementType')
   
    
    localStorage.removeItem('IsChildPolicyExist')
  }



  viewPreviousDriverAndVehicle(data:any){
   
    this.dialog.open(ListOfPreviousDriverAndVehicleComponent ,{
      width: '1800px',
      height:'900px',
     data: {ChildPolicyID:data.ChildPolicyID,EndorsementID:data.EndorsementID,MarkedPolicyID:data.MarkedPolicyID,
      }
    });

  }
  submitChangeRequest(data:any){
    this.dialog.open(SubmitChangeRequestComponent ,{
      width: '1800px',
      height:'900px',
     data: {ChildPolicyID:data.ChildPolicyID,EndorsementID:data.EndorsementID,AccountID:data.AccountID,EffectiveDateChange:data.EffectiveDateChange,
      IDBasedOnAMC:data.IDBasedOnAMC,LineShortName:data.LineShortName,LineName:data.LineName,EnteredBy:data.EnteredBy

      }
    });

  }

  viewDataBaseOfEndoresement(data:any){
    
    this.dialog.open(ListOfAllEditByEndrosementComponent ,{
      width: '1800px',
      height:'900px',
     data: {ChildPolicyID:data.ChildPolicyID,EndorsementID:data.EndorsementID,MarkedPolicyID:data.MarkedPolicyID,
      EndorsementType:data.EndorsementType
      }
    });

  }


  deletePolicy(data:any){
    this.dialog.open(DeletePolicyComponent ,{
      width: '400px',
      height:'300px',
     data: {ChildPolicyID:data.ChildPolicyID }
    });
  }

 
}
