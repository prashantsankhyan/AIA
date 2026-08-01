import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRemarksComponent } from './add-edit-remarks.component';

describe('AddEditRemarksComponent', () => {
  let component: AddEditRemarksComponent;
  let fixture: ComponentFixture<AddEditRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditRemarksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
