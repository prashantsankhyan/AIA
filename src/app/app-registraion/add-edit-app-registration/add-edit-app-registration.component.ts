import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../../_service/all-api.service';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../_core/apiUrl';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-add-edit-app-registration',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './add-edit-app-registration.component.html',
  styleUrl: './add-edit-app-registration.component.scss'
})
export class AddEditAppRegistrationComponent {
  showSpiner = true
  addEditRegistrationForm!:FormGroup ;
  submit = false ;
  loginId =''
 
  alertMessage =''
  errorMessage ='';
  messageSuccess = true;
  showTeamType = false;
  listOfAllInsuredData:any =[];
  selectedEmail='';
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder, private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,public dialog: MatDialog,public dialogRef: MatDialogRef<AddEditAppRegistrationComponent>){
 
  }
  ngOnInit(): void {
    this.getInsuredData();
    this.makeForm();
   
    // this.load()
  
   
  }

  getInsuredData(){
    this.http.getAllData(ApiUrl.getAllInsuredAccount).subscribe(
      data=>{
        let respone = JSON.stringify(data)
        let obj = JSON.parse(respone)
        // const email = obj.Accounts[0]?.EmailID;
        // alert(email)
        this.listOfAllInsuredData = obj.Accounts

      }
    )
  }
  onAccountSelect(event: any) {
    const accountID = event.target.value;  // Extract the selected value from the event
  console.log('Selected Account ID:', accountID);  // This should now log the correct AccountID

  // Find the selected account based on the AccountID
  const selectedAccount = this.listOfAllInsuredData.find(
    (account: any) => account.AccountID === parseInt(accountID)  // Ensure parsing if needed
  );

  console.log('Selected Account:', selectedAccount);  // Log the selected account

  // Extract the email from the selected account
  this.selectedEmail = selectedAccount?.EmailID || 'No email found';

  // Log or display the selected email
  console.log('Selected Email:', this.selectedEmail);
  }
  

  makeForm() {
    this.addEditRegistrationForm = this.fb.group({
      LoginID: ['0'],
      AccountID: ['', [Validators.required]],
      UserName: [this.selectedEmail],
      Password: [''],
     
    });
  
    
    // this.addEditRegistrationForm.get('Team')?.valueChanges.subscribe(team => {
      
    //   if (team === "Submission Team") {
    //     this.showTeamType = true;
       
       
    //     this.addEditRegistrationForm.get('TeamType')?.setValidators([Validators.required]);
    //   } else {
    //     this.showTeamType = false;
       
    //     this.addEditRegistrationForm.get('TeamType')?.setValidators(null);
    //   }
      
    //   this.addEditRegistrationForm.get('TeamType')?.updateValueAndValidity();
    // });
  }
  // teamTypeFieldInvalid(): boolean {
  //   const field = this.addEditRegistrationForm.get('TeamType');
  //   return !!field && field.invalid && (field.dirty || field.touched );
  // }

  load(){
    this.loginId = this.data.LoginID
     if(this.loginId == undefined){

     }
     else{
      let data  = this.data;
      let response  = JSON.stringify(data)
      let obj  = JSON.parse(response)
      this.addEditRegistrationForm.controls['loginId'].setValue(obj.loginId)
      this.addEditRegistrationForm.controls['Team'].setValue(obj.Team)
      this.addEditRegistrationForm.controls['UserName'].setValue(obj.UserName)
      this.addEditRegistrationForm.controls['Password'].setValue(obj.Password)
      this.addEditRegistrationForm.controls['EmailID'].setValue(obj.EmailID)

     }
  }


  onSubmit() {
    this.submit = true ; 
    this.messageSuccess = false;
    if(!this.addEditRegistrationForm.valid){
      this.messageSuccess = true
      return
    }


   
   let obj = JSON.parse(JSON.stringify(this.addEditRegistrationForm.value))
    if(this.loginId){
      obj['loginId'] = this.loginId
     
    }
     
    console.log('loginId',obj)
    this.http.addEditData(ApiUrl.createUser,obj).pipe().subscribe(
      data => {
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);

        if(obj.Data.Response == '1'){
          this.alertMessage =obj.Data.ErrorMessage;
          this.showSuccess()
        }
        else{
          this.alertMessage =obj.Data.ErrorMessage;
          this.toastr.error(this.alertMessage, '' ,{
            timeOut: 3000,
          });
          this.messageSuccess = true
          

        }
       
       
        
        

       

       
        
      }
    
    )
  }

  showSuccess() {
    this.toastr.success(this.alertMessage, '' ,{
      timeOut: 3000,
    });
    this.messageSuccess = true
    
    this.changeLocation();
    this.cancleModel()
    
  } 

  error() {
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    
  }
  get f() {
    return this.addEditRegistrationForm.controls;
    
  }

  cancleModel(): void {
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
