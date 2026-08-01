import { Component, Inject } from '@angular/core';
import { ApiUrl } from '../../../_core/apiUrl';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';

@Component({
  selector: 'app-certs-attachment',
  standalone: true,
   imports: [CommonModule,MaterialModule,ReactiveFormsModule, SpinnerComponent],
  templateUrl: './certs-attachment.component.html',
  styleUrl: './certs-attachment.component.scss'
})
export class CertsAttachmentComponent {
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
   HoldingID:any

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<CertsAttachmentComponent>){
 
  }
  ngOnInit(): void {
    this.HoldingID = this.data.HoldingID
    
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.teamName =localStorage.getItem('teamName');
    this.userName = sessionStorage.getItem('UserName');
    this.accountName = localStorage.getItem('accountName');
    
    this.getAllFileDetail()
    this.makeForm();
   
   
    
   
  }
  getAllFileDetail(){
    this.http.getAllData(ApiUrl.getListOfAllFilder).subscribe(
      data=>{
       let response  = JSON.stringify(data)
       let obj = JSON.parse(response)
       this.listOfAllFolder = obj.Folders
      }
    )
  }

  makeForm(){
    this.addEditAttachmentForm = this.fb.group({
      abc:['',[Validators.required,]],
      AccountID:[this.accountId],
      HoldingId:[this.HoldingID ,[Validators.required,]],
      // FolderID:['',[Validators.required,]],
      AttachedBy:['',[Validators.required,]],
      Description:['',[Validators.required,]],
     
      EnteredBy:[this.userName]
      
      
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
      productFormData.append('HoldingId',this.addEditAttachmentForm.get('HoldingId')?.value);
    productFormData.append('AttachedBy',this.addEditAttachmentForm.get('AttachedBy')?.value);
    productFormData.append('Description',this.addEditAttachmentForm.get('Description')?.value);
    // productFormData.append('ChangeType',this.addEditAttachmentForm.get('ChangeType')?.value);
    // productFormData.append('PolicyType',this.addEditAttachmentForm.get('PolicyType')?.value);
    // productFormData.append('UnderPolicy',this.addEditAttachmentForm.get('UnderPolicy')?.value);
    productFormData.append('EnteredBy',this.addEditAttachmentForm.get('EnteredBy')?.value);

    // Object.keys(this.productForm).map((key) =>{
    //   productFormData.append(key,this.productForm[key].value);
    // });
    
    
    this._addProduct(productFormData);
  
  }



    private _addProduct(productData: FormData): void {
      this.changeLocation()
    this.http.addEditFormData(ApiUrl.uploadHolderCertificate,productData).pipe().subscribe(
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
    // ✅ Remove file extension
  const fileName = this.files.name;
  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");  // removes .pdf, .docx, etc.

  // ✅ Set file name (without extension) as description only if not already filled
  const currentDescription = this.addEditAttachmentForm.get('Description')?.value;
  if (!currentDescription) {
    this.addEditAttachmentForm.get('Description')?.setValue(fileNameWithoutExtension);
  }

  this.detail = fileNameWithoutExtension;
  console.log("Selected file(s):", this.myFile);
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
