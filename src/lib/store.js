import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener
} from 'react-navigation-redux-helpers';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../epics';
import rootReducer from '../ducks';

const epicMiddleware = createEpicMiddleware(rootEpic);
const tabBarMiddleware = createReactNavigationReduxMiddleware(
  'tabBar',
  state => state.tabBar
);
const mainStackMiddleware = createReactNavigationReduxMiddleware(
  'mainStack',
  state => state.mainStack
);
export const tabBarAddListener = createReduxBoundAddListener('tabBar');
export const mainStackAddListener = createReduxBoundAddListener('mainStack');

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

export function configureStore() {
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    applyMiddleware(mainStackMiddleware, epicMiddleware, tabBarMiddleware)
  );
  const persistor = persistStore(store);

  return { store, persistor };
}

export function createInitialStore() {
  return {
    observations: {},
    categories: {},
    modals: {
      saved: false
    },
    drawers: {
      opened: false
    }
  };
}
