import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux_toolkit';
import { Navigate } from './components/Navigate/Navigate';
import { LeftDrawer } from './components/Drawer/Drawer'
import { Main } from './components/Main/Main';
import { Dialogs } from './components/Dialogs/Dialogs';
import { ProgressLoading } from './components/ProgressLoading/ProgressLoading';
import { ThemeProvider } from './providers/Theme';
import { SubscribeProvider } from './providers/Subscribe';
import { themeApp, themeCreate } from './styles/_default';
import { loadFlag } from './redux_toolkit/slices/global';
import { ToastContainer } from 'react-toastify';
import { Register } from './pages/Register/Register';
import { RequestProvider } from './providers/Request';
import { SocketProvider } from './providers/Socket'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import 'react-medium-image-zoom/dist/styles.css'
import './sass/_app.scss'


function App() {
  const globalState = useSelector((state: RootState) => state.global)
  const styles = themeCreate(themeApp)
  return (
    <RequestProvider>
      <SocketProvider>
        <ThemeProvider>
          <SubscribeProvider>
            <main
              style={styles}
              data-theme={globalState.theme}
              data-load={loadFlag(globalState.load)}
              data-ready-app={globalState.readyApp}
              className='main'>
              <div className='m-container'>
                {globalState.readyApp ? (
                  <>
                    <Main />
                    <ProgressLoading />
                    <Navigate />
                  </>
                ) : <Register owner={true} />}
              </div>
              <LeftDrawer />
              <Dialogs />
              <ToastContainer
                theme={globalState.theme === 'light' ? 'light' : 'dark'}
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </main>
          </SubscribeProvider>
        </ThemeProvider>
      </SocketProvider>
    </RequestProvider>
  );
}

export default App;
