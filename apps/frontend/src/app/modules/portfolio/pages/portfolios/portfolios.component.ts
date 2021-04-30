import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'apps/frontend/src/app/core/services/auth.service';
import { CreatePortfolioDialogComponent } from '../../components/create-portfolio-dialog/create-portfolio-dialog.component';

@Component({
  selector: 'ratemystocks-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss'],
})
export class PortfoliosComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  openDialog() {
    if (this.authService.isAuthorized()) {
      const dialogRef = this.dialog.open(CreatePortfolioDialogComponent);
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      this.router.navigate(['/auth/signin']);
      this.snackBar.open('You must be signed in to use this feature.', 'OK', {
        duration: 3000,
        panelClass: 'warn-snackbar',
      });
    }
  }

  ngOnInit(): void {}
}
