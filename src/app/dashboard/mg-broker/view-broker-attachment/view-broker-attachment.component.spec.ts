import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBrokerAttachmentComponent } from './view-broker-attachment.component';

describe('ViewBrokerAttachmentComponent', () => {
  let component: ViewBrokerAttachmentComponent;
  let fixture: ComponentFixture<ViewBrokerAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBrokerAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBrokerAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
