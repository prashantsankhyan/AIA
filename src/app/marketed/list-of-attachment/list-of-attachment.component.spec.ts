import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAttachmentComponent } from './list-of-attachment.component';

describe('ListOfAttachmentComponent', () => {
  let component: ListOfAttachmentComponent;
  let fixture: ComponentFixture<ListOfAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
