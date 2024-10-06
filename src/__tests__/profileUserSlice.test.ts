import {
  authSlice, 
  setUser, 
  setIsAuthChecked, 
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../slice/profileUserSlice';
import { TUser } from '@utils-types';

const testUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

describe('authSlice', () => {
  it('тестирование начального состояния', () => {
    expect(authSlice.reducer(undefined, { type: 'undefined' })).toEqual(
      initialState
    );
  });

  it('тестирование установки пользователя при вызове setUser', () => {
    const nextState = authSlice.reducer(initialState, setUser(testUser));
    expect(nextState.user).toEqual(testUser);
  });

  it('тестирование установки isAuthChecked при вызове setIsAuthChecked', () => {
    const nextState = authSlice.reducer(initialState, setIsAuthChecked(true));
    expect(nextState.isAuthChecked).toBe(true);
  });

  describe('extraReducers', () => {
    it('тестирование сброса ошибки при registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const nextState = authSlice.reducer(initialState, action);
      expect(nextState.error).toBe(null);
    });

    it('тестирование установки пользователя и isAuthChecked при registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: testUser }
      };
      const nextState = authSlice.reducer(initialState, action);
      expect(nextState.user).toEqual(testUser);
      expect(nextState.isAuthChecked).toBe(true);
    });

    it('тестирование наличия ошибки и isAuthChecked при registerUser.rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Error' }
      };
      const nextState = authSlice.reducer(initialState, action);
      expect(nextState.error).toBe('Error');
      expect(nextState.isAuthChecked).toBe(true);
    });

    it('тестирование установки пользователя и isAuthChecked при loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: testUser }
      };
      const nextState = authSlice.reducer(initialState, action);
      expect(nextState.user).toEqual(testUser);
      expect(nextState.isAuthChecked).toBe(true);
    });

    it('тестирование наличия ошибки и isAuthChecked при loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Error' }
      };
      const nextState = authSlice.reducer(initialState, action);
      expect(nextState.error).toBe('Error');
      expect(nextState.isAuthChecked).toBe(true);
    });

    it('тестирование очистки пользователя при logoutUser.fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const nextState = authSlice.reducer(
        { ...initialState, user: testUser },
        action
      );
      expect(nextState.user).toBe(null);
    });

    it('тестирование обновления пользователя при updateUser.fulfilled', () => {
      const updatedUser = { ...testUser, name: 'Updated User' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      const nextState = authSlice.reducer(
        { ...initialState, user: testUser },
        action
      );
      expect(nextState.user).toEqual(updatedUser);
    });
  });
});