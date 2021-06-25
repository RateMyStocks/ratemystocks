import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector, private ngZone: NgZone) {}

  handleError(error: Error | HttpErrorResponse) {
    console.log(error)
    const snackBar = this.injector.get(MatSnackBar);
    let errorType: string;
    if (error instanceof HttpErrorResponse) {
      if (error.status >= 500) {
        errorType = 'Unknown Server Error';
      } else {
        errorType = 'Unknown Client Error';
      }
    } else {
      errorType = 'Unknown Client Error';
    }
    this.ngZone.run(() => {
      snackBar.open(
        `An unexpected error occurred. If you continue to receive this error please report it to support@ratemystocks.com`,
        errorType,
        {
          duration: 3000,
        }
      );
    });
  }
}
