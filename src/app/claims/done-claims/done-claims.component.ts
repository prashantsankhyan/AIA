import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsPipe } from '../add-edit-claims/_searchPipeForClaims/claims.pipe';
import { ReverseClaimComponent } from './reverse-claim/reverse-claim.component';
import { ListOfNoteComponent } from '../add-edit-claims/list-of-note/list-of-note.component';

@Component({
  selector: 'app-done-claims',
  standalone: true,
  imports: [CommonModule,MaterialModule ,SpinnerComponent,ClaimsPipe],
  templateUrl: './done-claims.component.html',
  styleUrl: './done-claims.component.scss'
})
export class DoneClaimsComponent {
  showSpiner = true
  AccountID:any
  listOfMoveClaim:any =[];
  ClaimID:any;
  confirmReason:any
  searchCriteria = {
    ClaimNumber: '',
    LineShortName: '',
    ReportedTo: '',
  };
  constructor(private http:AllApiService,private cRouter:Router,private cdr: ChangeDetectorRef,public dialog: MatDialog,) { }

  ngOnInit(): void {
   
    
    this.AccountID = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.getAllData()
    
    localStorage.removeItem('confirmReason');
  }

  backToClaims(){
      this.cRouter.navigate(['/claims/listOfClaims'])
  }
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }
  
  onClaimNumberChange(newClaimNumber: string) {
    this.updateSearchCriteria({ ClaimNumber: newClaimNumber });
    
  }
  
  onLineShortNameChange(newLineShortName: string) {
    this.updateSearchCriteria({ LineShortName: newLineShortName });
  }
  
  onReportedToChange(newReportedTo: string) {
    this.updateSearchCriteria({ ReportedTo: newReportedTo });
  }
 
  getAllData(){
    this.http.getAllDataId(ApiUrl.getMoveData,this.AccountID).subscribe(
      data=>{
       
        let response = JSON.stringify(data)
        let obj  = JSON.parse(response)
        this.listOfMoveClaim = obj.Claims
        this.showSpiner = false

      }
    )
  }


  getListOfAdjustors(data:any){
    
    this.ClaimID = data.ClaimID;
    this.confirmReason = data.DeleteReason
   
    localStorage.setItem('confirmReason', this.confirmReason);
    this.cRouter.navigate(['/claims/adjustorsList',this.ClaimID])
  }

     viewOfNote(data:any) {
     
      this.dialog.open(ListOfNoteComponent ,{
      
         data:{ClaimID:data.ClaimID}
      });
      
    }

  reverseClaim(data:any) {
    this.dialog.open(ReverseClaimComponent ,{
     
      data:{ClaimID:data.ClaimID}

    });
  }
  
}
