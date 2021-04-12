import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5000/send-email';

  // http options that API requires
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type':'application/json' })
  }

  sendEmail(info: {name: string, email: string, country: string}): Observable<any> {
    const url = `${this.apiUrl}/?userEmail=${info.email}&userName=${info.name}&userCountry=${info.country}`;

    console.log(url);

    return this.http.post(url, this.httpOptions).pipe(
      tap(_ => console.log('email got send')),
      catchError(err => {
        console.log(err)
        throw 'error in source. Details: ' + err;
      }),
    )
  }
}
