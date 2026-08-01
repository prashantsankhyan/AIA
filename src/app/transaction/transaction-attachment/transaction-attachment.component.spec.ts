import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAttachmentComponent } from './transaction-attachment.component';

describe('TransactionAttachmentComponent', () => {
  let component: TransactionAttachmentComponent;
  let fixture: ComponentFixture<TransactionAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
