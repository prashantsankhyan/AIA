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
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
exportToExcel(): void {

  const workbook = new ExcelJS.Workbook();

  const worksheet =
    workbook.addWorksheet('Endorsements');


  // =====================================================
  // TITLE
  // =====================================================

  worksheet.mergeCells('A1:G1');

  const titleCell =
    worksheet.getCell('A1');

  titleCell.value =
    'POLICY ENDORSEMENT DETAILS';

  titleCell.font = {
    bold: true,
    size: 16
  };

  titleCell.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  worksheet.getRow(1).height = 30;


  // =====================================================
  // POLICY INFORMATION
  // =====================================================

  worksheet.mergeCells('A2:G2');

  const policyCell =
    worksheet.getCell('A2');

  policyCell.value =
    `Marked Policy ID: ${this.MarkedPolicyID}`;

  policyCell.font = {
    bold: true,
    size: 11
  };


  // =====================================================
  // HEADER
  // =====================================================

  const headerRow = 4;

  const headers = [
    'EnterNo',
    'Entered',
    'Endorsement',
    'Description',
    'Effective Date',
    'Stage',
    'Changed-Entered By'
  ];

  worksheet.getRow(headerRow).values =
    headers;

  worksheet.getRow(headerRow).font = {
    bold: true
  };

  worksheet.getRow(headerRow).alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };

  worksheet.getRow(headerRow).height = 25;


  // =====================================================
  // DATA
  // IMPORTANT:
  // Export same filtered data as HTML
  // =====================================================

  const searchPipeData =
    this.listOfEndorsements || [];

  const search =
    this.searchCriteria || {};

  const filteredData =
    searchPipeData.filter((data: any) => {

      const endorsementType =
        String(data.EndorsementType ?? '')
          .toLowerCase();

      const entered =
        String(data.Entered ?? '')
          .toLowerCase();

      const stage =
        String(data.Stage ?? '')
          .toLowerCase();

      const description =
        String(data.Description ?? '')
          .toLowerCase();


      const endorsementSearch =
        String(search.EndorsementType ?? '')
          .trim()
          .toLowerCase();

      const enteredSearch =
        String(search.Entered ?? '')
          .trim()
          .toLowerCase();

      const stageSearch =
        String(search.Stage ?? '')
          .trim()
          .toLowerCase();

      const descriptionSearch =
        String(search.Description ?? '')
          .trim()
          .toLowerCase();


      return (

        (!endorsementSearch ||
          endorsementType.includes(
            endorsementSearch
          ))

        &&

        (!enteredSearch ||
          entered.includes(
            enteredSearch
          ))

        &&

        (!stageSearch ||
          stage.includes(
            stageSearch
          ))

        &&

        (!descriptionSearch ||
          description.includes(
            descriptionSearch
          ))

      );

    });


  // =====================================================
  // WRITE DATA
  // =====================================================

  let rowNumber = headerRow + 1;

  filteredData.forEach(
    (data: any, index: number) => {

      const row =
        worksheet.getRow(rowNumber);


      // Enter No
      row.getCell(1).value =
        data.IDBasedOnAMC == null
          ? data.LineShortName || ''
          : data.IDBasedOnAMC;


      // Entered
      if (data.Entered) {

        row.getCell(2).value =
          new Date(data.Entered);

        row.getCell(2).numFmt =
          'mm/dd/yyyy';

      } else {

        row.getCell(2).value = '';

      }


      // Endorsement
      row.getCell(3).value =
        data.EndorsementType == null
          ? 'Policy Detail'
          : data.EndorsementType;


      // Description
      row.getCell(4).value =
        data.Description || '';


      // Effective Date
      //
      // Same logic as HTML:
      // First row = EffectiveDate - ExpirationDate
      // Other rows = EffectiveDateChange
      //

      if (index === 0) {

        const effectiveDate =
          data.EffectiveDate
            ? this.formatExcelDate(
                data.EffectiveDate
              )
            : '';

        const expirationDate =
          data.ExpirationDate
            ? this.formatExcelDate(
                data.ExpirationDate
              )
            : '';

        if (
          effectiveDate &&
          expirationDate
        ) {

          row.getCell(5).value =
            `${effectiveDate} - ${expirationDate}`;

        } else {

          row.getCell(5).value =
            effectiveDate || expirationDate;

        }

      } else {

        row.getCell(5).value =
          data.EffectiveDateChange
            ? this.formatExcelDate(
                data.EffectiveDateChange
              )
            : '';

      }


      // Stage
      row.getCell(6).value =
        data.Stage || '';


      // Changed - Entered By
      row.getCell(7).value =
        `${data.UpdatedBy || ''}${
          data.UpdatedBy && data.EnteredBy
            ? ' - '
            : ''
        }${data.EnteredBy || ''}`;


      rowNumber++;

    });


  // =====================================================
  // IF NO DATA
  // =====================================================

  if (filteredData.length === 0) {

    const row =
      worksheet.getRow(rowNumber);

    worksheet.mergeCells(
      `A${rowNumber}:G${rowNumber}`
    );

    row.getCell(1).value =
      'No endorsements found';

    row.getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    row.getCell(1).font = {
      italic: true
    };

    rowNumber++;

  }


  // =====================================================
  // BORDERS
  // =====================================================

  worksheet.eachRow((row) => {

    row.eachCell((cell) => {

      cell.border = {

        top: {
          style: 'thin'
        },

        left: {
          style: 'thin'
        },

        bottom: {
          style: 'thin'
        },

        right: {
          style: 'thin'
        }

      };

      cell.alignment = {
        vertical: 'middle'
      };

    });

  });


  // =====================================================
  // COLUMN WIDTHS
  // =====================================================

  worksheet.getColumn(1).width = 15;
  worksheet.getColumn(2).width = 18;
  worksheet.getColumn(3).width = 25;
  worksheet.getColumn(4).width = 45;
  worksheet.getColumn(5).width = 30;
  worksheet.getColumn(6).width = 18;
  worksheet.getColumn(7).width = 30;


  // =====================================================
  // TEXT WRAP
  // =====================================================

  for (
    let i = headerRow;
    i < rowNumber;
    i++
  ) {

    worksheet.getRow(i).eachCell(
      (cell) => {

        cell.alignment = {
          vertical: 'middle',
          wrapText: true
        };

      }
    );

  }


  // =====================================================
  // FREEZE HEADER
  // =====================================================

  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 4
    }
  ];


  // =====================================================
  // AUTO FILTER
  // =====================================================

  if (filteredData.length > 0) {

    worksheet.autoFilter = {
      from: `A${headerRow}`,
      to: `G${rowNumber - 1}`
    };

  }


  // =====================================================
  // DOWNLOAD
  // =====================================================

  workbook.xlsx.writeBuffer().then(
    (buffer: any) => {

      const blob = new Blob(
        [buffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      );

      saveAs(
        blob,
        `Policy_Endorsements_${this.MarkedPolicyID}.xlsx`
      );

    }
  );

}
formatExcelDate(dateValue: any): string {

  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return '';
  }

  const month =
    String(date.getMonth() + 1)
      .padStart(2, '0');

  const day =
    String(date.getDate())
      .padStart(2, '0');

  const year =
    date.getFullYear();

  return `${month}/${day}/${year}`;
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
       localStorage.setItem('ExpirationDate', data.EffectiveDateChange);
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
       localStorage.setItem('ExpirationDate', data.EffectiveDateChange);
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
      localStorage.setItem('ExpirationDate', data.EffectiveDateChange);
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
       localStorage.setItem('ExpirationDate', data.EffectiveDateChange);
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
    localStorage.removeItem('ExpirationDate')
   
    
   
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
