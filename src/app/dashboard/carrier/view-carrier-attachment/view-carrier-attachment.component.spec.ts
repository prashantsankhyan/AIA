import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarrierAttachmentComponent } from './view-carrier-attachment.component';

describe('ViewCarrierAttachmentComponent', () => {
  let component: ViewCarrierAttachmentComponent;
  let fixture: ComponentFixture<ViewCarrierAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCarrierAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCarrierAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
