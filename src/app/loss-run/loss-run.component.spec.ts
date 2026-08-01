import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossRunComponent } from './loss-run.component';

describe('LossRunComponent', () => {
  let component: LossRunComponent;
  let fixture: ComponentFixture<LossRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LossRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LossRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
