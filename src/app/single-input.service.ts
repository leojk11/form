import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// input model
import { SingleInput } from './single-input.model';

@Injectable({
  providedIn: 'root'
})
export class SingleInputService {

  private apiUrl = 'https://run.mocky.io/v3/19dc5371-c136-49b4-8ea1-11cccb489c90';

  constructor(private http: HttpClient) { }

  // http options that API requires
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type':'application/json' })
  }

  // get inputs from api
  getInputs(): Observable<SingleInput[]> {
    return this.http.get<SingleInput[]>(this.apiUrl)
  }
}
