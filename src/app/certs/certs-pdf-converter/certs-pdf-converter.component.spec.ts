import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsPdfConverterComponent } from './certs-pdf-converter.component';

describe('CertsPdfConverterComponent', () => {
  let component: CertsPdfConverterComponent;
  let fixture: ComponentFixture<CertsPdfConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsPdfConverterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsPdfConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
