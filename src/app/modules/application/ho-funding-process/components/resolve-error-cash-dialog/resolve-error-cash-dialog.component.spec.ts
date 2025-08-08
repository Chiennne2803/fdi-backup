import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveErrorCashDialogComponent } from './resolve-error-cash-dialog.component';

describe('ResolveErrorCashDialogComponent', () => {
  let component: ResolveErrorCashDialogComponent;
  let fixture: ComponentFixture<ResolveErrorCashDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveErrorCashDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolveErrorCashDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
