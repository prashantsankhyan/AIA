import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMarketedPageOptionComponent } from './show-marketed-page-option.component';

describe('ShowMarketedPageOptionComponent', () => {
  let component: ShowMarketedPageOptionComponent;
  let fixture: ComponentFixture<ShowMarketedPageOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMarketedPageOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowMarketedPageOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
