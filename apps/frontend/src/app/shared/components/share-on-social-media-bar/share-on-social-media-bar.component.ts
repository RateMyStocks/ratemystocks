import { Component, OnInit } from '@angular/core';

enum SocialMediaSite {
  FACEBOOK,
  TWITTER,
  LINKEDIN,
  REDDIT,
}

@Component({
  selector: 'app-share-on-social-media-bar',
  templateUrl: './share-on-social-media-bar.component.html',
  styleUrls: ['./share-on-social-media-bar.component.scss'],
})
export class ShareOnSocialMediaBarComponent {
  SocialMediaSite = SocialMediaSite;

  /**
   * Social media icon click event handler to share the portfolio link to the corresponding site.
   * NOTE: When redirecting from localhost, some social media sites will block the request.
   * @param socialMediaUrl The URL of the social media site that the portfolio will be shared on.
   */
  shareOnSocialMedia(socialMediaSite: SocialMediaSite): void {
    let socialMediaUrl = '';
    switch (socialMediaSite) {
      case SocialMediaSite.FACEBOOK:
        socialMediaUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href;
        break;
      case SocialMediaSite.TWITTER:
        socialMediaUrl = 'http://twitter.com/share?text=Check out my this stock!&url=' + window.location.href;
        break;
      case SocialMediaSite.LINKEDIN:
        socialMediaUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + window.location.href;
        break;
      case SocialMediaSite.REDDIT:
        socialMediaUrl = 'http://www.reddit.com/submit?url=' + window.location.href;
        break;
      default:
        break;
    }

    window.open(socialMediaUrl + window.location.href, '_blank');
  }
}
