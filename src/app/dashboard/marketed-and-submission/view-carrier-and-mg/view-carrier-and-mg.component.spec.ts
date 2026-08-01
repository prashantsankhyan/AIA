import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarrierAndMgComponent } from './view-carrier-and-mg.component';

describe('ViewCarrierAndMgComponent', () => {
  let component: ViewCarrierAndMgComponent;
  let fixture: ComponentFixture<ViewCarrierAndMgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCarrierAndMgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCarrierAndMgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
