import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTransactionAttachmentComponent } from './add-edit-transaction-attachment.component';

describe('AddEditTransactionAttachmentComponent', () => {
  let component: AddEditTransactionAttachmentComponent;
  let fixture: ComponentFixture<AddEditTransactionAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTransactionAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditTransactionAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
