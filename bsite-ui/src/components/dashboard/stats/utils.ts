import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import {format, subDays} from "date-fns";

export const crmBreadcrumb: BreadcrumbType[] = [
  {
    title: "dashboards",
    disabled: false,
    to: "/",
  },
  {
    title: "crm",
    disabled: true,
  },
];

export const chartFilter = [
  {
    title: 'TODAY',
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  },
  {
    title: 'YESTERDAY',
    start_date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    end_date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
  },
  {
    title: '1D',
    start_date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  },
  {
    title: '1W',
    start_date: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  },
  {
    title: '1M',
    start_date: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  },
]

export const getCharts = (getChartColorsArray: Function) => {
  const balanceOverviewChart = {
    series: [],
    chartOptions: {
      chart: {
        animations: {
          enabled: false
        },
        height: 300,
        type: "line",
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: getChartColorsArray(
              '["--tb-primary", "--tb-dark", "--tb-danger"]'
          ),
          opacity: 0.25,
        },
      },
      markers: {
        size: 0,
        strokeColors: getChartColorsArray(
            '["--tb-primary", "--tb-dark", "--tb-danger"]'
        ),
        strokeWidth: 2,
        strokeOpacity: 0.9,
        fillOpacity: 1,
        radius: 0,
        hover: {
          size: 5,
        },
      },
      grid: {
        show: true,
        padding: {
          top: -20,
          right: 0,
          bottom: 0,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
        tickAmount: 8,
        labels: {
          rotate: 0,
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1,
          },
        },
      },
      stroke: {
        width: [2, 2, 2],
        curve: "smooth",
      },
      colors: getChartColorsArray(
          '["--tb-primary", "--tb-dark", "--tb-danger"]'
      ),
    },
  };

  return {
    balanceOverviewChart,
  };
};
