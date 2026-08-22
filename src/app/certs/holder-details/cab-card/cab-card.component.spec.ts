import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabCardComponent } from './cab-card.component';

describe('CabCardComponent', () => {
  let component: CabCardComponent;
  let fixture: ComponentFixture<CabCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
