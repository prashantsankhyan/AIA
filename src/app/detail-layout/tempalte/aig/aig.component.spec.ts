import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AigComponent } from './aig.component';

describe('AigComponent', () => {
  let component: AigComponent;
  let fixture: ComponentFixture<AigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
