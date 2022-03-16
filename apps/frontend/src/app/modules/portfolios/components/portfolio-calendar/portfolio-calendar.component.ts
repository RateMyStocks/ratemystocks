import { Component, Input, OnInit } from '@angular/core';
import { PortfolioStockDto, StockUpcomingEventDto } from '@ratemystocks/api-interface';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';

export interface CalendarEvent {
  title: string;
  date: string;
}

/**
 * Utilizes the FullCalendar Angular Component to display a list of events
 * for the stocks of a portfolio.
 * {@link https://fullcalendar.io/docs/angular}
 */
@Component({
  selector: 'app-portfolio-calendar',
  templateUrl: './portfolio-calendar.component.html',
  styleUrls: ['./portfolio-calendar.component.scss'],
})
export class PortfolioCalendarComponent implements OnInit {
  events: CalendarEvent[] = [];

  options: any;

  @Input() portfolioStocks: PortfolioStockDto[] = [];

  constructor(private iexCloudService: IexCloudService) {}

  ngOnInit() {
    this.iexCloudService
      .getStockUpcomingEvents(this.portfolioStocks.map((ps: PortfolioStockDto) => ps.ticker))
      .subscribe((res: StockUpcomingEventDto) => {
        Object.keys(res).forEach((ticker: string, index: number) => {
          const earningsDatesCalendarEvents: CalendarEvent[] = res[ticker]['upcoming-events'].earnings.map((event) => {
            return {
              title: ticker,
              date: event.reportDate,
              color: 'orange',
              textColor: 'white',
            };
          });

          const dividendDatesCalendarEvents: CalendarEvent[] = res[ticker]['upcoming-events'].dividends.map(
            (event) => ({
              title: ticker,
              date: event.reportDate,
              color: 'green',
              textColor: 'white',
            })
          );

          const splitDatesCalendarEvents: CalendarEvent[] = res[ticker]['upcoming-events'].splits.map((event) => ({
            title: ticker,
            date: event.reportDate,
            color: 'purple',
            textColor: 'white',
          }));

          this.events.push(...earningsDatesCalendarEvents);
          this.events.push(...dividendDatesCalendarEvents);
          this.events.push(...splitDatesCalendarEvents);
        });

        this.options = { ...this.options, ...{ events: this.events } };
      });

    this.options = {
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      height: 400,
      validRange: {
        start: new Date(),
      },
    };
  }
}
