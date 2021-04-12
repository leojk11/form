import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SingleInput } from '../single-input.model';
import { SingleInputService } from '../single-input.service';
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

  showUserMessage: boolean
  userMessage: string;
  showUserError: boolean
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
    console.log(form);
    var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
console.log('leo1')
    // check if form is invalid
    switch(form.invalid) {
      case true:
        this.formError = true;
        return;
    }

    console.log('leo2')
    // check if email is valid, if not show error message
    console.log(form.value.sender_mail);
    console.log(emailRegex.test(form.value.sender_mail));
    switch(emailRegex.test(form.value.sender_mail)) {
      case false:
        this.emailInvalid = true;

        return

      case true:
        this.emailInvalid = false
    }

    console.log('leo3')

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

    console.log('leo4')

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
          console.log('invalid email')
          return;
        case 'Please enter your name':
          console.log('enter your name')
          return;
        case 'Please choose your country':
          console.log('choose country')
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
        
        case 'ERROR_500':
          // if there is an error, tell the user that there was error
          this.showUserError = true;
          this.userError = 'There was an error sending email';

          this.sendingEmail = false;
      }
      
    });
  }
}
