import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAttachmentListComponent } from './sale-attachment-list.component';

describe('SaleAttachmentListComponent', () => {
  let component: SaleAttachmentListComponent;
  let fixture: ComponentFixture<SaleAttachmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleAttachmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleAttachmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
