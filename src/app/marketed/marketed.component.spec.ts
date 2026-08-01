import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketedComponent } from './marketed.component';

describe('MarketedComponent', () => {
  let component: MarketedComponent;
  let fixture: ComponentFixture<MarketedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
