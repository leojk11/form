import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

// single input model
import { SingleInput } from './single-input.model';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  // create from control groups
  toFormGroup(inputs: SingleInput[]): FormGroup {
    const group: any = {};

    inputs.forEach(input => {
      let validator: ValidatorFn[] = [Validators.required, Validators.minLength(3), Validators.maxLength(64)];

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

  constructor(private http: HttpClient) { }

  private sendEmailApiUrl = 'http://localhost:5000/send-email';
  private getInputsApiUrl = 'https://run.mocky.io/v3/19dc5371-c136-49b4-8ea1-11cccb489c90';

  // http options that API requires
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type':'application/json' })
  }

  // get inputs from api
  getInputs(): Observable<SingleInput[]> {
    return this.http.get<SingleInput[]>(this.getInputsApiUrl)
  }

  // send email when user submits the form
  sendEmail(info: {name: string, email: string, country: string}): Observable<any> {
    const url = `${this.sendEmailApiUrl}/?userEmail=${info.email}&userName=${info.name}&userCountry=${info.country}`;

    // send post request to the server
    return this.http.post(url, this.httpOptions).pipe(
      tap(_ => console.log('email got send')),
      catchError(err => {
        throw 'error in source. Details: ' + err;
      }),
    )
  }
}
