import { Order, OrderDetail, ProductSize, ProductType } from '@/lib/types';
import { format } from 'date-fns';

export const calculateTotalSales = (orders: Order[]) => {
  return orders.reduce((acc, order) => acc + order.totalPrice, 0);
};

export const calculateTotalCups = (orders: Order[]) => {
  return orders.reduce((total, order) => {
    const orderCups = order.orders.reduce((sum, item) => sum + item.quantity, 0);
    return total + orderCups;
  }, 0);
};

export const calculateAverageDailyCups = (totalCups: number, totalSalesPeriodDays: number) => {
  return Math.round(totalCups / totalSalesPeriodDays);
};

export const calculateTotalOrders = (orders: Order[]) => {
  return orders.length;
};

export const calculateTotalCupsPerSize = (
  orders: Order[],
  category: keyof Pick<OrderDetail, 'quantity' | 'price'>,
  size: ProductSize,
  type: ProductType
) => {
  return orders.reduce((total, order) => {
    const orderCups = order.orders
      .filter((order) => order.size === size && order.type === type)
      .reduce((sum, item) => sum + item[category], 0);
    return total + orderCups;
  }, 0);
};

export const calculateProductTypes = (orders: Order[], type: ProductType) => {
  const allOrders = orders.flatMap((order) => order.orders).filter((order) => order.type === type);

  const groupedOrders = allOrders.reduce<
    Record<string, Pick<OrderDetail, 'productId' | 'quantity' | 'price'>>
  >((acc, order) => {
    const key = `${order.productId}`;

    if (!acc[key]) {
      acc[key] = { productId: order.productId, quantity: 0, price: 0 };
    }

    acc[key].quantity += order.quantity;
    acc[key].price += order.price;

    return acc;
  }, {});

  return Object.values(groupedOrders).sort((a, b) => b.quantity - a.quantity);
};

export const calculateSalesPerDate = (orders: Order[]) => {
  const salesPerDate = orders.reduce<Record<string, { date: string; sales: number }>>(
    (acc, order) => {
      const date = format(order.timestamp, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date: '', sales: 0 };
      }

      acc[date].date = date;
      acc[date].sales += order.totalPrice;
      return acc;
    },
    {}
  );
  return Object.values(salesPerDate);
};

export const calculateDailyCupsSold = (orders: Order[], type: ProductType) => {
  const dailyCupsOld = orders.reduce<Record<string, { date: string; quantity: number }>>(
    (acc, order) => {
      const date = format(order.timestamp, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date: '', quantity: 0 };
      }

      const totalCups = order.orders
        .filter((order) => order.type === type)
        .reduce((sum, item) => sum + item.quantity, 0);

      acc[date].date = date;
      acc[date].quantity += totalCups;
      return acc;
    },
    {}
  );

  return Object.values(dailyCupsOld);
};
