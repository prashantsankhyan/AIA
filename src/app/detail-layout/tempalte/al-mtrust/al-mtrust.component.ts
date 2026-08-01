import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllApiService } from '../../../_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { NgxPrintModule } from 'ngx-print';
import { TemolateNaveComponent } from '../temolate-nave/temolate-nave.component';


@Component({
  selector: 'app-al-mtrust',
  standalone: true,
  imports: [CommonModule,MaterialModule,NgxPrintModule],
  templateUrl: './al-mtrust.component.html',
  styleUrl: './al-mtrust.component.scss'
})
export class AlMtrustComponent {

}
