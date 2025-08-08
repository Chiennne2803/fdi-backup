import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionProcessDetailComponent } from './commission-process-detail.component';

describe('CommissionProcessDetailComponent', () => {
  let component: CommissionProcessDetailComponent;
  let fixture: ComponentFixture<CommissionProcessDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionProcessDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
