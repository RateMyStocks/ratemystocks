// Inteceptors are functions that run for any http requests
// Works like a middleware for outgoing requests
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Requirement by angular to put a injectable tag
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Need to clone outgoing requests and not edit them outright because how it functions in the back
    const authRequest = req.clone({
      // TODO: Local storage is currently the place holder for storing jwt tokens
      // headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('accessToken')),
    });

    return next.handle(authRequest);
  }
}
