import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmClaimComponent } from './confirm-claim.component';

describe('ConfirmClaimComponent', () => {
  let component: ConfirmClaimComponent;
  let fixture: ComponentFixture<ConfirmClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
