import React, { type FC } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppContainer } from './navigation';
import { persistor, store } from './redux';

/**
 * The main App component.
 * We're using the Provider component from react-redux to wrap our AppContainer component, which is the
 * component that contains all of our routes
 * @returns The App component is being returned
 */
const App: FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;
