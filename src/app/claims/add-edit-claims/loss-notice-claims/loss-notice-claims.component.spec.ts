import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossNoticeClaimsComponent } from './loss-notice-claims.component';

describe('LossNoticeClaimsComponent', () => {
  let component: LossNoticeClaimsComponent;
  let fixture: ComponentFixture<LossNoticeClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LossNoticeClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LossNoticeClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
