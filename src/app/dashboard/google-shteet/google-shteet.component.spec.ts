import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleShteetComponent } from './google-shteet.component';

describe('GoogleShteetComponent', () => {
  let component: GoogleShteetComponent;
  let fixture: ComponentFixture<GoogleShteetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleShteetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleShteetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
