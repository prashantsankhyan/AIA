import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPolicyForEndrosementComponent } from './list-of-policy-for-endrosement.component';

describe('ListOfPolicyForEndrosementComponent', () => {
  let component: ListOfPolicyForEndrosementComponent;
  let fixture: ComponentFixture<ListOfPolicyForEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPolicyForEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfPolicyForEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
