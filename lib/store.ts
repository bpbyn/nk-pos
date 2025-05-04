import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { updateCounter } from './firebase/service';
import {
  Counter,
  Extra,
  Order,
  OrderDetail,
  OrderExtra,
  Product,
  ProductSize,
  User,
} from './types';
import { millisToDate } from './utils';

type State = {
  orders: Order[];
  orderDetails: OrderDetail[];
  products: Product[];
  extras: Extra[];
  queueCount: Counter;
  user: User | undefined;
};

type Actions = {
  addOrder: (newOrder: OrderDetail) => void;
  addQueueCount: () => void;
  updateOrder: (
    id: Product['id'],
    size: ProductSize,
    productCost: number,
    extras: OrderExtra[],
    value: number
  ) => void;
  removeOrder: (id: Product['id'], size: ProductSize) => void;
  clearOrder: () => void;
  getProducts: (collectionName: string) => void;
  getQueueCount: (collectionName: string, documentId: string) => void;
};

const initialState: Omit<State, 'products' | 'extras' | 'queueCount' | 'user'> = {
  orders: [],
  orderDetails: [],
};

const useOrderStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        orders: [],
        orderDetails: [],
        products: [],
        extras: [],
        queueCount: {
          date: 0,
          queueCount: 0,
        },
        user: undefined,
        addOrder: (newOrder: OrderDetail) => {
          const orderIndex = get().orderDetails.findIndex(
            (order) =>
              order.productId === newOrder.productId &&
              order.size === newOrder.size &&
              JSON.stringify(order.extras || []) === JSON.stringify(newOrder.extras || [])
          );
          if (orderIndex > -1) {
            const currentOrders = [...get().orderDetails];
            currentOrders[orderIndex].quantity += newOrder.quantity;
            currentOrders[orderIndex].price += newOrder.price;
            set(() => ({ orderDetails: currentOrders }));
          } else {
            set((state) => ({ orderDetails: [...state.orderDetails, newOrder] }));
          }
        },
        updateOrder: (id, size, productCost, extras, value) => {
          const updatedOrders = get().orderDetails.map((orderDetail) =>
            orderDetail.productId === id &&
            orderDetail.size === size &&
            JSON.stringify(orderDetail.extras || []) === JSON.stringify(extras || [])
              ? {
                  ...orderDetail,
                  quantity: value,
                  price: productCost * value,
                }
              : orderDetail
          );

          set(() => ({ orderDetails: updatedOrders }));
        },
        removeOrder: (id, size) => {
          const updatedOrders = get().orderDetails.filter(
            (orderDetail) => !(orderDetail.productId === id && orderDetail.size === size)
          );
          set(() => ({ orderDetails: updatedOrders }));
        },
        clearOrder: () => set(initialState),
        getProducts: async (collectionName: string) => {
          const response = await fetch(`/api/get-products?collectionName=${collectionName}`, {
            method: 'GET',
          });

          const products = await response.json();
          set({ [collectionName]: products });
        },
        getQueueCount: async (collectionName: string, documentId: string) => {
          const response = await fetch(
            `/api/get-queue-count?collectionName=${collectionName}&documentId=${documentId}`,
            {
              method: 'GET',
            }
          );
          const queueCount = (await response.json()) as Counter;

          const previousDate = millisToDate(queueCount.date);
          const currentDate = millisToDate(Date.now());

          // reset the counter to 1 if date from firebase and date today is not equal
          if (previousDate !== currentDate) {
            await updateCounter(1);
            set({
              queueCount: {
                date: Date.now(),
                queueCount: 1,
              },
            });
          } else {
            set({ queueCount: queueCount });
          }
        },
        addQueueCount: () => {
          set((state) => ({
            queueCount: {
              date: state.queueCount.date,
              queueCount: state.queueCount.queueCount + 1,
            },
          }));
        },
      }),

      {
        name: 'cart',
      }
    )
  )
);

useOrderStore.getState().getProducts('products');
useOrderStore.getState().getProducts('extras');
useOrderStore.getState().getQueueCount('counter', 'queue');

export default useOrderStore;
