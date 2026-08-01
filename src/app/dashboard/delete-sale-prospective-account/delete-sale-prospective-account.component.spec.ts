import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSaleProspectiveAccountComponent } from './delete-sale-prospective-account.component';

describe('DeleteSaleProspectiveAccountComponent', () => {
  let component: DeleteSaleProspectiveAccountComponent;
  let fixture: ComponentFixture<DeleteSaleProspectiveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSaleProspectiveAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSaleProspectiveAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
