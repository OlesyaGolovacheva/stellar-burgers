import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from '../slice/ingredientsSlice';
import { orderSlice } from '../slice/orderSlice';
import { constructorSlice } from '../slice/constructorSlice';
import { authSlice } from '../slice/profileUserSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  constructorSlice,
  authSlice
); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
