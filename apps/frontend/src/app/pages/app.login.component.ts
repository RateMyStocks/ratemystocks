import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Login - ratemystocks.com');

    this.meta.addTags([
      {
        name: 'description',
        content: `Login to ratemystocks.com to discuss your favorite stocks with investors around the world.`,
      },
      {
        name: 'keywords',
        content: `ratemystocks.com login, ratemystocks.com signin, ratemystocks.com sign in`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);
  }
}
