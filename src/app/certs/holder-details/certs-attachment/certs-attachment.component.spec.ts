import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsAttachmentComponent } from './certs-attachment.component';

describe('CertsAttachmentComponent', () => {
  let component: CertsAttachmentComponent;
  let fixture: ComponentFixture<CertsAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
