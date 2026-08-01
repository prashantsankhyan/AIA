import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdjusterFromMoveClaimComponent } from './view-adjuster-from-move-claim.component';

describe('ViewAdjusterFromMoveClaimComponent', () => {
  let component: ViewAdjusterFromMoveClaimComponent;
  let fixture: ComponentFixture<ViewAdjusterFromMoveClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAdjusterFromMoveClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAdjusterFromMoveClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
