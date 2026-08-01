import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsForRenewComponent } from './account-details-for-renew.component';

describe('AccountDetailsForRenewComponent', () => {
  let component: AccountDetailsForRenewComponent;
  let fixture: ComponentFixture<AccountDetailsForRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailsForRenewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountDetailsForRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
