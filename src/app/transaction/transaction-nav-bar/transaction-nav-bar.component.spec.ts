import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionNavBarComponent } from './transaction-nav-bar.component';

describe('TransactionNavBarComponent', () => {
  let component: TransactionNavBarComponent;
  let fixture: ComponentFixture<TransactionNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
