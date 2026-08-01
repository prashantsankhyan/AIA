import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAppRegistrationComponent } from './add-edit-app-registration.component';

describe('AddEditAppRegistrationComponent', () => {
  let component: AddEditAppRegistrationComponent;
  let fixture: ComponentFixture<AddEditAppRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAppRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAppRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
