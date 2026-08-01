import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndrosementAttachmentComponent } from './endrosement-attachment.component';

describe('EndrosementAttachmentComponent', () => {
  let component: EndrosementAttachmentComponent;
  let fixture: ComponentFixture<EndrosementAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndrosementAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndrosementAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
