import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
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

  formError: boolean;
  formInvalid: boolean = true;
  emailInvalid: boolean;

  showUserMessage: boolean
  userMessage: string;
  showUserError: boolean
  userError: string;

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
    console.log(form.value);
    var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    if(form.invalid) {
      this.formError = true;

      return;
    } else if(emailRegex.test(form.value.sender_mail) == false) {
      this.emailInvalid = true;

      return;
    } else if(emailRegex.test(form.value.sender_mail) == true) {

      this.emailInvalid = false;

      this.sendingEmail = true;
    }

    const info = {
      email: form.value.sender_mail,
      name: form.value.person_name,
      country:form.value.country 
    }

    this.formService.sendEmail(info).subscribe(response => {
      console.log(response)
      if(response.mess === 'mail sent') {
        this.showUserMessage = true;

        this.userMessage = `Email has been sent to: ${info.email}`;

        this.sendingEmail = false;

        setTimeout(() => {
          this.showUserMessage = false;

          this.userMessage = '';
        }, 5000)

      } else {
        this.showUserError = true;

        this.userError = 'There was an error sending email';
      }
    });
  }
}
