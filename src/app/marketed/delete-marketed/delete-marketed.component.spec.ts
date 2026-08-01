import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMarketedComponent } from './delete-marketed.component';

describe('DeleteMarketedComponent', () => {
  let component: DeleteMarketedComponent;
  let fixture: ComponentFixture<DeleteMarketedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMarketedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMarketedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
