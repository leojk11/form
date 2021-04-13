import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor(
    private inputService: SingleInputService,
    private formService: FormServiceService
  ) { }

  ngOnInit(): void {
    this.getInputs();
  }

  getInputs() {
    this.inputService.getInputs().subscribe(inputs => {
      this.allInputs = inputs;
    });
  }


  onSubmit(form: NgForm) {
    var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    // check if form is invalid
    switch(form.invalid) {
      case true:
        this.formError = true;
        return;
    }

    // check if email is valid, if not show error message
    switch(emailRegex.test(form.value.sender_mail)) {
      case false:
        this.emailInvalid = true;
        this.emailInvalidMessage = 'Your email address is not valid';

        return

      case true:
        this.emailInvalid = false
        this.emailInvalidMessage = '';
    }

    // check if user chose country, if not remind them to choose
    switch(form.value.country) {
      case 'country':
        this.showCountryError = true;
        this.countryError = 'Please choose your country';

        return;
      
      default:
        this.showCountryError = false;
        this.countryError = '';
    }

    this.sendingEmail = true;

    // get information from form
    const info = {
      email: form.value.sender_mail,
      name: form.value.person_name,
      country:form.value.country 
    }

    this.formService.sendEmail(info).subscribe(response => {
      console.log(response);
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
    });
  }
}
