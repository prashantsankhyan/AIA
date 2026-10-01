import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExoenceDocumentComponent } from './add-exoence-document.component';

describe('AddExoenceDocumentComponent', () => {
  let component: AddExoenceDocumentComponent;
  let fixture: ComponentFixture<AddExoenceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExoenceDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExoenceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
