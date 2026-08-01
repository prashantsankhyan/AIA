import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCertsAttachmentComponent } from './list-of-certs-attachment.component';

describe('ListOfCertsAttachmentComponent', () => {
  let component: ListOfCertsAttachmentComponent;
  let fixture: ComponentFixture<ListOfCertsAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfCertsAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfCertsAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
