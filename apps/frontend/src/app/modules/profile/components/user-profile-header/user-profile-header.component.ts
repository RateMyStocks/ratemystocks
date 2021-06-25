import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserProfileDto } from '@ratemystocks/api-interface';

@Component({
  selector: 'app-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent {
  @Input() user: UserProfileDto;

  moment = moment;
}
