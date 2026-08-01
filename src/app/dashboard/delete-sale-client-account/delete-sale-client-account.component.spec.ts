import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSaleClientAccountComponent } from './delete-sale-client-account.component';

describe('DeleteSaleClientAccountComponent', () => {
  let component: DeleteSaleClientAccountComponent;
  let fixture: ComponentFixture<DeleteSaleClientAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSaleClientAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSaleClientAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
