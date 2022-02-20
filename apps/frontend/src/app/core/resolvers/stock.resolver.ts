import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { IexCloudStockDataDto, StockRatingCountDto } from "@ratemystocks/api-interface";
import { Observable } from "rxjs";
import { StockService } from "../services/stock.service";

@Injectable({ providedIn: 'root' })
export class StockResolver implements Resolve<Observable<{ rating: StockRatingCountDto; data: IexCloudStockDataDto }>> {
  constructor(private service: StockService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ rating: StockRatingCountDto; data: IexCloudStockDataDto }> {
    console.log('RESOLVING');
    return this.service.getStock(route.paramMap.get('ticker'));
  }
}
