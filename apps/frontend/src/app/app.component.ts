import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'ratemystocks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ratemystocks';

  data: { message: string };

  constructor(private appService: AppService) {
    this.appService.helloWorld().subscribe((result: { message: string }) => {
      this.data = result;
    });
  }
}
