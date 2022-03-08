import { Component, Input, OnInit } from '@angular/core';
import { PortfolioStockDto } from '@ratemystocks/api-interface';
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
    this.iexCloudService.getStockUpcomingEvents(this.portfolioStocks.map((ps) => ps.ticker)).subscribe((res) => {
      Object.keys(res).forEach((key, index) => {
        const earningsDatesCalendarEvents: CalendarEvent[] = res[key]['upcoming-events']['earnings'].map((event) => {
          return {
            title: key,
            date: event['reportDate'],
            color: 'orange',
            textColor: 'white',
          };
        });

        const dividendDatesCalendarEvents: CalendarEvent[] = res[key]['upcoming-events']['dividends'].map((event) => ({
          title: key,
          date: event['reportDate'],
          color: 'green',
          textColor: 'white',
        }));

        const splitDatesCalendarEvents: CalendarEvent[] = res[key]['upcoming-events']['splits'].map((event) => ({
          title: key,
          date: event['reportDate'],
          color: 'purple',
          textColor: 'white',
        }));

        this.events.push(...earningsDatesCalendarEvents);
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
      validRange: {
        start: new Date(),
      },
    };
  }
}
