import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-google-shteet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-shteet.component.html',
  styleUrl: './google-shteet.component.scss'
})
export class GoogleShteetComponent {
 private http = inject(HttpClient);

  // Replace this with your Apps Script URL
  apiUrl = 'https://script.google.com/macros/s/AKfycbzt9bF0YYQCEQUHzTjWERwjhEJgOeFLz7_VfmuE_DSrQR5eN582kJHncLdDF6asMEuS8g/exec';

  employees: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log(data);
        this.employees = data;
      },
      error: (err) => {
        console.error('Error loading Google Sheet', err);
      }
    });
  }
}
