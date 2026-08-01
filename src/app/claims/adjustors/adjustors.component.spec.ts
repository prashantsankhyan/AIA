import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustorsComponent } from './adjustors.component';

describe('AdjustorsComponent', () => {
  let component: AdjustorsComponent;
  let fixture: ComponentFixture<AdjustorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjustorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
