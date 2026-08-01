import { Component,  Inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../sharingModule/material/material.module';


import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEditMarketdComponent } from '../../../marketed/add-edit-marketd/add-edit-marketd.component';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { SpinnerComponent } from '../../../spinner/spinner.component';
import { AllApiService } from '../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-data-by-excel',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-data-by-excel.component.html',
  styleUrl: './add-data-by-excel.component.scss'
})
export class AddDataByExcelComponent {
  showSpiner = true
  addExcelForm!:FormGroup ;
  submit = false ;
  accountId =''
  VehicleID =''
  MarkedPolicyId:any;
  EndorsementID:any;
  ChildPolicyID:any;
  IsChildPolicyExist:any;
  alertMessage =''
  FileDisplay!: string | ArrayBuffer;
  files: any;
  file:any
  listOfAllFolder:any =[];
  fileName ='';
   showFiv = true;
   userPermission:any;
   name =''
   detail =''
   myFile:string [] =[];
   userName:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private fb: FormBuilder,private http:AllApiService ,private cRouter:ActivatedRoute, private router:Router,private toastr: ToastrService,public dialogRef: MatDialogRef<AddDataByExcelComponent>) { }

  ngOnInit(): void {
    this.accountId = JSON.parse(localStorage.getItem('accountId')||'{}') 
    this.userName = sessionStorage.getItem('UserName')
    if(this.userName == null){
      this.router.navigate(['/login'])
      this.dialogRef.close();
  }
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID')
   
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
   
    this.EndorsementID = localStorage.getItem('EndorsementID')
  
  
    if(this.EndorsementID == null){
      this.EndorsementID = '0'
    }
    else{
      this.EndorsementID = localStorage.getItem('EndorsementID')
    }
    this.IsChildPolicyExist = localStorage.getItem('IsChildPolicyExist')

    this.makeForm()
   

  }
  makeForm(){
   
    this.addExcelForm = this.fb.group({
      ExcelFile:['',[Validators.required,]],
      AccountID:[this.accountId ,[Validators.required,]],
      MarkedPolicyID:[this.MarkedPolicyId,[Validators.required,]],
      ChildPolicyID:[this.ChildPolicyID,[Validators.required,]],
      EndorsementID:[this.EndorsementID,[Validators.required]],
      EnteredBy:[this.userName],
      
      
    });
  }

  
  
  get productForm() {
    return this.addExcelForm.controls;
  }


  onSubmit(): void {
    this.submit  = true ;
    this.showFiv = false
    
   
    if(this.addExcelForm.invalid){
      
     this.showFiv = true
      return ;
    }
    const productFormData = new FormData();

    for(let i=0 ; i< this.myFile.length; i++){
      productFormData.append('ExcelFile',this.myFile[i])
      
    }
   
    productFormData.append('AccountID',this.addExcelForm.get('AccountID')?.value);
    productFormData.append('MarkedPolicyID',this.addExcelForm.get('MarkedPolicyID')?.value);
    productFormData.append('ChildPolicyID',this.addExcelForm.get('ChildPolicyID')?.value);
    productFormData.append('EndorsementID',this.addExcelForm.get('EndorsementID')?.value);
    productFormData.append('EnteredBy',this.addExcelForm.get('EnteredBy')?.value);
    
  

    
    this._addProduct(productFormData);
  
  }



    private _addProduct(productData: FormData): void {
     
      
      
       this.http.addEditFormData(ApiUrl.addVehicleByExcelFile,productData).pipe().subscribe(
        data => {
          this.showFiv = false
          this.changeLocation()
        
         const response  = JSON.stringify(data) ;
         const  obj   = JSON.parse(response) ;
    
         this.showSuccess();
         this.onNoClick1()
      
      },
       
      );
  }

  
  onFileUpload(event:any): void {
    this.showFiv = true
    this.files = event.target.files[0];
    for(let i=0 ; i<(event.target.files.length);i++){
      this.file = event.target.files[i]
      this.myFile.push(event.target.files[i])
      this.addExcelForm.get('ExcelFile')?.setValue(this.myFile);
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
  
   
    
  } 




  get f() {
    return this.addExcelForm.controls; }
  
    onNoClick1(): void {
      this.dialogRef.close();
     
    }
  
  
  
    changeLocation() {
     let currentRoute = this.router.url;
      console.log("rute" , currentRoute)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]); // navigate to same route
      }); 
    }
}
