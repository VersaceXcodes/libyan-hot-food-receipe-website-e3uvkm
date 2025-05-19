import { configureStore, combineReducers, createSlice, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// ----------------------
// Auth State Slice
// ----------------------
interface AuthState {
  is_authenticated: boolean;
  token: string;
  admin_id: string;
  username: string;
}

const initial_auth_state: AuthState = {
  is_authenticated: false,
  token: "",
  admin_id: "",
  username: ""
};

const auth_slice = createSlice({
  name: 'auth_state',
  initialState: initial_auth_state,
  reducers: {
    set_auth_state: (state, action: PayloadAction<AuthState>) => {
      state.is_authenticated = action.payload.is_authenticated;
      state.token = action.payload.token;
      state.admin_id = action.payload.admin_id;
      state.username = action.payload.username;
    },
    clear_auth_state: (state) => {
      state.is_authenticated = false;
      state.token = "";
      state.admin_id = "";
      state.username = "";
    }
  }
});

// ----------------------
// Notification State Slice
// ----------------------
interface NotificationMessage {
  message: string;
  type: string;
}

interface NotificationState {
  messages: NotificationMessage[];
}

const initial_notification_state: NotificationState = {
  messages: []
};

const notification_slice = createSlice({
  name: 'notification_state',
  initialState: initial_notification_state,
  reducers: {
    add_notification: (state, action: PayloadAction<NotificationMessage>) => {
      state.messages.push(action.payload);
    },
    remove_notification: (state, action: PayloadAction<number>) => {
      state.messages.splice(action.payload, 1);
    },
    clear_notifications: (state) => {
      state.messages = [];
    }
  }
});

// ----------------------
// UI Loader State Slice
// ----------------------
interface UiLoaderState {
  is_loading: boolean;
}

const initial_ui_loader_state: UiLoaderState = {
  is_loading: false
};

const ui_loader_slice = createSlice({
  name: 'ui_loader_state',
  initialState: initial_ui_loader_state,
  reducers: {
    set_ui_loading: (state, action: PayloadAction<boolean>) => {
      state.is_loading = action.payload;
    }
  }
});

// ----------------------
// Search State Slice
// ----------------------
interface SearchState {
  search_query: string;
}

const initial_search_state: SearchState = {
  search_query: ""
};

const search_slice = createSlice({
  name: 'search_state',
  initialState: initial_search_state,
  reducers: {
    set_search_query: (state, action: PayloadAction<string>) => {
      state.search_query = action.payload;
    }
  }
});

// ----------------------
// Filter State Slice
// ----------------------
interface FilterState {
  selected_filters: {
    spice_level: string;
    recipe_category_id: string;
  }
}

const initial_filter_state: FilterState = {
  selected_filters: {
    spice_level: "",
    recipe_category_id: ""
  }
};

const filter_slice = createSlice({
  name: 'filter_state',
  initialState: initial_filter_state,
  reducers: {
    set_filter_options: (state, action: PayloadAction<{ spice_level: string, recipe_category_id: string }>) => {
      state.selected_filters.spice_level = action.payload.spice_level;
      state.selected_filters.recipe_category_id = action.payload.recipe_category_id;
    }
  }
});

// ----------------------
// Pagination State Slice
// ----------------------
interface PaginationState {
  current_page: number;
  total_pages: number;
  limit: number;
}

const initial_pagination_state: PaginationState = {
  current_page: 1,
  total_pages: 0,
  limit: 10
};

const pagination_slice = createSlice({
  name: 'pagination_state',
  initialState: initial_pagination_state,
  reducers: {
    set_pagination_state: (state, action: PayloadAction<{ current_page: number, total_pages: number, limit: number }>) => {
      state.current_page = action.payload.current_page;
      state.total_pages = action.payload.total_pages;
      state.limit = action.payload.limit;
    }
  }
});

// ----------------------
// Realtime State Slice
// ----------------------
interface RealtimeState {
  socket: Socket | null;
}

const initial_realtime_state: RealtimeState = {
  socket: null
};

const realtime_slice = createSlice({
  name: 'realtime_state',
  initialState: initial_realtime_state,
  reducers: {
    set_socket: (state, action: PayloadAction<Socket>) => {
      state.socket = action.payload;
    },
    clear_socket: (state) => {
      state.socket = null;
    }
  }
});

// Async thunk to initialize realtime socket (if needed)
const initialize_realtime_socket = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  try {
    const socket_url = import.meta.env.VITE_SOCKET_URL || "";
    if (socket_url) {
      const socket = io(socket_url);
      // Optionally add listeners on the socket here as needed
      dispatch(realtime_slice.actions.set_socket(socket));
    }
  } catch (error) {
    console.error("Error initializing realtime socket:", error);
  }
};

// ----------------------
// Combine All Slices into Root Reducer
// ----------------------
const root_reducer = combineReducers({
  auth_state: auth_slice.reducer,
  notification_state: notification_slice.reducer,
  ui_loader_state: ui_loader_slice.reducer,
  search_state: search_slice.reducer,
  filter_state: filter_slice.reducer,
  pagination_state: pagination_slice.reducer,
  realtime_state: realtime_slice.reducer
});

// Persist configuration (exclude realtime_state which is non-serializable)
const persist_config = {
  key: "root",
  storage,
  whitelist: [
    "auth_state",
    "notification_state",
    "ui_loader_state",
    "search_state",
    "filter_state",
    "pagination_state"
  ]
};

const persisted_reducer = persistReducer(persist_config, root_reducer);

// ----------------------
// Create and Configure Store
// ----------------------
const store = configureStore({
  reducer: persisted_reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

const persistor = persistStore(store);

// ----------------------
// Export Types and Actions
// ----------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const auth_actions = auth_slice.actions;
export const notification_actions = notification_slice.actions;
export const ui_loader_actions = ui_loader_slice.actions;
export const search_actions = search_slice.actions;
export const filter_actions = filter_slice.actions;
export const pagination_actions = pagination_slice.actions;
export const realtime_actions = realtime_slice.actions;
export { initialize_realtime_socket };

export { store, persistor };

// Export default store for direct import
export default store;