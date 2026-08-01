import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../sharingModule/material/material.module';
import { ApiUrl } from '../_core/apiUrl';
import { AllApiService } from '../_service/all-api.service';
type PeriodType = 'daily' | 'weekly' | 'monthly';
@Component({
  selector: 'app-login-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-details.component.html',
  styleUrl: './login-details.component.scss'
})
export class LoginDetailsComponent {
 showSpinner = false;
  searchText = '';
  selectedPeriod: PeriodType = 'daily';

  listOfData: any[] = [];
  originalList: any[] = [];

  constructor(
    private api: AllApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData('daily');
  }

  // ===============================
  // API
  // ===============================
  loadData(period: PeriodType): void {
    this.selectedPeriod = period;
    this.showSpinner = true;

    const apiMap = {
      daily: ApiUrl.loginDaily,
      weekly: ApiUrl.loginWeekly,
      monthly: ApiUrl.loginMonthly
    };

    this.api.getAllData(apiMap[period]).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        this.originalList = res?.Data?.LoginDetail ?? [];
        this.listOfData = [...this.originalList];
        this.cdr.detectChanges();
      },
      error: () => {
        this.showSpinner = false;
        this.listOfData = [];
      }
    });
  }

  // ===============================
  // FILTER
  // ===============================
  applyFilter(): void {
    const text = this.searchText.toLowerCase();
    this.listOfData = this.originalList.filter(x =>
      x.LoginDetails?.some((d: any) =>
        d.UserName?.toLowerCase().includes(text)
      )
    );
  }

  resetFilter(): void {
    this.searchText = '';
    this.listOfData = [...this.originalList];
  }

  // ===============================
  // UTIL
  // ===============================
  formatDate(date: string | null): string {
    return date
      ? new Date(date).toLocaleString('en-IN')
      : 'Active';
  }

}
