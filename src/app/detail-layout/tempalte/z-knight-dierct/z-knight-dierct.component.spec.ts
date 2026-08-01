import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZKnightDierctComponent } from './z-knight-dierct.component';

describe('ZKnightDierctComponent', () => {
  let component: ZKnightDierctComponent;
  let fixture: ComponentFixture<ZKnightDierctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZKnightDierctComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZKnightDierctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
