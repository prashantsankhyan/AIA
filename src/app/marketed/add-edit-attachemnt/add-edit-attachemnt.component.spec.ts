import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAttachemntComponent } from './add-edit-attachemnt.component';

describe('AddEditAttachemntComponent', () => {
  let component: AddEditAttachemntComponent;
  let fixture: ComponentFixture<AddEditAttachemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAttachemntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAttachemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
