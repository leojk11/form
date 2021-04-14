import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

// singleInput model
import { SingleInput } from '../single-input.model';

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

  formError: boolean = false;

  showUserMessage: boolean
  userMessage: string;
  showUserError: boolean = false;
  userError: string;

  sendingEmail: boolean;

  constructor(private formService: FormServiceService) { }

  ngOnInit(): void {
    this.getInputs();
  }

  // get all inputs from api
  getInputs() {
    this.formService.getInputs().subscribe(inputs => {
      this.allInputs = inputs;

      this.form = this.formService.toFormGroup(inputs);
    });
  }

  // submit form function
  onSubmitNew() {
    // check if form is valid
    switch(this.form.status) {
      case 'INVALID':
        this.formError = true;

        setTimeout(() => {
          this.formError = false;
        }, 5000);

        return;
    }

    // get form value
    const info = {
      email: this.form.value.sender_mail,
      name: this.form.value.person_name,
      country: this.form.value.country 
    }

    // when sending email is true it disables the entire form
    this.sendingEmail = true;

    this.formService.sendEmail(info).subscribe(response => {
      // check if response is ok, show message that email has been sent
      if(response.mess !== 'main sent') {
        this.showUserError = true;
        this.userError = response.mess;

        this.sendingEmail = false;

        return;
      } else {
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
