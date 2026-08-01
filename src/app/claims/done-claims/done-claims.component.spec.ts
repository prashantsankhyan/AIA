import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneClaimsComponent } from './done-claims.component';

describe('DoneClaimsComponent', () => {
  let component: DoneClaimsComponent;
  let fixture: ComponentFixture<DoneClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
