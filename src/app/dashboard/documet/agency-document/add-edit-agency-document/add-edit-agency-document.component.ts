import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../../_core/apiUrl';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@Component({
  selector: 'app-add-edit-agency-document',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,SpinnerComponent,
    NgxMatSelectSearchModule
  ],
  templateUrl: './add-edit-agency-document.component.html',
  styleUrl: './add-edit-agency-document.component.scss'
})
export class AddEditAgencyDocumentComponent {
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
agencyDocumentSearchCtrl = new FormControl('');

filteredAgencyDocuments: string[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private router: Router,
  public dialog: MatDialog,
  public dialogRef: MatDialogRef<AddEditAgencyDocumentComponent>){
     this.agencyDocuments.sort((a, b) => a.localeCompare(b));
     this.invoices.sort((a, b) => a.localeCompare(b));
 
  }
ngOnInit(): void {

  this.accountId =
    JSON.parse(localStorage.getItem('accountId') || '{}');

  this.teamName = localStorage.getItem('teamName');
  this.userName = sessionStorage.getItem('UserName');
  this.accountName = localStorage.getItem('accountName');

  // Agency Document Search
  this.filteredAgencyDocuments = [...this.agencyDocuments];

  this.agencyDocumentSearchCtrl.valueChanges.subscribe(search => {

    const value = (search || '').toLowerCase().trim();

    if (!value) {
      this.filteredAgencyDocuments = [...this.agencyDocuments];
      return;
    }

    this.filteredAgencyDocuments =
      this.agencyDocuments.filter(doc =>
        doc.toLowerCase().includes(value)
      );
  });

  this.getAllFileDetail();
  this.makeForm();
}


 agencyDocuments: string[] = [
  "All Licenses-AIA",
  "Passwords",
  "Cyber Insurancer",
  "Renewal Test Certificates-Parm Dhami & Sandy",
  "Bond",
  "Commercial Reqester-DMV-MVR(Related)",
  "E&O",
  "Miscellaneous Receipts",
  "Pardeep Sidhu",
  "Tax",
  "Two Bros-Invoices",
  "W9"
];

  invoices: string[] = [
    "Resource Pro-Invoice",
    "Surplus Lines-Invoice",
    "Applied Invoice",
    "Cab & Carrier Software-Invoice",
    "Computer Devices & Related-Invoice",
    "Docu Sign",
    "DYL",
    "E&O",
    "Electricity",
    "Gifts",
    "Internet",
    "Miscellaneous",
    "MVRs",
    "Phone Devices & Related",
    "Producer-Commissions",
    "Team-Viewer",
    "Excel Sheet-Expenses"
  ];

  getAllFileDetail(){
    this.http.getAllData(ApiUrl.getListOfAllFilder).subscribe(
      data=>{
       let response  = JSON.stringify(data)
       let obj = JSON.parse(response)
       this.listOfAllFolder = obj.Folders
      }
    )
  }

 


  makeForm() {
  this.addEditAttachmentForm = this.fb.group({
    abc: ['', Validators.required],
    Invoice: [''],
    AgencyDocument: ['', Validators.required],
   
   Description: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500)
      ]
    ],
  
    EnteredBy: [this.userName]

  });
}

    



  get productForm() {
    return this.addEditAttachmentForm.controls;
  }


 onSubmit(): void {

  this.submit = true;

  if (this.addEditAttachmentForm.invalid) {

    this.addEditAttachmentForm.markAllAsTouched();

    return;
  }

  if (!this.myFile || this.myFile.length === 0) {

    this.addEditAttachmentForm
      .get('abc')
      ?.setErrors({ required: true });

    return;
  }

  this.showFiv = false;

  const productFormData = new FormData();

  // Files
  for (let i = 0; i < this.myFile.length; i++) {
    productFormData.append('abc', this.myFile[i]);
  }

  // Form values
  productFormData.append(
    'Invoice',
    this.addEditAttachmentForm.get('Invoice')?.value || ''
  );

  productFormData.append(
    'AgencyDocument',
    this.addEditAttachmentForm.get('AgencyDocument')?.value || ''
  );

  productFormData.append(
    'DocumentType',
    this.addEditAttachmentForm.get('DocumentType')?.value || ''
  );

  productFormData.append(
    'Description',
    this.addEditAttachmentForm.get('Description')?.value || ''
  );

  productFormData.append(
    'EnteredBy',
    this.addEditAttachmentForm.get('EnteredBy')?.value || ''
  );

  this._addProduct(productFormData);
}



    private _addProduct(productData: FormData): void {
      this.changeLocation()
    this.http.addEditFormData(ApiUrl.addAccountIngAttachement,productData).pipe().subscribe(
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
