import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AudioRecordingService } from '../audio-recording.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';


import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { AllApiService } from '../../_service/all-api.service';
import { ApiUrl } from '../../_core/apiUrl';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../spinner/spinner.component';




@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.scss'
})
export class AddNoteComponent {
  isRecording = false;
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
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
   password:any;
   nameOfAccount:any;
  constructor(private audioRecordingService: AudioRecordingService, private cd: ChangeDetectorRef,@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddNoteComponent>) { }

  ngOnInit() {
    this.accountId =this.data.AccountId;
    this.nameOfAccount = this.data.nameOfAccount;
    this.userName = sessionStorage.getItem('UserName');
    this.password = sessionStorage.getItem('Password');
   
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.audioURL = window.URL.createObjectURL(blob);
      this.audioPlayer.nativeElement.src = this.audioURL;
      this.cd.detectChanges();
    });
    this.makeForm()
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
    
  }


  makeForm(){
    this.addEditAttachmentForm = this.fb.group({
      abc:['',[Validators.required,]],
      AccountID:[this.accountId,[Validators.required,]],
      FolderID:['1',],
      UserName:[this.userName],
      Password:[this.password],
     
      
      
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
    productFormData.append('UserName',this.addEditAttachmentForm.get('UserName')?.value);
    productFormData.append('Password',this.addEditAttachmentForm.get('Password')?.value);
    // productFormData.append('EnteredBy',this.addEditAttachmentForm.get('EnteredBy')?.value);

    // Object.keys(this.productForm).map((key) =>{
    //   productFormData.append(key,this.productForm[key].value);
    // });
    
    
    this._addProduct(productFormData);
  
  }



    private _addProduct(productData: FormData): void {
      this.changeLocation()
    this.http.addEditFormData(ApiUrl.addNote,productData).pipe().subscribe(
        data => {

         this.changeLocation()
         const response  = JSON.stringify(data) ;
         const  obj   = JSON.parse(response) ;
        
        this.close()
         
      
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


  



  get f() {
    return this.addEditAttachmentForm.controls; }
  
    close(): void {
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
