import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingDetailComponent } from './funding-detail.component';

describe('FundingDetailComponent', () => {
  let component: FundingDetailComponent;
  let fixture: ComponentFixture<FundingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
