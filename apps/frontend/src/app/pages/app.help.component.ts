import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppBreadcrumbService } from '../app.breadcrumb.service';

@Component({
  templateUrl: './app.help.component.html',
})
export class AppHelpComponent {
  constructor(private breadcrumbService: AppBreadcrumbService, private meta: Meta, private title: Title) {
    this.title.setTitle('FAQ - ratemystocks.com');

    this.meta.addTags([
      {
        name: 'description',
        content: `Need help? Contact us or find answers to frequently asked questions here.`,
      },
      {
        name: 'keywords',
        content: `ratemystocks.com faq, ratemystocks.com help, ratemystocks.com support, ratemystocks.com contact, ratemystocks.com email`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);

    this.breadcrumbService.setItems([{ label: 'Resources' }, { label: 'Help', routerLink: ['/pages/help'] }]);
  }
}
