import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEndrosementAttachmentComponent } from './add-endrosement-attachment.component';

describe('AddEndrosementAttachmentComponent', () => {
  let component: AddEndrosementAttachmentComponent;
  let fixture: ComponentFixture<AddEndrosementAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEndrosementAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEndrosementAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
