import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemolateNaveComponent } from './temolate-nave.component';

describe('TemolateNaveComponent', () => {
  let component: TemolateNaveComponent;
  let fixture: ComponentFixture<TemolateNaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemolateNaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemolateNaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
