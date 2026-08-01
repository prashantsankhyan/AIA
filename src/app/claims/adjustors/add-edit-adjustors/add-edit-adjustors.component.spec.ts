import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdjustorsComponent } from './add-edit-adjustors.component';

describe('AddEditAdjustorsComponent', () => {
  let component: AddEditAdjustorsComponent;
  let fixture: ComponentFixture<AddEditAdjustorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAdjustorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAdjustorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
