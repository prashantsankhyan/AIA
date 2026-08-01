import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransgardComponent } from './transgard.component';

describe('TransgardComponent', () => {
  let component: TransgardComponent;
  let fixture: ComponentFixture<TransgardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransgardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransgardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
