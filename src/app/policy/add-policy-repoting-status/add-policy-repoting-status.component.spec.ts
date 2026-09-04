import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolicyRepotingStatusComponent } from './add-policy-repoting-status.component';

describe('AddPolicyRepotingStatusComponent', () => {
  let component: AddPolicyRepotingStatusComponent;
  let fixture: ComponentFixture<AddPolicyRepotingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPolicyRepotingStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPolicyRepotingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
