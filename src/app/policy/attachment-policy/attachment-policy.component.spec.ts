import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPolicyComponent } from './attachment-policy.component';

describe('AttachmentPolicyComponent', () => {
  let component: AttachmentPolicyComponent;
  let fixture: ComponentFixture<AttachmentPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachmentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
