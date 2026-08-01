import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitSeactionComponent } from './limit-seaction.component';

describe('LimitSeactionComponent', () => {
  let component: LimitSeactionComponent;
  let fixture: ComponentFixture<LimitSeactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitSeactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LimitSeactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
