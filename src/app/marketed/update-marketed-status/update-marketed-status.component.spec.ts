import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMarketedStatusComponent } from './update-marketed-status.component';

describe('UpdateMarketedStatusComponent', () => {
  let component: UpdateMarketedStatusComponent;
  let fixture: ComponentFixture<UpdateMarketedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMarketedStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMarketedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
