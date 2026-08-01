import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossRunListComponent } from './loss-run-list.component';

describe('LossRunListComponent', () => {
  let component: LossRunListComponent;
  let fixture: ComponentFixture<LossRunListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LossRunListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LossRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
