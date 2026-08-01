import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_service/all-api.service';


@Component({
  selector: 'app-view-remakrs-accout-base',
  standalone: true,
imports: [ CommonModule,
    MatButtonModule,SpinnerComponent],
  templateUrl: './view-remakrs-accout-base.component.html',
  styleUrl: './view-remakrs-accout-base.component.scss'
})
export class ViewRemakrsAccoutBaseComponent {
owSpinner = false;
accountId :any;
listOfRemarks:any =[];
showSpinner =true
listOfRemarksFormatted: { key: string, value: string }[][] = []; // add this to your component

   constructor(
    private http: AllApiService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService ,
  ) {}
  ngOnInit(): void { 
     this.accountId = localStorage.getItem('accountId');
   this.getListOfRemarks()
  }

  getListOfRemarks() {
  this.showSpinner = true;

  this.http.getAllDataId(ApiUrl.getRemarksById, this.accountId).subscribe({
    next: (res: any) => {
      this.showSpinner = false;
      const rawRemarks = res?.Brokers || [];
      this.listOfRemarks = rawRemarks;

      if (this.listOfRemarks.length > 0) {
        const latestRemark = this.listOfRemarks[this.listOfRemarks.length - 1];
        // this.addEditRemarksForm.reset(); // Clear old values
        // this.patchForm(latestRemark);
      }

      // Transform for display: key-value filtering null/empty
      this.listOfRemarksFormatted = rawRemarks.map((broker: any) =>
        Object.keys(broker)
          .filter(key => broker[key] !== null && broker[key] !== '')
          .map(key => ({ key, value: broker[key] }))
      );
    },
    error: (err) => {
      console.error('Failed to fetch remarks:', err);
      this.showSpinner = false;
    }
  });
}

isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
getUnitLabel(field: string): string {
  const unitMap: { [key: string]: string } = {
    TrailerInterchange: 'units',
    Trailer_limit: 'units',
    MTC: 'USD',
    // Add more if needed
  };
  return unitMap[field] || '';
}
}
