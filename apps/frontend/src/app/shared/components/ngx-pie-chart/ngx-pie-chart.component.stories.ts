import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NgxPieChartComponent } from './ngx-pie-chart.component';
import { SharedModule } from '../../shared.module';

export default {
  title: 'NgxPieChart',
  component: NgxPieChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedModule],
    }),
  ],
} as Meta<NgxPieChartComponent>;

const Template: Story<NgxPieChartComponent> = (args: NgxPieChartComponent) => ({
  component: NgxPieChartComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  pieChartItems: [
    { name: 'MSFT', value: 25 },
    { name: 'AMZN', value: 25 },
    { name: 'AAPL', value: 25 },
    { name: 'NFLX', value: 25 },
  ],
};
