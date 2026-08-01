import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummarayComponent } from './account-summaray.component';

describe('AccountSummarayComponent', () => {
  let component: AccountSummarayComponent;
  let fixture: ComponentFixture<AccountSummarayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSummarayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSummarayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
