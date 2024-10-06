import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';

export const getFeeds = createAsyncThunk('order/getFeeds', async () => {
  const res = await getFeedsApi();
  return res;
});
export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});
export const getOrderByNum = createAsyncThunk(
  'order/getOrderByNum',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res;
  }
);
export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

interface IOrderState {
  order: TOrder | null;
  name: string | null;
  error: string | null | undefined;
  isLoading: boolean;
  orders: TOrder[];
  orderModal: TOrder[];
  profileOrders: TOrder[];
  total: number | null;
  totalToday: number | null;
}
const initialState: IOrderState = {
  order: null,
  name: null,
  error: null,
  isLoading: false,
  orders: [],
  orderModal: [],
  profileOrders: [],
  total: null,
  totalToday: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.total = 0;
        state.totalToday = 0;
        state.orders = [];
      });
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getOrderByNum.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload.orders;
      })
      .addCase(getOrderByNum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    orderSelector: (state) => state.order,
    isLoadingSelector: (state) => state.isLoading,
    ordersSelector: (state) => state.orders,
    orderModalSelector: (state) => state.orderModal[0],
    profileOrdersSelector: (state) => state.profileOrders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  }
});

export const {
  orderSelector,
  isLoadingSelector,
  ordersSelector,
  orderModalSelector,
  profileOrdersSelector,
  totalSelector,
  totalTodaySelector
} = orderSlice.selectors;

export const { resetOrder } = orderSlice.actions;
