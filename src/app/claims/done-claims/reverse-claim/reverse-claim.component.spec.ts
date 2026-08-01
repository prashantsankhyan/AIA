import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseClaimComponent } from './reverse-claim.component';

describe('ReverseClaimComponent', () => {
  let component: ReverseClaimComponent;
  let fixture: ComponentFixture<ReverseClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReverseClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReverseClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
