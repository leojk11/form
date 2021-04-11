import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SingleInput } from '../single-input.model';
import { SingleInputService } from '../single-input.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  allInputs: SingleInput[];

  formError: boolean;
  formInvalid: boolean = true;

  constructor(private inputService: SingleInputService) { }

  ngOnInit(): void {
    this.getInputs();
  }

  getInputs() {
    this.inputService.getInputs().subscribe(inputs => {
      this.allInputs = inputs;
      console.log(inputs);
    });
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if(form.invalid) {
      console.log('form is invalid');
      this.formError = true;

      return;
    } else {
      this.formInvalid = false;
    }
  }
}
