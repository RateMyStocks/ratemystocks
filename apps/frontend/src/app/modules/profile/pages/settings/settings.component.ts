import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  selectedState: any = null;

  constructor(private breadcrumbService: AppBreadcrumbService, private meta: Meta, private title: Title) {
    this.title.setTitle(`Settings | ratemystocks.com`);
    this.meta.addTags([
      {
        name: 'description',
        content: `Manage your profile settings and account information.`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ]);
    this.breadcrumbService.setItems([{ label: 'Profile' }, { label: 'Settings', routerLink: ['/profile/settings'] }]);
  }
}
