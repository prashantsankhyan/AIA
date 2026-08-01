import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRenewPolicyForLossRunComponent } from './list-of-renew-policy-for-loss-run.component';

describe('ListOfRenewPolicyForLossRunComponent', () => {
  let component: ListOfRenewPolicyForLossRunComponent;
  let fixture: ComponentFixture<ListOfRenewPolicyForLossRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfRenewPolicyForLossRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRenewPolicyForLossRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
