import { TIngredient } from '@utils-types';
import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from '../slice/ingredientsSlice';
import * as api from '@api';

// Мокируем вызов API
jest.mock('@api');
// мокируем асинхронный Thunk для получения данных ингредиентов
const mockGetIngredientsApi = api.getIngredientsApi as jest.MockedFunction<
  typeof api.getIngredientsApi
>;

describe('тестируем ingredientsSlice', () => {
  describe('reducer', () => {
    test('тестируем getIngredients.pending', () => {
      const action = fetchIngredients.pending('', undefined, {});
      const actual = ingredientsSlice.reducer(initialState, action);
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBe(null);
    });

    test('тестируем getIngredients.fulfilled', async () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: ' ',
          image_mobile: ' ',
          image_large: ' '
        },
        {
          _id: '643d69a5c3f7b9001cfa0942',
          name: 'Соус Spicy-X',
          type: 'sauce',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: ' ',
          image_mobile: ' ',
          image_large: ' '
        }
      ];
      const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
      const actual = ingredientsSlice.reducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.ingredients).toEqual(mockIngredients);
    });

    test('тестируем getIngredients.rejected', async () => {
      mockGetIngredientsApi.mockRejectedValueOnce(new Error('Ошибка'));
      const action = fetchIngredients.rejected(null, '');
      const actual = ingredientsSlice.reducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe('Rejected');
    });
  });
});