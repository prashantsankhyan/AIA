import { Component } from '@angular/core';
import { NavbarEndorsementComponent } from './navbar-endorsement/navbar-endorsement.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../sharingModule/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-endorsement',
  standalone: true,
  imports: [ CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,NavbarEndorsementComponent],
  templateUrl: './endorsement.component.html',
  styleUrl: './endorsement.component.scss'
})
export class EndorsementComponent {


  
}
