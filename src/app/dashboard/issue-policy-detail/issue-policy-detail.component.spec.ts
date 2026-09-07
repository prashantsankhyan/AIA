import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePolicyDetailComponent } from './issue-policy-detail.component';

describe('IssuePolicyDetailComponent', () => {
  let component: IssuePolicyDetailComponent;
  let fixture: ComponentFixture<IssuePolicyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuePolicyDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssuePolicyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
