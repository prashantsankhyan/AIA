import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClaimComponent } from './add-edit-claim.component';

describe('AddEditClaimComponent', () => {
  let component: AddEditClaimComponent;
  let fixture: ComponentFixture<AddEditClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
