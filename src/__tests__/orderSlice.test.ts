import { configureStore } from '@reduxjs/toolkit';
import {
  orderSlice,
  initialState,
  getOrders,
  getFeeds,
  getOrderByNum
} from '../slice/orderSlice';
import { TOrder } from '@utils-types';
import * as api from '@api';
import { error } from 'console';

// Мокируем вызов API
jest.mock('@api');
// мокируем асинхронный Thunk для получения заказов пользователя
const mockGetSelectOrdersApi = api.getOrdersApi as jest.MockedFunction<
  typeof api.getOrdersApi
>;
const mockFeedsOrdersApi = api.getFeedsApi as jest.MockedFunction<
  typeof api.getFeedsApi
>;
const mockGetOrderByNumberApi = api.getOrderByNumberApi as jest.MockedFunction<
  typeof api.getOrderByNumberApi
>;

// Вспомогательная функция для создания стора
const createOrderSliceTestStore = () =>
  configureStore({
    reducer: {
      order: orderSlice.reducer
    }
  });

describe('тестируем orderSlice', () => {
  describe('reducer', () => {
    test('вернуть начальное состояние', () => {
      expect(orderSlice.reducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  test('тестируем getOrders.pending', () => {
    const nextState = orderSlice.reducer(
      initialState,
      getOrders.pending('', undefined)
    );
    expect(nextState).toEqual({
      error: null,
      isLoading: true,
      name: null,
      order: null,
      orderModal: [],
      orders: [],
      profileOrders: [],
      total: null,
      totalToday: null
    });
  });

  test('тестируем getOrders.fulfilled', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2024-09-05T17:04:17',
        updatedAt: '2024-09-05T17:04:18',
        number: 1,
        ingredients: ['ingredient1']
      }
    ];
    const nextState = orderSlice.reducer(
      initialState,
      getOrders.fulfilled(mockOrders, '', undefined)
    );
    expect(nextState).toEqual({
      error: null,
      isLoading: false,
      name: null,
      order: null,
      orderModal: [],
      orders: [],
      profileOrders: mockOrders,
      total: null,
      totalToday: null
    });
  });

  test('тестируем getOrders.rejected', () => {
    const nextState = orderSlice.reducer(
      initialState,
      getOrders.rejected(null, '', undefined)
    );
    expect(nextState).toEqual({
      error: 'Rejected',
      isLoading: false,
      name: null,
      order: null,
      orderModal: [],
      orders: [],
      profileOrders: [],
      total: null,
      totalToday: null
    });
  });
});

describe('тестируем getOrders async action', () => {
  test('тестируем успешное выполнение getOrders', async () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2024-09-05T17:04:17',
        updatedAt: '2024-09-05T17:04:18',
        number: 1,
        ingredients: ['ingredient1']
      }
    ];

    mockGetSelectOrdersApi.mockResolvedValue(mockOrders);
    const store = createOrderSliceTestStore();
    await store.dispatch(getOrders());
    const state = store.getState();
    expect(state.order.error).toEqual(null);
    expect(state.order.profileOrders).toEqual(mockOrders);
  });

  test('тестируем ошибку в выполнении getOrders', async () => {
    mockGetSelectOrdersApi.mockRejectedValue(new Error('Error'));
    const store = createOrderSliceTestStore();
    await store.dispatch(getOrders());
    const state = store.getState();
    expect(state.order.error).toEqual('Error');
    expect(state.order.profileOrders).toEqual([]);
  });
});

describe('тестируем fetchFeed', () => {
  // проверяем, что при выполнении состояния "ожидания" (pending) для действия fetchFeed состояние reducer меняется должным образом
  test('тестируем fetchFeed.pending', () => {
    const action = { type: getFeeds.pending.type };
    const newState = orderSlice.reducer(initialState, action);
    // проверяем, что новое состояние содержит пустые списки заказов, нулевые суммы и отсутствие ошибок
    expect(newState).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  // проверяем, что при выполнении состояния "выполнено" (fulfilled) для действия fetchFeed состояние reducer меняется должным образом
  test('тестируем fetchFeed.fulfilled', () => {
    const mockFeedData = {
      orders: [{ id: 1, name: 'Order 1' }],
      total: 100,
      totalToday: 50
    };
    const action = { type: getFeeds.fulfilled.type, payload: mockFeedData };
    const newState = orderSlice.reducer(initialState, action);
    // проверяем, что новое состояние содержит заказы, общие и сегодняшние суммы из фиктивных данных
    expect(newState).toEqual({
      ...initialState,
      orders: mockFeedData.orders,
      total: mockFeedData.total,
      totalToday: mockFeedData.totalToday
    });
  });

  test('тестируем ошибку в выполнении fetchFeed.rejected', async () => {
    mockFeedsOrdersApi.mockRejectedValue(new Error('Error'));
    const store = createOrderSliceTestStore();
    await store.dispatch(getOrders());
    const state = store.getState();
    expect(state.order.error).toEqual('Error');
    expect(state.order.profileOrders).toEqual([]);
  });


  describe('тестируем getOrderByNumber', () => {

    const mockOrder: TOrder = {
        _id: 'order-id',
        status: 'done',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 2,
        ingredients: []
      };


    // очистка моков перед каждым тестом
    beforeEach(() => {
      mockGetOrderByNumberApi.mockReset();
    });

    describe('reducer', () => {
      // тестирование состояния "ожидание" для действия getDetailsOrder
      // проверяем, что в состоянии появляется флаг ожидания запроса и нет ошибки.
      test('тестируем getDetailsOrder.pending', () => {
        const action = { type: getOrderByNum.pending.type };
        const state = orderSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
           isLoading:true
        });
      });

      test('тестируем getDetailsOrder.fulfilled', () => {
        const action = {
          type: getOrderByNum.fulfilled.type,
          payload: { orders: [mockOrder] }
        };
        const state = orderSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          orderModal: action.payload.orders,
          isLoading: false
        });
      });

      test('тестируем getDetailsOrder.rejected', () => {
       
        const state = orderSlice.reducer(
            initialState,
            getOrderByNum.rejected(null, '', 123)
          );

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: 'Rejected'
        });
      });

    });

    describe('тестируем асинхронные Thunk', () => {
      beforeEach(() => {
        mockGetOrderByNumberApi.mockReset();
      });

      test('тестируем успешное выполнение getDetailsOrder', async () => {
        mockGetOrderByNumberApi.mockResolvedValue({
          success: true,
          orders: [mockOrder]
        });
        const store = createOrderSliceTestStore();
        await store.dispatch(getOrderByNum(123) as any);
        const state = store.getState().order;
        expect(state.orderModal).toEqual([mockOrder]);
        expect(state.isLoading).toBe(false);
      });

      test('тестируем ошибку в выполнении getDetailsOrder', async () => {
        mockGetOrderByNumberApi.mockRejectedValue(new Error('Failed to fetch'));
        const store = createOrderSliceTestStore();
        await store.dispatch(getOrderByNum(123) as any);
        const state = store.getState().order;
        expect(state.orderModal).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Failed to fetch');
      });
    });
  });
});
