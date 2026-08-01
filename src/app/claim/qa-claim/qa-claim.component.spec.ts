import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaClaimComponent } from './qa-claim.component';

describe('QaClaimComponent', () => {
  let component: QaClaimComponent;
  let fixture: ComponentFixture<QaClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QaClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
