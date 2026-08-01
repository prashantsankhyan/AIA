import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDriverForSupportComponent } from './add-edit-driver-for-support.component';

describe('AddEditDriverForSupportComponent', () => {
  let component: AddEditDriverForSupportComponent;
  let fixture: ComponentFixture<AddEditDriverForSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDriverForSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditDriverForSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
