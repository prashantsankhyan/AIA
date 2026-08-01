import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../sharingModule/material/material.module';



import { SpinnerComponent } from '../spinner/spinner.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllApiService } from '../_service/all-api.service';
import { ApiUrl } from '../_core/apiUrl';
import { timeout, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { SaveLoginUserService } from '../_service/save-login-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

     private userInteracted = false;
     
  showSpiner = true
  confirmLogin!:FormGroup ;
  confirmLogin1!:FormGroup ;

  submit = false ;
  alertMessage =''
  errorMessage ='';
  messageSuccess = true;
  weatherData: any;
  backgroundClass: string = 'default';
  showWrongPassword = false;
  dispalyFull = true;
  loginDone = false;
  alredyExitMesssgae = false
  waitingMessage = false
 currentTime: Date = new Date();
private timeInterval: any;
loginId!: number | string;

 
  constructor(private fb: FormBuilder,private saveUserPassword:SaveLoginUserService ,private http:AllApiService,private toastr: ToastrService ,private cRouter:ActivatedRoute,private router: Router,){
 
  }
  ngOnInit(): void {
  
    localStorage.removeItem('TeamType');
      window.addEventListener('storage', this.handleStorageChange);
   
    this.makeForm();
    this.issueMail();
    this.nonIssueMail();
    this.startClock();
  }

  // Listen for any user interaction on the document
 
  

startClock() {
  this.timeInterval = setInterval(() => {
    this.currentTime = new Date();
  }, 1000); // updates every second
}



  makeForm(){
   
    this.confirmLogin = this.fb.group({
      UserName:[''],
      Password:['',],
      
    });
  }
//   handleStorageChange(event: StorageEvent): void {
//   if (event.key === 'TeamType' && event.newValue) {
    
//     this.router.navigate(['/alertLogin']);
//   }
// }
handleStorageChange = (event: StorageEvent) => {
  if (event.storageArea === localStorage && event.key === 'TeamType' && event.newValue) {
    // Only react if it's from another tab
    if (!document.hasFocus()) {
      this.router.navigate(['/alertLogin']);
    }
  }
}

 
  onKeydown(event: KeyboardEvent) {
    
    if (event.key === 'Tab' && this.confirmLogin.valid) {
      this.onSubmit();
    }
  
  }


  onSubmit() {
     this.waitingMessage = true
    this.submit = true ; 
    this.messageSuccess = false;
   
    if(!this.confirmLogin.valid){
      this.messageSuccess = true;
      this.waitingMessage = false
      return
    }
   let obj = JSON.parse(JSON.stringify(this.confirmLogin.value))
   
    this.http.addEditData(ApiUrl.LogingHere,obj).pipe(timeout(60000), // 1 minute timeout
    catchError((error) => {
      // Handle timeout or network errors here
      if (error.name === 'TimeoutError') {
        this.errorMessage = 'The request timed out. Please check your internet connection.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
      // this.showSpinner = false; // Hide the spinner
      this.error(); // Show error message
      return throwError(error); // Propagate the error
    })).subscribe(
      data => {
        
       this.waitingMessage = false
        
        let response  = JSON.stringify(data)
        var obj = JSON.parse(response);
        console.log(obj)
       

        if(obj.Response == '1'){
         this.dispalyFull = false;
         this.loginDone = true
          
          this.clearTeamName()
          this.loginId =obj.LoginDetail[0].LoginID
        
        
          let teamName =obj.LoginDetail[0].Team
          let Password =obj.LoginDetail[0].Password
          let UserName =obj.LoginDetail[0].UserName
          let TeamType =obj.LoginDetail[0].TeamType
          console.log('TeamName from server:', `"${teamName}"`);
         
          localStorage.setItem('teamName',teamName)
          sessionStorage.setItem('Password',Password)
          sessionStorage.setItem('UserName',UserName)
          localStorage.setItem('TeamType','asdkjhkdjhdkjhkjshkaskja')
          this.saveLoginTime();
         
          this.messageSuccess = true;
        
          //  setTimeout(() => {
              
             
          //     this.router.navigate(['/dashboard'])
          //      this.saveUserData()
          //    }, 5000); 

 this.saveUserData();

this.router.navigate(['/dashboard'])


  
        }
        else{

          if(obj.ErrorMessage ==='Already Login To Another Machine'){
             this.alredyExitMesssgae = true
          }
        this.showWrongPassword = true;
         this.dispalyFull = false;

         setTimeout(() => {
         this.showWrongPassword = false;
         this.dispalyFull = true;

          this.router.navigate(['/login']); // Redirect after 15 seconds
         }, 5000); // 15,000 ms = 15 seconds
         
        

           this.messageSuccess = true;
         
        
       

          

        }
 
      }
    
    )
  }

 
  get f() {
    return this.confirmLogin.controls;
    
  }
  

  saveUserData(): void {
    if (this.confirmLogin.valid) {
      const userData = {
        UserName: this.confirmLogin.value.UserName,
        Password: this.confirmLogin.value.Password
      };
      
     
      // this.toastr.success('User data saved successfully');
      this.saveUserPassword.perform(userData);
    } else {
      this.toastr.error('Please fill the form correctly');
    }
  }

saveLoginTime() {

  if (!this.loginId) {
    console.error('LoginID not available');
    return;
  }

  const payload = {
    LoginID: this.loginId,
    Login_StartDateTime: this.currentTime.toISOString()
  };

  console.log('Payload:', payload);

  this.http.addEditDataDetail(ApiUrl.loginStartDate, payload)
    .subscribe({
      next: (res) => {
        console.log('Login time saved successfully', res);
      },
      error: (err) => {
        console.error('Failed to save login time', err);
      }
    });
}




  clearTeamName(){
    localStorage.removeItem('teamName');
    localStorage.removeItem('accountId')
    localStorage.removeItem('accountName')
    localStorage.removeItem('MarkedPolicyID')
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('IsChildPolicyExist')
    localStorage.removeItem('lookUpCode')
    localStorage.removeItem('emailID')
    localStorage.removeItem('phoneNumber')
    sessionStorage.removeItem('Password')
    sessionStorage.removeItem('UserName')
    localStorage.removeItem('TeamType')
    localStorage.removeItem('EndorsementID');
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('MarkedPolicyID')
   
    localStorage.removeItem('ChildPolicyID')
    localStorage.removeItem('EndorsementID')
    localStorage.removeItem('marketedName')
    localStorage.removeItem('IsChildPolicyExist')
    localStorage.removeItem('Yard_Address')
    localStorage.removeItem('No_of_Driver')
    localStorage.removeItem('No_of_Unit')
    localStorage.removeItem('PolicyType')
    localStorage.removeItem('Yard_Address')

  }

  issueMail(){
    this.http.getPost(ApiUrl.issueMail).subscribe(data=>{
      let response = JSON.stringify(data)
      let obj = JSON.parse(response)

    })
  }

  
  nonIssueMail(){
    this.http.getPost(ApiUrl.nonIssueMail).subscribe(data=>{
      let response = JSON.stringify(data)
      let obj = JSON.parse(response)

    })
  }
 nevigateToLogot(){
   this.router.navigate(['/delete']); 

 }
  error() { 
    this.toastr.error(this.errorMessage, '' ,{
      timeOut: 3000,
    });
    
  }
  
}
