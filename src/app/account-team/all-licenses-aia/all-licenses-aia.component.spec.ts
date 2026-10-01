import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLicensesAiaComponent } from './all-licenses-aia.component';

describe('AllLicensesAiaComponent', () => {
  let component: AllLicensesAiaComponent;
  let fixture: ComponentFixture<AllLicensesAiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLicensesAiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllLicensesAiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
