import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAgencyDocumentComponent } from './add-edit-agency-document.component';

describe('AddEditAgencyDocumentComponent', () => {
  let component: AddEditAgencyDocumentComponent;
  let fixture: ComponentFixture<AddEditAgencyDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAgencyDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAgencyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
