import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfSaleAttachmentComponent } from './view-of-sale-attachment.component';

describe('ViewOfSaleAttachmentComponent', () => {
  let component: ViewOfSaleAttachmentComponent;
  let fixture: ComponentFixture<ViewOfSaleAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOfSaleAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOfSaleAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
