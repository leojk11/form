import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-val-error',
  templateUrl: './val-error.component.html',
  styleUrls: ['./val-error.component.scss']
})
export class ValErrorComponent implements OnInit {

  @Input() errorMessage: string;
  @Input() toggleError: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
