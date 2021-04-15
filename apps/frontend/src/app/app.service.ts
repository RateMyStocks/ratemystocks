import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  helloWorld(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(environment.apiUrl);
  }
}
