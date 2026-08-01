import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import saveAs from 'file-saver';
import { NgxPrintModule } from 'ngx-print';

import { PDFDocument } from 'pdf-lib';
import { AllApiService } from '../../../_service/all-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../_core/apiUrl';


@Component({
  selector: 'app-db',
  standalone: true,
  imports: [CommonModule,NgxPrintModule,FormsModule],
  templateUrl: './db.component.html',
  styleUrl: './db.component.scss'
})
export class DBComponent {
 
  // =========================
  // 🔹 STATE
  // =========================
  showSpiner = true;

  accountId: any;
  MarkedPolicyId: any;
  ChildPolicyID: any;

  listOfData: any = {};
  listOfCommodity: any[] = [];

  vehicleDetails: any[] = [];
  driverDetails: any[] = [];

  primacryName: any = {};
  ClientSummary: any = {};

  selectedOption: string = '';

  constructor(
    private http: AllApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // =========================
  // 🚀 INIT
  // =========================
  ngOnInit() {
    this.initSession();
    this.getListOfData();
  }

  private initSession() {
    this.accountId = JSON.parse(localStorage.getItem('accountId') || '{}');
    this.MarkedPolicyId = localStorage.getItem('MarkedPolicyID');
    this.ChildPolicyID = localStorage.getItem('ChildPolicyID');
  }

  // =========================
  // 🔥 API CALL
  // =========================
  getListOfData() {
    this.showSpiner = true;

    this.http.getAllDataByThreId(
      ApiUrl.getDataForAttachSmallAccountFile,
      this.accountId,
      this.MarkedPolicyId,
      this.ChildPolicyID
    ).subscribe({
      next: (res: any) => {
        this.showSpiner = false;

        // ✅ Handle nested response safely
        this.listOfData = res?.AccountName ? res : (res?.Data || {});

        this.primacryName = this.listOfData?.AccountPrimaryDetail || {};
        this.ClientSummary = this.listOfData?.ClientSummary || {};

        this.vehicleDetails = this.listOfData?.Vehicles || [];
        this.driverDetails = this.listOfData?.Drivers || [];

        this.setBusinessType(this.listOfData?.AccountName);

        this.getCommodity();
      },

      error: () => {
        this.showSpiner = false;
        this.toastr.error('Failed to load data');
      }
    });
  }

  // =========================
  // 📦 COMMODITY API
  // =========================
  getCommodity() {
    this.http.getAllDataByTwoId(
      ApiUrl.GetAllCommodityByChildandMarkedPolicyID,
      this.MarkedPolicyId,
      this.ChildPolicyID
    ).subscribe((res: any) => {
      this.listOfCommodity = res?.Commodity || [];
    });
  }

  // =========================
  // 🧠 HELPERS
  // =========================
  clean(val: any): string {
    return (val || '').toString().trim();
  }

  setBusinessType(name: string) {
    const val = (name || '').toLowerCase();

    if (val.endsWith('inc')) this.selectedOption = 'Corporation';
    else if (val.endsWith('llc')) this.selectedOption = 'LLC';
    else if (val.endsWith('partnership')) this.selectedOption = 'Partnership';
    else this.selectedOption = 'Individual';
  }

  // =========================
  // 🧾 PDF GENERATION
  // =========================
async getDataAndFillPdf() {

  if (!this.listOfData?.AccountName) {
    this.toastr.warning('Data not loaded yet!');
    return;
  }

  try {
    const pdfBytes = await fetch('assets/DB APP.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // ✅ FIX: Extract first item from arrays
    const primary = this.listOfData?.AccountPrimaryDetail?.[0] || {};
    const summary = this.listOfData?.ClientSummary?.[0] || {};

    // =========================
    // 🧾 GENERAL INFO
    // =========================
    form.getTextField('Text364')?.setText(this.clean(this.listOfData?.AccountName));
     form.getTextField('Text365')?.setText(this.clean(this.listOfData?.BDA));
     
    form.getTextField('Text358')?.setText(this.clean(this.listOfData?.EmailID));

    // ✅ FIXED ADDRESS
    form.getTextField('Text376')?.setText(this.clean(this.listOfData?.Description));
    form.getTextField('Text378')?.setText(this.clean(this.listOfData?.City));
    form.getTextField('Text379')?.setText(this.clean(this.listOfData?.State));
    form.getTextField('Text380')?.setText(this.clean(this.listOfData?.ZIP));

    // ✅ FIXED NAME + PHONE
    form.getTextField('Text386')?.setText(this.clean(primary?.Name));
    form.getTextField('Text388')?.setText(this.clean(this.listOfData?.PhoneNumber));

    // =========================
    // 💰 COVERAGE
    // =========================
    form.getTextField('Text390')?.setText(this.clean(summary?.LiabilityLimit));

    // =========================
    // 🚛 VEHICLES (SAFE)
    // =========================
    (this.vehicleDetails || []).slice(0, 5).forEach((v: any, i: number) => {
      const base = 459 + (i * 7);

      form.getTextField(`Text${base}`)?.setText(this.clean(v?.Year));
      form.getTextField(`Text${base + 1}`)?.setText(this.clean(v?.Make));
      form.getTextField(`Text${base + 2}`)?.setText(this.clean(v?.BodyType));
      form.getTextField(`Text${base + 3}`)?.setText(this.clean(v?.VIN));
      form.getTextField(`Text${base + 5}`)?.setText(this.clean(v?.Value));
    });

    // =========================
    // 👨‍✈️ DRIVERS (SAFE)
    // =========================
    (this.driverDetails || []).slice(0, 5).forEach((d: any, i: number) => {
      const base = 525 - (i * 4);

      // form.getTextField(`Text${base}`)?.setText(this.clean(d?.Name));
      // form.getTextField(`Text${base + 1}`)?.setText(this.clean(d?.DOB));
      // form.getTextField(`Text${base + 2}`)?.setText(this.clean(d?.LicenseNumber));
    });

    // =========================
    // 🔘 BUSINESS TYPE
    // =========================
    const radio = form.getRadioGroup('Radio Button366');
    if (this.selectedOption === 'Corporation') radio?.select('1');
    if (this.selectedOption === 'LLC') radio?.select('2');
    if (this.selectedOption === 'Partnership') radio?.select('3');

    // =========================
    // 📦 COMMODITIES
    // =========================
    (this.listOfCommodity || []).slice(0, 5).forEach((c: any, i: number) => {
      const base = 440 - (i * 3);

      form.getTextField(`Text${base}`)?.setText(this.clean(c?.Type));
      form.getTextField(`Text${base - 1}`)?.setText(this.clean(c?.Total));
    });

    // =========================
    // 💾 SAVE
    // =========================
    const pdfBytesFinal = await pdfDoc.save();

    const blob = new Blob(
      [new Uint8Array(pdfBytesFinal)],
      { type: 'application/pdf' }
    );

    saveAs(blob, 'DB-APP-Filled.pdf');

  } catch (err) {
    console.error(err);
    this.toastr.error('PDF generation failed');
  }
}
}
