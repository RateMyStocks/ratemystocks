import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ratemystocks';

  isProduction: boolean = environment.production;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.setUpAuthStatus();
  }
}
