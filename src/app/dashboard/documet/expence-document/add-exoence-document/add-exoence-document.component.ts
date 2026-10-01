import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../sharingModule/material/material.module';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SpinnerComponent } from '../../../../spinner/spinner.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { AllApiService } from '../../../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../../_core/apiUrl';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-add-exoence-document',
  standalone: true,

  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    SpinnerComponent,
    NgxMatSelectSearchModule
  ],

  templateUrl: './add-exoence-document.component.html',
  styleUrl: './add-exoence-document.component.scss'
})
export class AddExoenceDocumentComponent {

  addEditAttachmentForm!: FormGroup;

  submit = false;
  accountId = '';

  FileDisplay!: string | ArrayBuffer;

  files: File | null = null;
  file: File | null = null;

  listOfAllFolder: any[] = [];

  fileName = '';
  showFiv = true;

  userPermission: any;

  name = '';
  detail = '';

  myFile: File[] = [];

  saveButtonShow = true;

  userName: any;
  accountName: any;
  teamName: any;


  // =========================================================
  // EXPENSE SEARCH
  // =========================================================

  documentTypeSearchCtrl = new FormControl('');

  filteredDocumentTypes: string[] = [];


  // =========================================================
  // EXPENSE LIST
  // =========================================================

  documentTypes: string[] = [
    'Resource Pro-Invoice',
    'Surplus Lines-Invoice',
    'Applied Invoice',
    'Cab & Carrier Software-Invoice',
    'Computer Devices & Related-Invoice',
    'Docu Sign',
    'DYL',
    'E&O',
    'Electricity',
    'Gifts',
    'Internet',
    'Miscellaneous',
    'MVRs',
    'Phone Devices & Related',
    'Producer-Commissions',
    'Team-Viewer',
    'Excel Sheet-Expenses'
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: AllApiService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddExoenceDocumentComponent>
  ) {

    this.documentTypes.sort((a, b) =>
      a.localeCompare(b)
    );

  }


  ngOnInit(): void {

    this.accountId =
      JSON.parse(
        localStorage.getItem('accountId') || '""'
      );

    this.teamName =
      localStorage.getItem('teamName');

    this.userName =
      sessionStorage.getItem('UserName');

    this.accountName =
      localStorage.getItem('accountName');


    // Initial dropdown data
    this.filteredDocumentTypes =
      [...this.documentTypes];


    // Search
    this.documentTypeSearchCtrl.valueChanges
      .subscribe(search => {

        const value =
          (search || '')
            .toLowerCase()
            .trim();


        if (!value) {

          this.filteredDocumentTypes =
            [...this.documentTypes];

          return;
        }


        this.filteredDocumentTypes =
          this.documentTypes.filter(doc =>
            doc.toLowerCase().includes(value)
          );

      });


    this.getAllFileDetail();

    this.makeForm();
  }


  // =========================================================
  // FOLDER DATA
  // =========================================================

  getAllFileDetail(): void {

    this.http
      .getAllData(ApiUrl.getListOfAllFilder)
      .subscribe({

        next: (data: any) => {

          this.listOfAllFolder =
            data?.Folders || [];

        },

        error: error => {

          console.error(
            'Folder API Error:',
            error
          );

        }

      });

  }


  // =========================================================
  // FORM
  // =========================================================

  makeForm(): void {

    this.addEditAttachmentForm =
      this.fb.group({

        abc: [
          '',
          Validators.required
        ],

          AgencyDocument: ['', ],

         Invoice: [''],
        DocumentType: [
          '',
          Validators.required
        ],

        Description: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(500)
          ]
        ],

        EnteredBy: [
          this.userName
        ]

      });

  }


  // =========================================================
  // FORM CONTROLS
  // =========================================================

  get f() {
    return this.addEditAttachmentForm.controls;
  }


  // =========================================================
  // SUBMIT
  // =========================================================

  onSubmit(): void {

    this.submit = true;


    // Form validation
    if (this.addEditAttachmentForm.invalid) {

      this.addEditAttachmentForm.markAllAsTouched();

      return;
    }


    // File validation
    if (!this.myFile || this.myFile.length === 0) {

      this.addEditAttachmentForm
        .get('abc')
        ?.setErrors({
          required: true
        });

      return;
    }


    this.showFiv = false;


    const productFormData =
      new FormData();


    // =======================================================
    // FILES
    // =======================================================

    for (const selectedFile of this.myFile) {

      productFormData.append(
        'abc',
        selectedFile
      );

    }
  productFormData.append(
    'Invoice',
    this.addEditAttachmentForm.get('Invoice')?.value || ''
  );

  
  productFormData.append(
    'AgencyDocument',
    this.addEditAttachmentForm.get('AgencyDocument')?.value || ''
  );

    // =======================================================
    // EXPENSE / DOCUMENT TYPE
    // =======================================================

    productFormData.append(
      'DocumentType',
      this.addEditAttachmentForm
        .get('DocumentType')
        ?.value || ''
    );


    // =======================================================
    // DESCRIPTION
    // =======================================================

    productFormData.append(
      'Description',
      this.addEditAttachmentForm
        .get('Description')
        ?.value?.trim() || ''
    );


    // =======================================================
    // ENTERED BY
    // =======================================================

    productFormData.append(
      'EnteredBy',
      this.addEditAttachmentForm
        .get('EnteredBy')
        ?.value || ''
    );


    console.log('FormData prepared');

    this._addProduct(productFormData);

  }


  // =========================================================
  // SAVE API
  // =========================================================

  private _addProduct(
    productData: FormData
  ): void {

    this.http
      .addEditFormData(
        ApiUrl.addAccountIngAttachement,
        productData
      )
      .subscribe({

        next: (data: any) => {

          console.log(
            'Upload Response:',
            data
          );


          this.showSuccess();


          // Close dialog
          this.dialogRef.close(true);

        },


        error: error => {

          console.error(
            'Upload Error:',
            error
          );


          this.showFiv = true;


          this.toastr.error(
            'File upload failed',
            'Error',
            {
              timeOut: 3000
            }
          );

        }

      });

  }


  // =========================================================
  // FILE SELECT
  // =========================================================

  onFileUpload(event: any): void {

    const selectedFiles =
      event.target.files;


    if (
      !selectedFiles ||
      selectedFiles.length === 0
    ) {

      this.myFile = [];
      this.files = null;

      this.addEditAttachmentForm
        .get('abc')
        ?.reset();

      return;
    }


    this.myFile = [];


    for (
      let i = 0;
      i < selectedFiles.length;
      i++
    ) {

      this.myFile.push(
        selectedFiles[i]
      );

    }


    // First file display
    this.files =
      this.myFile[0];


    this.addEditAttachmentForm
      .get('abc')
      ?.setValue(this.myFile);


    this.addEditAttachmentForm
      .get('abc')
      ?.markAsTouched();


    this.detail =
      this.files?.name || '';

  }


  // =========================================================
  // SUCCESS
  // =========================================================

  showSuccess(): void {

    this.toastr.success(
      'Data Save',
      'Save',
      {
        timeOut: 3000
      }
    );

    this.showFiv = true;

  }


  // =========================================================
  // CLOSE
  // =========================================================

  onNoClick1(): void {

    this.dialogRef.close(true);

  }


  // =========================================================
  // REFRESH
  // =========================================================

  changeLocation(): void {

    const currentRoute =
      this.router.url;

    this.router
      .navigateByUrl(
        '/',
        {
          skipLocationChange: true
        }
      )
      .then(() => {

        this.router.navigate([
          currentRoute
        ]);

      });

  }

}