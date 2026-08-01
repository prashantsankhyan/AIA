import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRemkarsPolicyIdComponent } from './view-remkars-policy-id.component';

describe('ViewRemkarsPolicyIdComponent', () => {
  let component: ViewRemkarsPolicyIdComponent;
  let fixture: ComponentFixture<ViewRemkarsPolicyIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRemkarsPolicyIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRemkarsPolicyIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
