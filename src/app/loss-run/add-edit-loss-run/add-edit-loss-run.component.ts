import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { ApiUrl } from '../../_core/apiUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-loss-run',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule, SpinnerComponent],
  templateUrl: './add-edit-loss-run.component.html',
  styleUrl: './add-edit-loss-run.component.scss'
})
export class AddEditLossRunComponent {
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

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditLossRunComponent>){
 
  }
  ngOnInit(): void {
    
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
      AccountID:[this.accountId ,[Validators.required,]],
      // FolderID:['',[Validators.required,]],
      AttachedBy:['',],
      Description:['',],
      ChangeType:[''],
      PolicyType:['',[Validators.required,]],
      UnderPolicy:[''],
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
    // productFormData.append('FolderID',this.addEditAttachmentForm.get('FolderID')?.value);
    productFormData.append('AttachedBy',this.addEditAttachmentForm.get('AttachedBy')?.value);
    productFormData.append('Description',this.addEditAttachmentForm.get('Description')?.value);
    productFormData.append('ChangeType',this.addEditAttachmentForm.get('ChangeType')?.value);
    productFormData.append('PolicyType',this.addEditAttachmentForm.get('PolicyType')?.value);
    productFormData.append('TeamName',this.addEditAttachmentForm.get('TeamName')?.value);
    productFormData.append('EnteredBy',this.addEditAttachmentForm.get('EnteredBy')?.value);

    // Object.keys(this.productForm).map((key) =>{
    //   productFormData.append(key,this.productForm[key].value);
    // });
    
    
    this._addProduct(productFormData);
  
  }



    private _addProduct(productData: FormData): void {
      this.changeLocation()
    this.http.addEditFormData(ApiUrl.attachmentOfLossRun,productData).pipe().subscribe(
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
