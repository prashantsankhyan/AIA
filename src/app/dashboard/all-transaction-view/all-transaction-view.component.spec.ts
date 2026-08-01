import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTransactionViewComponent } from './all-transaction-view.component';

describe('AllTransactionViewComponent', () => {
  let component: AllTransactionViewComponent;
  let fixture: ComponentFixture<AllTransactionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTransactionViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllTransactionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
