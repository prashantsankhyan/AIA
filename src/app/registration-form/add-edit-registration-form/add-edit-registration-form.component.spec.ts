import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRegistrationFormComponent } from './add-edit-registration-form.component';

describe('AddEditRegistrationFormComponent', () => {
  let component: AddEditRegistrationFormComponent;
  let fixture: ComponentFixture<AddEditRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditRegistrationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
