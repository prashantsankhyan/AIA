import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { AllApiService } from '../../_service/all-api.service';




@Component({
  selector: 'app-display-carrier-and-broker-mg',
  standalone: true,
  imports: [CommonModule,MaterialModule,RouterOutlet,RouterModule,RouterLink,ReactiveFormsModule,FormsModule],
  templateUrl: './display-carrier-and-broker-mg.component.html',
  styleUrl: './display-carrier-and-broker-mg.component.scss'
})
export class DisplayCarrierAndBrokerMGComponent {
  brokerName:any;
  carrirName:any;



  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,public dialogRef: MatDialogRef<DisplayCarrierAndBrokerMGComponent>,private router:Router,private toastr: ToastrService) { }
  ngOnInit(): void {
    this.data;
    this.brokerName = this.data.broker
    this.carrirName = this.data.carriers
    
  }
}
