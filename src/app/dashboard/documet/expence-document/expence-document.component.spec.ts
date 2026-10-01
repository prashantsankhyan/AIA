import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceDocumentComponent } from './expence-document.component';

describe('ExpenceDocumentComponent', () => {
  let component: ExpenceDocumentComponent;
  let fixture: ComponentFixture<ExpenceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenceDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
