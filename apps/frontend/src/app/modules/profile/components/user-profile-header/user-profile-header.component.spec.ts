import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpiritAnimal } from '@ratemystocks/api-interface';
import { ProfileModule } from '../../profile.module';

import { UserProfileHeaderComponent } from './user-profile-header.component';

describe('UserProfileHeaderComponent', () => {
  let component: UserProfileHeaderComponent;
  let fixture: ComponentFixture<UserProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModule],
      declarations: [UserProfileHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileHeaderComponent);
    component = fixture.componentInstance;

    component.user = {
      id: 'ddb2a4a0-262e-4cd7-8d13-8eae5e4019c8',
      username: 'TestUser',
      email: 'test@gmail.com',
      spiritAnimal: SpiritAnimal.ANTELOPE,
    };

    fixture.detectChanges();
  });

  it('should render the dynamic user data in the profile header', () => {
    const profileHeader: string = fixture.debugElement
      .query(By.css('#user-profile-username'))
      .nativeElement.textContent.trim();
    expect(profileHeader).toEqual('TestUser');

    const profileThumbnailFile: string = fixture.debugElement.query(By.css('#user-profile-thumbnail')).nativeElement[
      'src'
    ];
    expect(profileThumbnailFile).toContain('/assets/images/avatars/antelope.png');
  });
});
