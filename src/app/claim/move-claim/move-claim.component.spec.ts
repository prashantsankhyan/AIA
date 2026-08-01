import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveClaimComponent } from './move-claim.component';

describe('MoveClaimComponent', () => {
  let component: MoveClaimComponent;
  let fixture: ComponentFixture<MoveClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
