import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlMtrustComponent } from './al-mtrust.component';

describe('AlMtrustComponent', () => {
  let component: AlMtrustComponent;
  let fixture: ComponentFixture<AlMtrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlMtrustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlMtrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
