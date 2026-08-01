import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-attachement-of-support',
  standalone: true,
  
 imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule, SpinnerComponent],
  templateUrl: './add-edit-attachement-of-support.component.html',
  styleUrl: './add-edit-attachement-of-support.component.scss'
})
export class AddEditAttachementOfSupportComponent {

    addEditAttachmentForm!:FormGroup ;
    submit = false ;
    accountId =''
    FileDisplay!: string | ArrayBuffer;
    files: any;
    file:any
    listOfAllFolder:any =[];
    fileName ='';
     showFiv = true;
     userPermission:any;
     name =''
     detail =''
     myFile:string [] =[]
     saveButtonShow = true;
     userName:any;
     accountName:any;
     teamName:any;
  
     showSpiner = true;
        listOfEmpity:any;
  showTaleIfempity = false;
  showTableIfDataHave = false;
  showEndrosementList = true;
  listOfPolicy:any=[];
    constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditAttachementOfSupportComponent>){
   
    }
    ngOnInit(): void {
      
      this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
      this.teamName =localStorage.getItem('teamName');
      this.userName = sessionStorage.getItem('UserName');
      this.accountName = localStorage.getItem('accountName');
      
    this.getPolicyByAccountId()
      this.makeForm();
     
     
      
     
    }
 

     getPolicyByAccountId(){
  this.http.getAllDataId(ApiUrl.getAllPolicyByAccountId,this.accountId).subscribe(
    data=>{
      this.showSpiner = false
      let response = JSON.stringify(data)
      var obj  = JSON.parse(response)
      let length = obj.ChildPolicys.length
      if(length == '0'){
        this.listOfEmpity = ' No data Found'
        this.showTaleIfempity = true;
       
      }else{
        this.showTableIfDataHave = true
        this.listOfPolicy = obj.ChildPolicys ;
      
       if (this.listOfPolicy[0]?.LineName) {
          this.addEditAttachmentForm.patchValue({
            UnderPolicy: this.listOfPolicy[0].LineName
            
          });
        }
       
      }


    }
  )   
}



  
    makeForm(){
      this.addEditAttachmentForm = this.fb.group({
        abc:['',[Validators.required,]],
        AccountID:[this.accountId ,[Validators.required,]],
        FolderID:[''],
        FileName:[''],
       
        AttachedBy:['jj',],
        Description:['',],
        PolicyType:[''],
        TransactionType:[''],
        TeamName:[''],
        UnderPolicy:[''],
        EnteredBy:[this.userName],
        
        
        
      });
    }
      
  
  
  
    get productForm() {
      return this.addEditAttachmentForm.controls;
    }
  
  
    onSubmit(): void {
      this.submit  = true ;
      this.showFiv = !this.showFiv
     
      if(this.addEditAttachmentForm.invalid){
       this.showFiv = true
        return ;
      }
      const productFormData = new FormData();
  
      for(let i=0 ; i< this.myFile.length; i++){
        productFormData.append('abc',this.myFile[i])
        
      }
     
      productFormData.append('AccountID',this.addEditAttachmentForm.get('AccountID')?.value);
      productFormData.append('FolderID',this.addEditAttachmentForm.get('FolderID')?.value);
      productFormData.append('AttachedBy',this.addEditAttachmentForm.get('AttachedBy')?.value);
      productFormData.append('Description',this.addEditAttachmentForm.get('Description')?.value);
      productFormData.append('EnteredBy',this.addEditAttachmentForm.get('EnteredBy')?.value);
      productFormData.append('PolicyType',this.addEditAttachmentForm.get('PolicyType')?.value);
      productFormData.append('TransactionType',this.addEditAttachmentForm.get('TransactionType')?.value);
       productFormData.append('UnderPolicy',this.addEditAttachmentForm.get('UnderPolicy')?.value);
       productFormData.append('FileName',this.addEditAttachmentForm.get('FileName')?.value);
      productFormData.append('TeamName',this.addEditAttachmentForm.get('TeamName')?.value);
  
      // Object.keys(this.productForm).map((key) =>{
      //   productFormData.append(key,this.productForm[key].value);
      // });
      
      
      this._addProduct(productFormData);
    
    }
  
  
  
      private _addProduct(productData: FormData): void {
        this.changeLocation()
      this.http.addEditFormData(ApiUrl.ReportTeamUploadMultiFiles,productData).pipe().subscribe(
          data => {
  
           this.changeLocation()
           const response  = JSON.stringify(data) ;
           const  obj   = JSON.parse(response) ;
         
           this.showSuccess();
           this.onNoClick1()
        
        },
         
        );
    }
  
    
    onFileUpload(event:any): void {
      this.files = event.target.files[0];
      for(let i=0 ; i<(event.target.files.length);i++){
        this.file = event.target.files[i]
        this.myFile.push(event.target.files[i])
        this.addEditAttachmentForm.get('abc')?.setValue(this.myFile);
      }
      // if (this.files) {
      //   this.addEditAttachmentForm.patchValue({ abc: this.files });
      //   this.addEditAttachmentForm.get('abc')?.setValue(this.myFile);
      //   const fileReader = new FileReader();
      //   fileReader.onload = () => {
      //     this.FileDisplay =fileReader.result!;
      //   };
      //   fileReader.readAsDataURL(this.files);
      // }
      console.log("filer", this.myFile)
  
      this.detail  = this.files.name
    }
  
  
    
  
    showSuccess() {
      this.toastr.success('Save', 'Data Save' ,{
        timeOut: 3000,
      });
      this.changeLocation()
      this.showFiv = true
      
    } 
  
  
  
  
    get f() {
      return this.addEditAttachmentForm.controls; }
    
      onNoClick1(): void {
        this.dialogRef.close();
       
      }
    
    
    
      changeLocation() {
    
        // save current route first
        let currentRoute = this.router.url;
        console.log("rute" , currentRoute)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentRoute]); // navigate to same route
        }); 
      }

}
