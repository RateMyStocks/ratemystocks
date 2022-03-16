import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-copy-page-link',
  templateUrl: './copy-page-link.component.html',
  styleUrls: ['./copy-page-link.component.scss'],
})
export class CopyPageLinkComponent {
  pageLink: string = window.location.href;

  constructor(private messageService: MessageService, private router: Router) {
    router.events.subscribe((val) => {
      this.pageLink = window.location.href;
    });
  }

  /** The click handler for the cdkCopyToClipboard directive shows a message when the link is copied. */
  onCopyPageLink(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Copied!',
      detail: 'Page link copied to clipboard',
    });
  }
}
