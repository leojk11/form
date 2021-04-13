import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';

// singleInput model
import { SingleInput } from '../single-input.model';

// singleInput service
import { SingleInputService } from '../single-input.service';

// form service
import { FormServiceService } from '../form-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  allInputs: SingleInput[];
  form!: FormGroup;
  payload!: '';

  formError: boolean = false;

  emailInvalid: boolean;
  emailInvalidMessage: string;

  showUserMessage: boolean
  userMessage: string;
  showUserError: boolean = false;
  userError: string;
  showCountryError: boolean;
  countryError: string;

  sendingEmail: boolean;

  toFormGroup(inputs: SingleInput[]): FormGroup {
    const group: any = {};

    console.log(inputs);

    inputs.forEach(input => {
      let validator: ValidatorFn[] = input.rules.split('|')[0] ? [Validators.required, Validators.minLength(3)] : [];

      switch (input.type) {
        case "email":
          validator.push(Validators.email);
          break;

        default:
          break;
      }

      group[input.name] = validator.length > 0 ? new FormControl(input.value || '', validator) : new FormControl(input.value || '');
    })

    return new FormGroup(group);
  }

  constructor(
    private inputService: SingleInputService,
    private formService: FormServiceService
  ) { }

  ngOnInit(): void {
    this.getInputs();
  }

  async getInputs() {
    await this.inputService.getInputs().subscribe(inputs => {
      this.allInputs = inputs;

      this.form = this.toFormGroup(inputs);
    });
  }

  onSubmitNew() {
    var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    console.log(this.form);

    switch(this.form.status) {
      case 'INVALID':
        this.formError = true;

        return;
    }

    const info = {
      email: this.form.value.sender_mail,
      name: this.form.value.person_name,
      country: this.form.value.country 
    }

    this.sendingEmail = true;

    this.formService.sendEmail(info).subscribe(response => {
      // check if response is ok, show message that email has been sent
      switch(response.mess) {
        case 'Your email is invalid':
          this.showUserError = true;
          this.userError = response.mess;

          this.sendingEmail = false;

          return;
        case 'Please enter your name':
          this.showUserError = true;
          this.userError = response.mess;

          this.sendingEmail = false;
          
          return;
        case 'Please choose your country':
          this.showUserError = true;
          this.userError = response.mess;

          this.sendingEmail = false;

          return;
        case 'mail sent':
          // if email has been sent, show message
          this.showUserMessage = true;
          this.userMessage = `Email has been sent to: ${info.email}`;
  
          // turn off disabled from all inputs and button
          this.sendingEmail = false;

          // remove the message after 5 sec
          setTimeout(() => {
            this.showUserMessage = false;
            this.userMessage = '';
          }, 5000);
      }
      
      if(response.mess !== 'mail sent') {
        this.showUserError = true;
        this.userError = 'There was an error sending your mail.'
      }
    });
  }
}
