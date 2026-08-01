import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfCompetedMarketdListComponent } from './view-of-competed-marketd-list.component';

describe('ViewOfCompetedMarketdListComponent', () => {
  let component: ViewOfCompetedMarketdListComponent;
  let fixture: ComponentFixture<ViewOfCompetedMarketdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOfCompetedMarketdListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOfCompetedMarketdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
