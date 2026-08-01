import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCertsPdfConverterComponent } from './new-certs-pdf-converter.component';

describe('NewCertsPdfConverterComponent', () => {
  let component: NewCertsPdfConverterComponent;
  let fixture: ComponentFixture<NewCertsPdfConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCertsPdfConverterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCertsPdfConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
