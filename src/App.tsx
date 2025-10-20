import React from 'react';
import { IonApp, IonRouterOutlet, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { WebSocketProvider } from './context/WebSocketContext';

import DeveloperListPage from './pages/DeveloperListPage';
import AddDeveloperPage from './pages/DeveloperAddPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';
import { AuthProvider } from './context/AuthContext';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <WebSocketProvider>
      <AuthProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/login" render={() => (
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            )} />
            <Route path="/register" render={() => (
              <GuestGuard>
                <RegisterPage />
              </GuestGuard>
            )} />

            <Route path="/developers" render={() => (
                <DeveloperListPage />
            )} />

            <Route exact path="/developers/add" component={AddDeveloperPage} />

            <Route render={() => <Redirect to="/login" />} />
          </IonRouterOutlet>

        </IonTabs>
      </IonReactRouter>
      </AuthProvider>
    </WebSocketProvider>
  </IonApp>
);

export default App;
