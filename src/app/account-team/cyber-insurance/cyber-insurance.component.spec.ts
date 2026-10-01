import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberInsuranceComponent } from './cyber-insurance.component';

describe('CyberInsuranceComponent', () => {
  let component: CyberInsuranceComponent;
  let fixture: ComponentFixture<CyberInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyberInsuranceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CyberInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
