import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNavComponent } from './policy-nav.component';

describe('PolicyNavComponent', () => {
  let component: PolicyNavComponent;
  let fixture: ComponentFixture<PolicyNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolicyNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
