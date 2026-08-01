import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenClaimStatusComponent } from './open-claim-status.component';

describe('OpenClaimStatusComponent', () => {
  let component: OpenClaimStatusComponent;
  let fixture: ComponentFixture<OpenClaimStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenClaimStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenClaimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
