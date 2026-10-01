import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumetNavbarComponent } from './documet-navbar.component';

describe('DocumetNavbarComponent', () => {
  let component: DocumetNavbarComponent;
  let fixture: ComponentFixture<DocumetNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumetNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumetNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
