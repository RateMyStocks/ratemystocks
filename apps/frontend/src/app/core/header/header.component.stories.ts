import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../core.module';
import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'HeaderComponent',
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, CoreModule, MatIconModule],
    }),
  ],
} as Meta<HeaderComponent>;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
});

export const Authenticated = Template.bind({});
Authenticated.args = {
  userName: 'TestUser',
  avatar: 'antelope',
  isAuth: true,
};
