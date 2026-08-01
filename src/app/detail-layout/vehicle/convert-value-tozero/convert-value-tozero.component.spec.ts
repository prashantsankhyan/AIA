import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertValueTozeroComponent } from './convert-value-tozero.component';

describe('ConvertValueTozeroComponent', () => {
  let component: ConvertValueTozeroComponent;
  let fixture: ComponentFixture<ConvertValueTozeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertValueTozeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvertValueTozeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
