import {
  calculateAverageDailyCups,
  calculateDailyCupsSold,
  calculateProductTypes,
  calculateSalesPerDate,
  calculateTotalCups,
  calculateTotalCupsPerSize,
  calculateTotalOrders,
  calculateTotalSales,
} from '@/app/analytics/analytics';
import { CupsAnalytics, Order, ProductSize, ProductType, productSize } from '@/lib/types';
import { ChartSpline, CupSoda, PhilippinePeso, SquarePen } from 'lucide-react';
import { useMemo } from 'react';

export function useAnalytics(orders: Order[], type: ProductType) {
  const totalSales = useMemo(() => calculateTotalSales(orders), [orders]);
  const totalSalesPerDate = useMemo(() => calculateSalesPerDate(orders), [orders]);
  const totalCups = useMemo(() => calculateTotalCups(orders), [orders]);
  const totalDailyCupsSold = useMemo(() => calculateDailyCupsSold(orders, type), [orders, type]);
  const totalOrders = useMemo(() => calculateTotalOrders(orders), [orders]);
  const totalAverageDailyCups = useMemo(
    () => calculateAverageDailyCups(totalCups, totalSalesPerDate.length),
    [totalCups, totalSalesPerDate.length]
  );

  const totalCupsPerSize = useMemo(() => {
    const totalRegularCups = calculateTotalCupsPerSize(
      orders,
      'quantity',
      productSize.regular.toLocaleLowerCase() as ProductSize,
      type
    );

    const totalLargeCups = calculateTotalCupsPerSize(
      orders,
      'quantity',
      productSize.large.toLocaleLowerCase() as ProductSize,
      type
    );

    const totalRegularPrice = calculateTotalCupsPerSize(
      orders,
      'price',
      productSize.regular.toLocaleLowerCase() as ProductSize,
      type
    );

    const totalLargePrice = calculateTotalCupsPerSize(
      orders,
      'price',
      productSize.large.toLocaleLowerCase() as ProductSize,
      type
    );

    const totalCups = totalRegularCups + totalLargeCups;
    const totalPrice = totalRegularPrice + totalLargePrice;

    const cups: CupsAnalytics[] = [
      {
        regular: totalRegularCups,
        large: totalLargeCups,
        total: totalCups,
      },
      {
        regular: totalRegularPrice,
        large: totalLargePrice,
        total: totalPrice,
      },
    ];

    return cups;
  }, [orders, type]);

  const groupedProductTypes = useMemo(() => calculateProductTypes(orders, type), [orders, type]);

  const analyticsCard = useMemo(
    () => [
      {
        title: 'Total Sales',
        icon: <PhilippinePeso className="h-4 w-4 text-muted-foreground" />,
        value: `₱${totalSales}`,
        valueDescription: 'Total revenue generated',
      },
      {
        title: 'Total Cups',
        icon: <CupSoda className="h-4 w-4 text-muted-foreground" />,
        value: totalCups,
        valueDescription: 'Total cups sold to date',
      },
      {
        title: 'Average Daily Cups',
        icon: <ChartSpline className="h-4 w-4 text-muted-foreground" />,
        value: totalAverageDailyCups || 0,
        valueDescription: 'Average cups sold per day',
      },
      {
        title: 'Total Orders',
        icon: <SquarePen className="h-4 w-4 text-muted-foreground" />,
        value: totalOrders,
        valueDescription: 'Total orders processed',
      },
    ],
    [totalAverageDailyCups, totalCups, totalOrders, totalSales]
  );

  return {
    totalSales,
    totalSalesPerDate,
    totalCups,
    totalDailyCupsSold,
    totalOrders,
    totalAverageDailyCups,
    totalCupsPerSize,
    groupedProductTypes,
    analyticsCard,
  };
}
