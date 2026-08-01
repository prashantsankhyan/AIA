import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPolicyAttachementComponent } from './add-edit-policy-attachement.component';

describe('AddEditPolicyAttachementComponent', () => {
  let component: AddEditPolicyAttachementComponent;
  let fixture: ComponentFixture<AddEditPolicyAttachementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPolicyAttachementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditPolicyAttachementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
