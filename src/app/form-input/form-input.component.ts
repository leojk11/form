import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SingleInput } from '../single-input.model';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {

  @Input() input!: SingleInput;
  @Input() form!: FormGroup
  @Input() formError!: boolean;
  @Input() sendingMail!: boolean;

  get isValid() { return this.form.controls[this.input.name].valid }

  constructor() { }

}
