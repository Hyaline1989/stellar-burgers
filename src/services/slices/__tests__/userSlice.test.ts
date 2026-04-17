import userReducer, {
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logoutUser,
  clearUser
} from '../userSlice';
import { TUser } from '../../../utils/types';

// Mock cookie functions
jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(() => 'mock-token'),
  deleteCookie: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('user slice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockRegisterData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123'
  };

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('loginUser async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user and isAuthenticated when fulfilled', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set error when rejected', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Invalid credentials';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user and isAuthenticated when fulfilled', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set error when rejected', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const errorMessage = 'User already exists';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchUser async thunk', () => {
    it('should set isLoading to true when pending', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

      const action = { type: fetchUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set user and isAuthenticated when fulfilled', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set error when rejected', () => {
      const initialState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Failed to fetch user';
      const action = {
        type: fetchUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUser async thunk', () => {
    const updatedUser: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    it('should set isLoading to true when pending', () => {
      const initialState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should update user when fulfilled', () => {
      const initialState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        error: null
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });

    it('should set error when rejected', () => {
      const initialState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Failed to update user';
      const action = {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutUser async thunk', () => {
    it('should clear user and isAuthenticated when fulfilled', () => {
      const initialState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearUser action', () => {
    it('should clear user and isAuthenticated', () => {
      const initialState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: 'Some error'
      };

      const action = clearUser();
      const state = userReducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
