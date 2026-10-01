import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDocumentComponent } from './agency-document.component';

describe('AgencyDocumentComponent', () => {
  let component: AgencyDocumentComponent;
  let fixture: ComponentFixture<AgencyDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
