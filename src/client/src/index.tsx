import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux_toolkit/index'
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { StorageR } from './handlers/storage';
import './i18n';

export const SR = StorageR()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

serviceWorkerRegistration.unregister();

