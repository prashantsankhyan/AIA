import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHolderDetailsComponent } from './add-edit-holder-details.component';

describe('AddEditHolderDetailsComponent', () => {
  let component: AddEditHolderDetailsComponent;
  let fixture: ComponentFixture<AddEditHolderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditHolderDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditHolderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
