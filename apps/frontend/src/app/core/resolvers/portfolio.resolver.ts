import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PortfolioDto } from '@ratemystocks/api-interface';
import { Observable } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';

@Injectable({ providedIn: 'root' })
export class PortfolioResolver implements Resolve<Observable<PortfolioDto>> {
  constructor(private service: PortfolioService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PortfolioDto> {
    return this.service.getPortfolio(route.paramMap.get('id'));
  }
}
