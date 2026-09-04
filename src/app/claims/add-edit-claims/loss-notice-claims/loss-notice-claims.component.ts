import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { NgxPrintModule } from 'ngx-print';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { MaterialModule } from '../../../sharingModule/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AllApiService } from '../../../_service/all-api.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../../_core/apiUrl';
@Component({
  selector: 'app-loss-notice-claims',
  standalone: true,
   imports: [NgxPrintModule,CommonModule,MaterialModule,RouterModule,FormsModule ,],
  templateUrl: './loss-notice-claims.component.html',
  styleUrl: './loss-notice-claims.component.scss'
})
export class LossNoticeClaimsComponent {

ClaimID: any;
allList: any[] = [];

account: any;
ffNumber:any;
childPolicy: any;
carrier: any;
EnteredBy: string = '';
ClaimDescription:any;
isDataLoaded = false;

 currentTime:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:AllApiService,private router:ActivatedRoute,private cRouter:Router,public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }


     ngOnInit(): void {
       this.ClaimID = this.data.ClaimID
       const now = new Date();
      this.currentTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: '2-digit',
  day: '2-digit',
  year: 'numeric'
}).format(now);
       
       this.getLossNoticeData();
   
    
  }

    getLossNoticeData() {

  this.http.getAllDataId(ApiUrl.getLossNoticeClaimId,this.ClaimID).subscribe(data => {
    const obj: any = data;
    this.allList = obj.Claims;

    if (this.allList.length > 0) {
      const claim = this.allList[0];
     this.EnteredBy = claim.EnteredBy;
     this.ClaimDescription = claim.ClaimDescription;
     
      this.account = claim.AccountDetail?.[0];
      this.ffNumber =claim.AccountIdentificationDetail?.[0];
     
      this.childPolicy = claim.ChildPolicyDetail?.[0];
      this.carrier = claim.CarrierDetail?.[0];
    }
     this.isDataLoaded = true;
  });
} 

async fillPdf() {

  // const existingPdfBytes = await fetch('assets/Loss Notice Claim.pdf')
  const existingPdfBytes = await fetch('assets/Blank Loss Notice.pdf')
    .then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // const page = pdfDoc.getPages()[0];
  const pages = pdfDoc.getPages();

const page = pages[0];   // First page
const page1 = pages[1];  // Second page
const page2 = pages[2];  // Third page
const page3 = pages[3];  // Fourth page

   page.drawRectangle({
  x: 530,
  y: 762,
  width: 100,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page.drawText(this.EnteredBy ?? '', {
  x: 534,
  y: 762,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});

 page.drawRectangle({
  x: 530,
  y: 738,
  width: 45,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page.drawText(this.currentTime ?? '', {
  x: 530,
  y: 738,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


  page.drawRectangle({
  x: 460,
  y: 714,
  width: 60,
  height: 9,
  color: rgb(1, 1, 1) // White
});
const dateTime = this.allList[0].DateofLoss;
const date = dateTime.split(',')[0];
page.drawText(date, {
  x: 460,
  y: 715,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});



  page.drawRectangle({
  x: 530,
  y: 714,
  width: 30,
  height: 9,
  color: rgb(1, 1, 1) // White
});
const time = dateTime.split(',')[1].trim().substring(0, 5);
console.log('tim',time)
if (time =='12:00'){
  page.drawText('', {
  x: 530,
  y: 715,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


}
else{
   page.drawText(time, {
  x: 530,
  y: 715,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});
}





  page.drawRectangle({
  x: 566,
  y: 714,
  width: 10,
  height: 9,
  color: rgb(1, 1, 1) // White
});

if (time =='12:00'){
  
  const dateOfLoss = this.allList[0].DateofLoss;
console.log(dateOfLoss); // 07/16/2026, 06:15:30 AM

const isAM = dateOfLoss.trim().toUpperCase().endsWith('AM');
console.log(isAM); // Should be true
if (isAM) {
  // AM Box
  page.drawText('', {
    x: 568,
    y: 725,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
} else {
  // PM Box
  page.drawText('', {
    x: 568,
    y: 714, // Change this Y value to match your PM box
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
}
}else{
  const dateOfLoss = this.allList[0].DateofLoss;
console.log(dateOfLoss); // 07/16/2026, 06:15:30 AM

const isAM = dateOfLoss.trim().toUpperCase().endsWith('AM');
console.log(isAM); // Should be true

if (isAM) {
  // AM Box
  page.drawText('X', {
    x: 568,
    y: 725,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
} else {
  // PM Box
  page.drawText('X', {
    x: 568,
    y: 714, // Change this Y value to match your PM box
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
}


}

page.drawRectangle({
  x: 308,
  y: 690,
  width: 220,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page.drawText(this.carrier?.CarrierName ?? '', {
  x: 308,
  y: 690,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


page.drawRectangle({
  x: 307,
  y: 665,
  width: 220,
  height: 10,
  color: rgb(1, 1, 1) // White
});
page.drawText(this.childPolicy.ChildPolicyName ?? '', {
  x: 308,
  y: 667,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


page.drawRectangle({
  x: 545,
  y: 690,
  width: 40,
  height: 9,
  color: rgb(1, 1, 1),
});

page.drawText( this.carrier.NAIC ?? '', {
  x: 550,      // Inside the rectangle
  y: 690,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});

page.drawRectangle({
  x: 308,
  y: 557,
  width: 220,
  height: 25,
  color: rgb(1, 1, 1) // White
});
page.drawText( this.account.Description ?? '', {
  x: 307,
  y: 564,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});

page.drawText(`${this.account?.City ?? ''} ${this.account?.State ?? ''} ${this.account?.ZIP ?? ''}`, {
  x: 307,
  y: 555, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});


page.drawRectangle({
  x: 393,
  y: 533,
  width: 180,
  height: 10,
  color: rgb(1, 1, 1) // White
});

page.drawText(this.account?.EmailID ?? '', {
  x: 393,
  y: 533, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});


page.drawRectangle({
  x: 20,
  y: 569,
  width: 250,
  height: 13,
  color: rgb(1, 1, 1) // White
});

page.drawText(this.account?.AccountName ?? '', {
  x: 20,
  y: 570, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});

page.drawRectangle({
  x: 92,
  y: 605,
  width: 100,
  height: 9,
  color: rgb(1, 1, 1) // White
});
page.drawText(this.account?.LookUpCode ?? '', {
  x: 92,
  y: 605, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});


page.drawRectangle({
  x: 102,
  y: 545,
  width: 50,
  height: 10,
  color: rgb(1, 1, 1) // White
});
page.drawText(this.ffNumber?.IdentificationNumber ?? '', {
  x: 102,
  y: 545, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});


page.drawRectangle({
  x: 20,
  y: 521,
  width: 80,
  height: 9,
  color: rgb(1, 1, 1) // White
});
page.drawText(this.account?.PhoneNumber ?? '', {
  x: 20,
  y: 524, 
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});


page.drawRectangle({
  x: 20,
  y: 322,
  width: 220,
  height: 33,
  color: rgb(1, 1, 1) // White
});

// page.drawText(this.ClaimDescription ?? '', {
//   x: 20,
//   y: 322, 
//   size: 9,
//   font: boldFont,
//   color: rgb(0, 0, 0),
// });

// const claimDescription = (this.ClaimDescription ?? '')
//   .replace(/\r\n/g, '\n') // Normalize line endings
//   .split('\n')
//   .map((line:any) => line.replace(/[ \t]+/g, ' ').trim()) // Remove extra spaces but keep lines
//   .filter((line:any) => line !== ''); // Remove empty lines

// let y = 322;

// claimDescription.forEach((line:any) => {
//   page.drawText(line, {
//     x: 20,
//     y,
//     size: 9,
//     font: boldFont,
//     color: rgb(0, 0, 0),
//   });

//   y -= 11; // Adjust line spacing as needed
// });

const MAX_WIDTH = 580;
const START_Y = 346;
const END_Y = 210;

const MM_TO_POINTS = 1.53465;
const PARAGRAPH_SPACE = 1 * MM_TO_POINTS; // 6 mm = 17.01 points

let fontSize = 11;

function getWrappedLines(text: string, font: any, size: number): string[] {
  const lines: string[] = [];

  const paragraphs = (text || '')
    .replace(/\r\n/g, '\n')
    .split('\n');

  for (const para of paragraphs) {

    // Blank line = paragraph spacing
    if (!para.trim()) {
      lines.push('__SPACE__');
      continue;
    }

    const words = para.trim().split(/\s+/);

    let line = '';

    for (const word of words) {

      const testLine = line ? `${line} ${word}` : word;

      if (font.widthOfTextAtSize(testLine, size) <= MAX_WIDTH) {
        line = testLine;
      } else {

        if (line) {
          lines.push(line);
        }

        line = word;
      }
    }

    if (line) {
      lines.push(line);
    }
  }

  return lines;
}

// Wrap the text
let lines = getWrappedLines(
  this.ClaimDescription ?? '',
  boldFont,
  fontSize
);

// Reduce font size until everything fits
while (fontSize > 6) {

  const finalLineHeight = fontSize + 2;

  let requiredHeight = 0;

  for (const line of lines) {
    if (line === '__SPACE__') {
      requiredHeight += PARAGRAPH_SPACE;
    } else {
      requiredHeight += finalLineHeight;
    }
  }

  if (requiredHeight <= (START_Y - END_Y)) {
    break;
  }

  fontSize -= 0.5;

  lines = getWrappedLines(
    this.ClaimDescription ?? '',
    boldFont,
    fontSize
  );
}

// Draw
const finalLineHeight = fontSize + 2;

let y = START_Y;

for (const line of lines) {

  if (y < END_Y) {
    break;
  }

  // Paragraph spacing
  if (line === '__SPACE__') {
    y -= PARAGRAPH_SPACE;
    continue;
  }

  page.drawText(line, {
    x: 20,
    y,
    size: fontSize,
    font: boldFont,
  });

  y -= finalLineHeight;
}

   page1.drawRectangle({
  x: 540,
  y: 750,
  width: 100,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page1.drawText(this.EnteredBy ?? '', {
x: 543,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


  page1.drawRectangle({
  x: 412,
  y: 750,
  width: 60,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page1.drawText(this.account?.LookUpCode ?? '', {
  x: 412,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});

  page1.drawRectangle({
  x: 20,
  y: 29,
  width: 200,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page1.drawText(this.account?.AccountName ?? '', {
x: 20,
  y: 30,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});


  page1.drawRectangle({
  x: 307,
  y: 29,
  width: 30,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page1.drawText(this.EnteredBy ?? '', {
x: 307,
  y: 30,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});



   page2.drawRectangle({
  x: 540,
  y: 750,
  width: 100,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page2.drawText(this.EnteredBy ?? '', {
x: 543,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});
  page3.drawRectangle({
  x: 540,
  y: 750,
  width: 100,
  height: 9,
  color: rgb(1, 1, 1) // White
});
  page2.drawRectangle({
  x: 412,
  y: 750,
  width: 60,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page2.drawText(this.account?.LookUpCode ?? '', {
  x: 412,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});

 page3.drawRectangle({
  x: 412,
  y: 750,
  width: 60,
  height: 9,
  color: rgb(1, 1, 1) // White
});

page3.drawText(this.account?.LookUpCode ?? '', {
  x: 412,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0),
});
page3.drawText(this.EnteredBy ?? '', {
x: 543,
  y: 750,
  size: 9,
  font: boldFont,
  color: rgb(0, 0, 0)
});






  const pdfBytes = await pdfDoc.save();

const blob = new Blob(
  [pdfBytes.buffer as ArrayBuffer],
  { type: 'application/pdf' }
);
  const url = URL.createObjectURL(blob);

  const a=document.createElement('a');
  a.href=url;
  a.download='Loss Notice';
  a.click();
}
}
