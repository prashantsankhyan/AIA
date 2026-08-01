import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAttachmentComponent } from './add-edit-attachment.component';

describe('AddEditAttachmentComponent', () => {
  let component: AddEditAttachmentComponent;
  let fixture: ComponentFixture<AddEditAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
