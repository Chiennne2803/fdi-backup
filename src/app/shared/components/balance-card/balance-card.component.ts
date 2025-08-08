import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  encapsulation: ViewEncapsulation.None,
  
})
export class BalanceCardComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
