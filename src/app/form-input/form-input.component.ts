import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SingleInput } from '../single-input.model';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  animations: [
    trigger('errorAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(500, style({
          opacity: 0
        }))
      ])
    ]),
  ]
})
export class FormInputComponent {

  @Input() input!: SingleInput;
  @Input() form!: FormGroup
  @Input() formError!: boolean;
  @Input() sendingMail!: boolean;

  get isValid() { return this.form.controls[this.input.name].valid }

  constructor() { }

}
