import { ChangeDetectorRef, Component } from '@angular/core';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { SearchCertsAttachementPipe } from '../../certs/holder-details/search-certs-attachement.pipe';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-certs-holder-list',
  standalone: true,
  imports: [CommonModule,SearchCertsAttachementPipe,SpinnerComponent],
  templateUrl: './certs-holder-list.component.html',
  styleUrl: './certs-holder-list.component.scss'
})
export class CertsHolderListComponent {
  showSpiner = true;
  listOfAllFatchData:any[]=[];
   searchCriteria = {
    HoldingID: '',
    Description: '',
    AttachmentDate: '',
    EnteredBy:'',
   
  
  };
 constructor(private http:AllApiService,private cdr: ChangeDetectorRef) { 
    this.http.listen().subscribe((m:any)=>{
      console.log(m)
      this.getCerts()
    })
  }
  ngOnInit(): void {
    this.getCerts();
    
    



 }
 
  updateSearchCriteria(criteria: any) {
    this.searchCriteria = { ...this.searchCriteria, ...criteria };
    this.cdr.markForCheck(); // Notify Angular that changes have occurred
  }

  onHoldingIDChange(newHoldingID: string) {
    this.updateSearchCriteria({ HoldingID: newHoldingID });
    
  }

  onDescriptionChange(newDescription: string) {
    this.updateSearchCriteria({ Description: newDescription });
  }
  
 
  onAttachmentDateChange(newAttachmentDate: string) {
    this.updateSearchCriteria({ AttachmentDate: newAttachmentDate });
  }


  

 getCerts(){
  this.http.getAllData(ApiUrl.getAllHolderAttach).subscribe(
    data=>{
      this.showSpiner = false
      let response = JSON.stringify(data)
      var obj  = JSON.parse(response)
      let length = obj.Holding_Attachments.length
      if(length == '0'){
        // this.listOfEmpity = ' No data Found'
        // this.showTaleIfempity = true;
       
      }else{
       
        this.listOfAllFatchData = obj.Holding_Attachments ;
       
      }


    }
  )   
}
 onClickDataGetClick(file: any) {
  const httpsFileUrl = file.FileUrl.replace('http://', 'https://');
  const fileName = file.FileName;

  
  const link = document.createElement('a');
  link.href = httpsFileUrl;
  link.setAttribute('download', fileName);
  link.setAttribute('target', '_blank'); 
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
