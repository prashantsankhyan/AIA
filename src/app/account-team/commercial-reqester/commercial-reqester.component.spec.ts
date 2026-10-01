import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialReqesterComponent } from './commercial-reqester.component';

describe('CommercialReqesterComponent', () => {
  let component: CommercialReqesterComponent;
  let fixture: ComponentFixture<CommercialReqesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialReqesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommercialReqesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
