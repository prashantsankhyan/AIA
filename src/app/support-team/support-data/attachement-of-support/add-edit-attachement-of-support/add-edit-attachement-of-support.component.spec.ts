import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAttachementOfSupportComponent } from './add-edit-attachement-of-support.component';

describe('AddEditAttachementOfSupportComponent', () => {
  let component: AddEditAttachementOfSupportComponent;
  let fixture: ComponentFixture<AddEditAttachementOfSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAttachementOfSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAttachementOfSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
