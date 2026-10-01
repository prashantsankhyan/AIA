import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumetComponent } from './documet.component';

describe('DocumetComponent', () => {
  let component: DocumetComponent;
  let fixture: ComponentFixture<DocumetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
