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

  return {
    totalSales,
    totalSalesPerDate,
    totalCups,
    totalDailyCupsSold,
    totalOrders,
    totalAverageDailyCups,
    totalCupsPerSize,
    groupedProductTypes,
  };
}
