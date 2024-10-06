import { expect, test, describe } from '@jest/globals';
import {
  addIngredients,
  deleteIngredient,
  constructorSlice as burgerConstructorSlice,
  initialState,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredients
} from '../slice/constructorSlice';


const ingredient_bio_cutlet = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0,
    id: '123'
  };


describe('Тест редьюсера burgerConstructor', () => {
  test('Добавление булки в конструктор', () => {
    const bun = {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    };

    const state = burgerConstructorSlice.reducer(initialState, {
      type: addIngredients.type,
      payload: bun
    });
    expect(state.bun).toEqual(bun);
  });

  test('Добавление ингредиента в конструктор', () => {
    const action = addIngredients(ingredient_bio_cutlet);
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.ingredients[0]).toEqual({
      ...ingredient_bio_cutlet,
      id: expect.any(String)
    });
  });

  test('Удаление ингредиента из конструктора', () => {
    
    const initialStateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...ingredient_bio_cutlet, id: '1' },
          { ...ingredient_bio_cutlet, id: '2' }
        ]
      
    };

    // 0 - index in array ingredients
    const action = deleteIngredient(0);
    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      action
    );
    expect(state.ingredients[0].id).toBe('2');
  });

  test('Изменение порядка ингредиентов - "вверх"', () => {
    const initialStateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...ingredient_bio_cutlet, id: '1' },
          { ...ingredient_bio_cutlet, id: '2' },
          { ...ingredient_bio_cutlet, id: '3' }
        ]
    };
    const action = moveIngredientUp(1);
    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      action
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
    expect(state.ingredients[2].id).toBe('3');
  });

  test('Изменение порядка ингредиентов - "вниз"', () => {
    const initialStateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...ingredient_bio_cutlet, id: '1' },
          { ...ingredient_bio_cutlet, id: '2' },
          { ...ingredient_bio_cutlet, id: '3' }
        ]
    };
    const action = moveIngredientDown(1);
    const state = burgerConstructorSlice.reducer(
      initialStateWithIngredients,
      action
    );
    expect(state.ingredients[0].id).toBe('1');
    expect(state.ingredients[1].id).toBe('3');
    expect(state.ingredients[2].id).toBe('2');
  });
});