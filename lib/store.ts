// import { DocumentData, collection, getDocs, query } from '@firebase/firestore';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { updateCounter } from './firebase/service';
// import { db } from './firebase/firebase';
import { Counter, Order, OrderDetail, Product, ProductSize } from './types';
import { millisToDate } from './utils';

type State = {
  order: Order[];
  orderDetails: OrderDetail[];
  products: Product[];
  queueCount: Counter;
};

type Actions = {
  addOrder: (newOrder: OrderDetail) => void;
  addQueueCount: () => void;
  updateOrder: (id: Product['id'], size: ProductSize, productCost: number, value: number) => void;
  removeOrder: (id: Product['id'], size: ProductSize) => void;
  clearOrder: () => void;
  getProducts: (collectionName: string) => void;
  getQueueCount: (collectionName: string, documentId: string) => void;
};

const initialState: Omit<State, 'products' | 'queueCount'> = {
  order: [],
  orderDetails: [],
};

const useOrderStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        order: [],
        orderDetails: [],
        products: [],
        queueCount: {
          date: 0,
          queueCount: 0,
        },
        addOrder: (newOrder: OrderDetail) => {
          const orderIndex = get().orderDetails.findIndex(
            (order) => order.productId === newOrder.productId && order.size === newOrder.size
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
        updateOrder: (id, size, productCost, value) => {
          const updatedOrders = get().orderDetails.map((orderDetail) =>
            orderDetail.productId === id && orderDetail.size === size
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
          set({ products: products });
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
useOrderStore.getState().getQueueCount('counter', 'queue');

export default useOrderStore;
