import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossRunNavBarComponent } from './loss-run-nav-bar.component';

describe('LossRunNavBarComponent', () => {
  let component: LossRunNavBarComponent;
  let fixture: ComponentFixture<LossRunNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LossRunNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LossRunNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
