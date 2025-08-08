import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderRefundComponent } from './lender-refund.component';

describe('LenderRefundComponent', () => {
  let component: LenderRefundComponent;
  let fixture: ComponentFixture<LenderRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LenderRefundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LenderRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
