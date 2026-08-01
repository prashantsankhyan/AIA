import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRemakrsAccoutBaseComponent } from './view-remakrs-accout-base.component';

describe('ViewRemakrsAccoutBaseComponent', () => {
  let component: ViewRemakrsAccoutBaseComponent;
  let fixture: ComponentFixture<ViewRemakrsAccoutBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRemakrsAccoutBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRemakrsAccoutBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
