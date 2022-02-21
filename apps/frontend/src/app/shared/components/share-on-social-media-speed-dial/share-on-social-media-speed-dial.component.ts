import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-on-social-media-speed-dial',
  templateUrl: './share-on-social-media-speed-dial.component.html',
  styleUrls: ['./share-on-social-media-speed-dial.component.scss'],
})
export class ShareOnSocialMediaSpeedDialComponent implements OnInit {
  socialMediaItems = [];

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      this.socialMediaItems = [
        {
          icon: 'pi pi-facebook',
          url: 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
          tooltipOptions: {
            tooltipLabel: 'Share on Facebook',
          },
        },
        {
          icon: 'pi pi-twitter',
          url: 'http://twitter.com/share?text=Check out my this stock!&url=' + window.location.href,
          tooltipOptions: {
            tooltipLabel: 'Share on Twitter',
          },
        },
        // {
        //   icon: 'pi pi-copy',
        //   command: () => {

        //   },
        // },
      ];
    });
  }

  ngOnInit(): void {
    this.socialMediaItems = [
      {
        icon: 'pi pi-facebook',
        url: 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
        tooltipOptions: {
          tooltipLabel: 'Share on Facebook',
        },
      },
      {
        icon: 'pi pi-twitter',
        url: 'http://twitter.com/share?text=Check out my this stock!&url=' + window.location.href,
        tooltipOptions: {
          tooltipLabel: 'Share on Twitter',
        },
      },
      // {
      //   icon: 'pi pi-copy',
      //   command: () => {

      //   },
      // },
    ];
  }

  /**
   * Social media icon click event handler to share the portfolio link to the corresponding site.
   * NOTE: When redirecting from localhost, some social media sites will block the request.
   * @param socialMediaUrl The URL of the social media site that the portfolio will be shared on.
   */
  shareOnSocialMedia(socialMediaUrl: string): void {
    window.open(socialMediaUrl + window.location.href, '_blank');
  }
}
