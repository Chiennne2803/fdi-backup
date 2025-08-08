import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTypeDialogComponent } from './confirm-type-dialog.component';

describe('ConfirmTypeDialogComponent', () => {
  let component: ConfirmTypeDialogComponent;
  let fixture: ComponentFixture<ConfirmTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmTypeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
