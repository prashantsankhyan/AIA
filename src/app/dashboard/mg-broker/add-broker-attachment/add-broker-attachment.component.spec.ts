import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrokerAttachmentComponent } from './add-broker-attachment.component';

describe('AddBrokerAttachmentComponent', () => {
  let component: AddBrokerAttachmentComponent;
  let fixture: ComponentFixture<AddBrokerAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBrokerAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBrokerAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
