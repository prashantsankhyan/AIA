import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNoteComponent } from './add-edit-note.component';

describe('AddEditNoteComponent', () => {
  let component: AddEditNoteComponent;
  let fixture: ComponentFixture<AddEditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
